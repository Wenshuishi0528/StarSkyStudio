"""Real encoder regression: progress, final format, and cancellation."""
import json
from pathlib import Path
import subprocess
import tempfile
import threading
import time
import unittest
import server

class ExportTests(unittest.TestCase):
    def test_progress_and_output(self):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory)/'source.mp4'
            target = Path(directory)/'final.mp4'
            subprocess.run([server.FFMPEG, '-v', 'error', '-f', 'lavfi', '-i',
                            'testsrc2=s=1280x720:r=30', '-t', '2', '-c:v', 'libx264', str(source)], check=True)
            job = {'cancel': threading.Event(), 'process': None, 'total_frames': 60}
            server.transcode(source, target, 'hevc', job)
            self.assertEqual(job['phase'], 'saving')
            self.assertEqual(job['frame'], 60)
            self.assertIsNone(job['process'])
            probe = str(Path(server.FFMPEG).with_name('ffprobe'))
            data = json.loads(subprocess.check_output([probe, '-v', 'error', '-show_entries',
                'stream=codec_name,nb_frames,r_frame_rate', '-of', 'json', str(target)]))['streams'][0]
            self.assertEqual(data, {'codec_name':'hevc', 'r_frame_rate':'30/1', 'nb_frames':'60'})

    def test_cancel_before_start(self):
        event = threading.Event()
        event.set()
        with self.assertRaisesRegex(RuntimeError, '取消'):
            server.transcode('unused', 'unused.mp4', 'hevc', {'cancel':event})

    def test_status_is_authenticated(self):
        from http.client import HTTPConnection
        http = server.ThreadingHTTPServer(('127.0.0.1', 0), server.Handler)
        worker = threading.Thread(target=http.serve_forever, daemon=True)
        worker.start()
        server.JOBS['test'] = {'started':time.monotonic(), 'phase':'encoding', 'frame':30, 'total_frames':60}
        try:
            c = HTTPConnection('127.0.0.1', http.server_port)
            c.request('GET', '/api/jobs/test')
            r = c.getresponse(); self.assertEqual(r.status, 403); r.read()
            c.request('GET', '/api/jobs/test', headers={'X-StarSky-Token':server.TOKEN})
            r = c.getresponse(); self.assertEqual(r.status, 200)
            self.assertEqual(json.loads(r.read())['frame'], 30)
            c.close()
        finally:
            server.JOBS.pop('test', None)
            http.shutdown(); http.server_close(); worker.join()

if __name__ == '__main__':
    unittest.main()
