#!/usr/bin/env python3
"""Loopback-only static app and local FFmpeg export service. No cloud upload."""
import argparse
import json
import os
import re
from pathlib import Path
import secrets
import shutil
import subprocess
import tempfile
import threading
import time
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlsplit, parse_qs

ROOT = Path(__file__).resolve().parent
FFMPEG = shutil.which('ffmpeg') or next((p for p in ['/usr/local/bin/ffmpeg', '/opt/homebrew/bin/ffmpeg'] if Path(p).is_file()), None)
FORMATS = {'hevc': ('.mp4', 'video/mp4'), 'h264': ('.mp4', 'video/mp4'), 'hevc_mov': ('.mov', 'video/quicktime'), 'h264_mov': ('.mov', 'video/quicktime')}
JOBS = {}
LOCK = threading.Lock()
TOKEN = secrets.token_urlsafe(32)


def transcode(source, destination, fmt, job):
    if not FFMPEG:
        raise RuntimeError('本机未找到FFmpeg')
    if fmt not in FORMATS:
        raise ValueError('不支持的导出格式')
    if fmt in ('hevc', 'hevc_mov'):
        options = [
            ['-c:v', 'hevc_videotoolbox', '-allow_sw', '0', '-prio_speed', '1', '-b:v', '30M', '-tag:v', 'hvc1'],
            ['-c:v', 'libx265', '-preset', 'veryfast', '-crf', '20', '-tag:v', 'hvc1'],
        ]
    elif fmt in ('h264', 'h264_mov'):
        options = [
            ['-c:v', 'h264_videotoolbox', '-allow_sw', '0', '-prio_speed', '1', '-b:v', '35M'],
            ['-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18'],
        ]
    error = ''
    job.setdefault('started', time.monotonic())
    for codec in options:
        if job['cancel'].is_set():
            raise RuntimeError('导出已取消')
        cmd = [FFMPEG, '-nostdin', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(source), '-map', '0:v:0', '-an', '-r', '30', '-pix_fmt', 'yuv420p', *codec]
        cmd += ['-movflags', '+faststart']
        cmd += [str(destination)]
        job.update(phase='encoding', frame=0, encoder=codec[1])
        with tempfile.TemporaryDirectory(prefix='starsky-progress-') as progress_dir, tempfile.TemporaryFile() as errors:
            progress_path = Path(progress_dir)/'progress.txt'
            cmd[1:1] = ['-progress', str(progress_path), '-stats_period', '1']
            proc = subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=errors)
            job['process'] = proc
            last_frame, last_change = -1, time.monotonic()
            stalled = False
            try:
                while proc.poll() is None:
                    if job['cancel'].is_set():
                        proc.terminate()
                        break
                    if progress_path.exists():
                        values = dict(line.split('=', 1) for line in progress_path.read_text().splitlines() if '=' in line)
                        frame = int(values.get('frame', '0').strip() or 0)
                        job.update(frame=frame, speed=values.get('speed', '').strip())
                        if frame != last_frame:
                            last_frame, last_change = frame, time.monotonic()
                    if time.monotonic()-last_change > 120 or time.monotonic()-job['started'] > 1800:
                        stalled = True
                        proc.kill()
                        break
                    time.sleep(.25)
                try:
                    proc.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    proc.kill()
                    proc.wait()
            finally:
                job['process'] = None
            if job['cancel'].is_set():
                raise RuntimeError('导出已取消')
            errors.seek(0)
            error = '编码连续120秒无进展或超过总时限' if stalled else errors.read().decode('utf-8', 'replace')[-2000:]
            if proc.returncode == 0:
                job.update(phase='saving', frame=job.get('total_frames', job.get('frame', 0)))
                return
    raise RuntimeError('编码失败：' + error)


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def trusted(self, api=False):
        port = self.server.server_address[1]
        hosts = {f'127.0.0.1:{port}', f'localhost:{port}'}
        if self.headers.get('Host') not in hosts:
            self.send_error(403)
            return False
        origin = self.headers.get('Origin')
        if origin and origin not in {f'http://{h}' for h in hosts}:
            self.send_error(403)
            return False
        if self.headers.get('Sec-Fetch-Site') == 'cross-site':
            self.send_error(403)
            return False
        if api and not secrets.compare_digest(self.headers.get('X-StarSky-Token', ''), TOKEN):
            self.send_error(403)
            return False
        return True

    def json_response(self, code, data):
        body = json.dumps(data, ensure_ascii=False).encode()
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if not self.trusted():
            return
        path = urlsplit(self.path).path
        if path.startswith('/api/jobs/'):
            if not self.trusted(api=True):
                return
            with LOCK:
                job = JOBS.get(path.removeprefix('/api/jobs/'))
                data = {key: job.get(key) for key in ('phase', 'frame', 'total_frames', 'encoder', 'speed')} if job else None
                if job:
                    data['elapsed'] = round(time.monotonic()-job['started'])
            self.json_response(200 if data else 404, data or {'error': '任务尚未开始或已经完成'})
        elif path in ('/', '/index.html'):
            html = (ROOT/'index.html').read_text()
            # Refresh changed scripts without throwing away cached large sky textures.
            html = re.sub(r'((?:src|href)=")([^"?]+\.(?:js|css))"',
                          lambda m: f'{m[1]}{m[2]}?v={(ROOT/m[2]).stat().st_mtime_ns}"', html)
            body = html.replace('</head>', '<script>window.STARSKY_SERVICE=' + json.dumps({'token': TOKEN, 'available': bool(FFMPEG)}) + ';</script></head>').encode()
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.send_header('Cache-Control', 'no-store')
            self.end_headers()
            self.wfile.write(body)
        elif path in ('/i18n.js', '/galaxy.js', '/star-chart.js', '/data/star-chart.json', '/immersive.js', '/vendor/astronomy.js', '/data/stars3d.js', '/universe.js', '/space-renderer.js', '/style.css', '/astro.js', '/app.js', '/mp4.js', '/data/stars.js', '/data/D3-CELESTIAL-LICENSE.txt'):
            super().do_GET()
        elif path in {f'/data/sky/milkyway-{size}k-{face}.jpg' for size in (4, 8, 16) for face in ('px', 'nx', 'py', 'ny', 'pz', 'nz')}:
            super().do_GET()
        else:
            self.send_error(404)

    def do_DELETE(self):
        if not self.trusted(api=True):
            return
        job_id = urlsplit(self.path).path.removeprefix('/api/jobs/')
        with LOCK:
            job = JOBS.get(job_id)
            if job:
                job['cancel'].set()
                proc = job.get('process')
                if proc and proc.poll() is None:
                    proc.terminate()
        self.json_response(200, {'cancelled': bool(job)})

    def do_POST(self):
        if not self.trusted(api=True):
            return
        url = urlsplit(self.path)
        if url.path != '/api/transcode':
            self.send_error(404)
            return
        args = parse_qs(url.query)
        fmt = args.get('format', [''])[0]
        job_id = args.get('job', [''])[0]
        try:
            length = int(self.headers.get('Content-Length', '0'))
        except ValueError:
            length = 0
        if fmt not in FORMATS or not 0 < length <= 2*1024**3 or not job_id or len(job_id) > 100:
            self.json_response(400, {'error': '无效的导出请求或视频过大'})
            return
        try:
            total_frames = max(0, min(3600, int(args.get('frames', ['0'])[0])))
        except ValueError:
            total_frames = 0
        job = {'cancel': threading.Event(), 'process': None, 'phase': 'uploading', 'frame': 0, 'total_frames': total_frames, 'started': time.monotonic()}
        with LOCK:
            if JOBS:
                self.json_response(409, {'error': '已有本地编码正在进行，请稍后再试'})
                return
            JOBS[job_id] = job
        try:
            with tempfile.TemporaryDirectory(prefix='starsky-export-') as directory:
                source = Path(directory)/'source.video'
                with source.open('wb') as file:
                    remaining = length
                    while remaining:
                        if job['cancel'].is_set():
                            raise RuntimeError('导出已取消')
                        chunk = self.rfile.read(min(1024*1024, remaining))
                        if not chunk:
                            raise RuntimeError('输入视频传输中断')
                        file.write(chunk)
                        remaining -= len(chunk)
                suffix, mime = FORMATS[fmt]
                target = Path(directory)/('export'+suffix)
                transcode(source, target, fmt, job)
                self.send_response(200)
                self.send_header('Content-Type', mime)
                self.send_header('Content-Length', str(target.stat().st_size))
                self.end_headers()
                with target.open('rb') as file:
                    shutil.copyfileobj(file, self.wfile)
        except (BrokenPipeError, ConnectionResetError):
            pass
        except Exception as exc:
            try:
                self.json_response(500, {'error': str(exc)})
            except (BrokenPipeError, ConnectionResetError):
                pass
        finally:
            with LOCK:
                JOBS.pop(job_id, None)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=8765)
    parser.add_argument('--no-open', action='store_true')
    args = parser.parse_args()
    try:
        server = ThreadingHTTPServer(('127.0.0.1', args.port), Handler)
    except OSError:
        server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
    url = f'http://127.0.0.1:{server.server_address[1]}/'
    print('星野已启动：'+url, flush=True)
    print('本地编码器：'+str(FFMPEG), flush=True)
    if not args.no_open:
        import webbrowser
        webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        with LOCK:
            for job in JOBS.values():
                job['cancel'].set()
                if job.get('process'):
                    job['process'].terminate()
        server.server_close()


if __name__ == '__main__':
    main()
