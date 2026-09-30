# 星野 · StarSky Studio

**从地球视角探索完整的360°星空，创作实时星空与星轨视频。**

**Explore a full 360° sky from an Earth-based viewpoint and create real-time sky and star-trail videos.**

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC_BY_4.0-lightgrey.svg)](LICENSE)

![星野星轨取景界面 / StarSky Studio star-trail composition](docs/preview.jpeg)

*界面效果示例，来自开发期间截图；当前版本另有1080P、4K和视频导出选项。 / Development screenshot; the current release also includes 1080P, 4K and video export controls.*

## 中文

星野是一个在本机运行的星空取景与视频创作工具。观察者位于完整星空球的中心，可以连续转动视角、越过天顶和下半球，没有地景遮挡或图片边缘。支持设置日期、时间、经纬度和时间流速，用同一个构图生成实时星空或加速星轨。

### 功能

- 完整360°球面方向与透视投影；自由环顾、缩放和画面旋转。
- 41,411条恒星记录，主星标记，一键对准牛郎星、织女星和天津四。
- 时间流速与轨迹保留独立控制，可复现的模拟流星。
- 标准、1080P、4K输出；横屏、竖屏和4:3取景。
- MP4 / MOV；默认H.265，可选H.264。无WebM成片选项。
- 原生保存窗口选择文件名与文件夹。文件名包含本地导出时间，精确到分钟，如 `星野-202609302227-1920x1080-60秒-H265.mp4`。
- 优先逐帧生成30fps，再在本机编码；显示编码进度、帧数和耗时，支持取消。

### 运行

1. 下载 [Release](https://github.com/Wenshuishi0528/StarSkyStudio/releases) 的 ZIP 并解压。
2. 准备 **Python 3.9+、FFmpeg（含libx264/libx265）**，以及桌面版 **Chrome / Edge**。Python无需额外依赖；FFmpeg需在PATH中，macOS也检查常见安装位置。
3. macOS双击 `启动星野.command`，或在项目目录执行：

   ```sh
   python3 server.py
   ```

4. 用Chrome或Edge打开终端显示的本机网址。服务默认监听 `127.0.0.1:8765`，端口被占用时会选择其他端口。保持终端开启，结束时按Ctrl+C。
5. 调整天空与取景，选择输出分辨率、格式、编码和时长，点击“选择保存位置…”后导出。不要在聊天软件内嵌网页中导出：部分内嵌窗口不提供原生文件选择接口。

直接打开 `index.html` 可以预览；完整视频导出需要本机服务。代码与星表随包提供，渲染和视频编码无需云端上传。macOS已实测；其他平台可使用Python启动，但尚未完成平台验证。当前界面为中文。

### 分辨率

| 比例 | 标准 | 1080P | 4K |
|---|---|---|---|
| 16:9 | 1280×720 | 1920×1080 | 3840×2160 |
| 9:16 | 720×1280 | 1080×1920 | 2160×3840 |
| 4:3 | 1200×900 | 1440×1080 | 3840×2880 |

星点和轨迹直接绘制到目标分辨率；银河使用较低采样的艺术纹理。4K的4:3模式为3840×2880，像素量高于常见UHD，部分设备会回退软件编码，耗时可能超过视频时长。

### 操作与时间

拖动环顾，滚轮缩放，方向键微调，Q/E旋转，Shift加速微调。“画面回正”清除倾斜；“沉浸取景”进入全屏，Escape退出。日期、经纬度、UTC偏移或速度变更会重置片段；一般画面调整保留进度。刷新页面会恢复默认设置。

默认60秒，可设5–120秒。实时模式为1×点状星空，星轨预设为120×并持续累积：60秒成片对应两小时天空变化。**UTC偏移需手动考虑当地夏令时**。Cougar预设为2026-07-18 22:54，UTC−7，坐标为附近近似值，并非核实后的精确拍摄点。

请保持导出页面可见；切换标签页会取消任务。优先使用WebCodecs逐帧生成；缺少相应能力时回退实时采集，实际流畅度取决于设备。编码优先尝试硬件，再明确回退软件。连续120秒无编码进展会结束该次尝试并进入备用方案；总编码时限30分钟。

## English

StarSky Studio is a local sky-composition and video-creation tool. Its camera sits at the center of a complete spherical sky, with continuous rotation through the zenith and lower hemisphere. It has no landscape masking or flat-image boundaries. Set the observation date, time, location and playback speed to compose real-time sky or accelerated star-trail clips.

### Features

- Full 360° viewing, perspective projection, zoom and camera roll.
- 41,411 star records, bright-star labels and Summer Triangle framing.
- Independent time speed and trail retention; reproducible simulated meteors.
- Standard, 1080P and 4K rendering in landscape, portrait and 4:3 formats (dimensions above).
- MP4 / MOV output, default H.265 with optional H.264. No WebM final output.
- Native save dialog and minute-precision local timestamps in filenames.
- Frame-by-frame 30fps generation when supported, local encoding, progress reporting and cancellation.

### Quick start

Download and extract the [release ZIP](https://github.com/Wenshuishi0528/StarSkyStudio/releases). Install Python 3.9+, FFmpeg with libx264/libx265, and desktop Chrome or Edge. No Python packages are required. From the extracted directory run:

```sh
python3 server.py
```

On macOS you can also double-click `启动星野.command`. Open the URL printed by the server in desktop Chrome or Edge. Keep the terminal open; press Ctrl+C to stop. The server binds only to localhost, normally port 8765, and chooses another port if occupied. No cloud upload is involved. Opening `index.html` directly supports preview only; complete video export requires the local server. macOS has been tested; other platforms are not yet verified. The application UI is currently Chinese.

Drag to look around, scroll to zoom, use arrow keys for fine adjustments and Q/E for roll. Shift increases keyboard step size. Select a resolution, container and codec, choose a destination, then export. Embedded chat browsers may not support the save picker; use a standalone browser window. Keep the export tab visible. Refreshing resets the configuration.

The default clip is 60 seconds (5–120 seconds supported). At 1×, one video minute represents one simulated minute. The 120× star-trail preset represents two hours in one video minute. Enter the correct UTC offset manually, including daylight saving time. The Cougar preset uses approximate coordinates and is not a verified camera location.

Video generation can take longer than playback duration. Frame-by-frame output uses a 30fps timeline; the real-time capture fallback depends on device performance. Hardware encoding is attempted first, followed by software encoding. The 3840×2880 4:3 setting exceeds UHD pixel count and may require software encoding.

## 精度与数据 / Accuracy and data

This is a creative prototype, not a precision observation planner. Star directions include approximate precession and sidereal-time rotation. The lower hemisphere intentionally remains visible. The Milky Way is a procedural artistic texture and meteors are simulated. The app does not model daylight brightness, the Moon, planets, terrain, atmospheric refraction, weather, light pollution, nutation or stellar proper motion. Supported dates: 1900–2100. Original HEIC photos are not included.

恒星来自 [d3-celestial stars.8.json](https://github.com/ofrohn/d3-celestial/blob/master/data/stars.8.json)，其原始数据为 **XHIP: An Extended Hipparcos Compilation**, Anderson & Francis (2012), VizieR V/137D。`data/stars.js`保留HIP、J2000赤经/赤纬、星等及B−V字段。有关原始项目的数据说明见 [d3-celestial](https://github.com/ofrohn/d3-celestial#files)。

## 开发与测试 / Development and tests

```sh
node astro.test.cjs
node app.test.cjs
python3 server.test.py
```

The tests cover sky transforms, continuous pole crossings, camera orthogonality, trail reproducibility, all output dimensions, save-picker feedback, filename timestamps, local encoding, cancellation before encoding and authenticated progress access. Node.js is needed only for JavaScript tests. The Python encoder tests require FFmpeg and ffprobe.

Browser checks confirmed native save-dialog operation in Chrome, 3840×2160 H.265 export at 30fps (5 seconds / 150 frames), and the local encoder fallback for 3840×2880 H.265 (1 second / 30 frames). These short checks do not imply that every duration and hardware combination has been tested.

## 许可证 / License

本项目原创代码、文档和展示图采用 **[CC BY 4.0](LICENSE)**，署名 **Wenshuishi / StarSky Studio**，请保留项目链接并标注修改。第三方材料仍遵守各自许可证；d3-celestial相关材料的原许可证保留于 [data/D3-CELESTIAL-LICENSE.txt](data/D3-CELESTIAL-LICENSE.txt)。

Original code, documentation and the preview image are licensed under **[Creative Commons Attribution 4.0 International](LICENSE)**. Attribute **Wenshuishi / StarSky Studio**, link to this repository and identify changes. Third-party materials retain their original terms; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
