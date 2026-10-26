# 星野 · StarSky Studio · v0.4.0

**[打开在线星野 / Open StarSky in your browser](https://wenshuishi0528.github.io/StarSkyStudio/)**

**从地球环顾360°星空，或进入三维空间漫游，创作实时星空与星轨视频。**

**Explore a full 360° sky from Earth or travel through 3D space, and create real-time sky and star-trail videos.**

**当前版本 / Current version: v0.4.0**

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC_BY--NC_4.0-lightgrey.svg)](LICENSE)

![星野星轨取景界面 / StarSky Studio star-trail composition](docs/preview.jpeg)

*早期星轨界面示例，不代表 v0.3.0 的设置布局。 / Earlier star-trail interface; it does not show the v0.3.0 settings layout.*

## v0.4.0：浏览器直接导出 / Browser-native export

同一套界面支持静态网页和 Python 本机服务。网页版在浏览器中生成 **MP4**，默认 **H.264**；H.265 与所选分辨率能否编码，会按当前浏览器和设备检测。支持原生保存窗口时可选择位置，否则生成后点击下载，由浏览器的下载设置决定保存位置。没有 WebM 成片选项。

网页运行不需要安装 Python 或 FFmpeg。需要 MOV、浏览器不支持的编码组合，或本机转码回退时，仍可使用下方的本机启动方式。天空、银河和星图渲染保持一致；高清银河与星图按需载入。视频始终在用户设备上生成，不上传云端。网页和本机网址各自保存设置。

The same interface supports static web hosting and the local Python service. The web version creates **MP4** directly in the browser, with **H.264** as the default. H.265 and each selected resolution are checked against the browser and device. A supported native save picker lets you choose a location; otherwise, click the generated download link and use the browser's download settings. No WebM final output is offered.

The web version requires no Python or FFmpeg installation. Use the local launch instructions below for MOV, unsupported browser codec combinations or local transcoding fallback. Both modes retain the same sky renderer, with optional Milky Way and chart assets loaded on demand. Video stays on the user's device; preferences are stored separately for each web origin.

## 银河、星图与多语言 / Galaxy, charts and languages

- **画质与背景**：独立折叠菜单集中银河背景、银河亮度和输出分辨率。保留原版程序化银河，可选“观赏增强 · 16K 银河”。观察方式与大气闪烁在前；太阳系和空间移动独立放在最后、默认收起。
- **16K 银河**：复用天宫轨道模拟项目处理好的 NASA SVS 4851 星表可视化素材，前景继续使用星野的恒星、闪烁与星轨。16K 是原始全天空素材宽度，不是视频输出分辨率；独立背景模块按相机方向、当地坐标和岁差与星点对齐。
- **星图标注**：独立总开关，可选择主要／全部已收录星名，以及星座名称、连线、边界和密度。数据收录 965 个恒星名称与 88 个星座。原有“主星标记”单独保留，地面模式为牛郎、织女、天津四、北极星；开启两类标注时去重并避让。三维漫游只标记可匹配到 HYG 的实际恒星，地球参考星座名称、连线和边界停用。
- **镜头焦段**：默认“自由调整”，提供 14、24、48、121 mm 预设及 5–2000 mm 自定义焦距。按水平 36 mm 全画幅宽度换算水平视野；滚轮或水平视野滑块调整后回到自由模式，避免保留不匹配的焦段档位。
- **坐标网格**：关闭、地平坐标网格、赤道坐标网格可选。地平网格两极为天顶／天底；赤道网格两极为南北天极。北极星不与北天极严格重合。三维漫游不显示地面网格。
- **中文／English／Русский**：右上角切换界面、动态提示和画面标签语言，保存语言偏好；没有俄文专名的星名保留国际名称或编号。页头显示版本和作者 `GitHub: wenshuishi0528`。

**资源与性能**：高清背景使用独立 WebGL 模块，保留现有 Canvas2D 星点与编码流程，没有新增前端框架。GPU 纹理按需加载，切回原版释放；设备纹理上限不足时使用 8K／4K 素材并显示兼容状态。六面 16K／8K／4K JPEG 合计约 **68.4 MiB**，不包含原始 EXR 或开发缓存；解码及 GPU 内存占用高于压缩文件体积。预览背景按显示像素绘制，截图／视频背景按完整输出尺寸绘制；导出前等待素材就绪。星图仅启用时加载，线条预处理和文字测量采用缓存。来源与处理见 [银河素材说明](data/sky/README.md) 和 [第三方声明](THIRD_PARTY_NOTICES.md)。

**English:** A dedicated collapsible **Quality & Background** group contains background style, Milky Way brightness and output resolution. Choose the existing procedural sky or an optional NASA SVS 4851 16K-source Milky Way while retaining StarSky's foreground stars, scintillation and trails. An independent star-chart switch adds 965 named stars, 88 constellations, outlines, boundaries and label density; the original selected-star labels remain separate. Ground-view charts share the stellar projection and epoch. Space navigation labels only identifiable HYG stars and disables Earth-reference constellation overlays. Horizontal and equatorial grids distinguish the zenith/nadir from the celestial poles. Chinese, English and Russian controls and labels share saved language preferences, with international-name fallback where a translated proper name is unavailable.

Lens controls default to Free and offer 14, 24, 48 and 121 mm presets plus a 5–2000 mm custom focal length. Horizontal field of view uses a 36 mm full-frame width: `FOV = 2 × atan(36 / (2 × focal_mm))`. Scrolling or changing the horizontal-FOV slider returns the lens selector to Free.

The native WebGL background loads GPU textures on demand and releases them when returning to the original style. Hardware-compatible 8K/4K sets are included and identified when selected automatically. Prepared sky JPEGs total approximately 68.4 MiB; no source EXR, development cache or new frontend framework is bundled. Preview backgrounds use display-sized rendering; image and video output use the full selected dimensions and wait for required assets. The star chart loads only when enabled and caches geometry preparation and text measurements. Both Milky Way choices remain distant backgrounds, not volumetric galaxy models.

## 三维漫游与太阳系 / 3D and Solar System

观察方式提供原版地面星空和真正的三维平移漫游。新增太阳、八大行星、冥王星、月球，以及木星四大卫星Io、Europa、Ganymede和Callisto，共15个太阳系天体。太阳系内只有太阳是恒星。

- 选择目的地后，“对准”只转动视角；“前往附近”进入三维模式并移动到天体的向阳侧附近。目的地也包括比邻星、天狼星、织女星、牛郎星和参宿四。
- 用界面六向按钮移动，或聚焦画布后按W/S前后、A/D左右、R/F上下。步长可选约1.5万公里、0.01 AU、1 AU、0.1光年和1光年。原有方向键/Q/E仍用于旋转。
- “自动飞行”按所选步长每视频秒前进；重播、拖动进度条与逐帧导出使用同一路径。自由相机是可视化工具，不是相对论飞船模拟。
- “返回地面”恢复原观察位置。大气闪烁可关闭、轻微或明显；在三维模式自动停用。太空中也停用模拟流星和地面累积星轨。
- 默认使用真实角尺寸；“微小天体加可见标记”只提升可读性，不改变天体位置。到附近后显示简化的受光球面与相位，土星环按自转轴方向投影，并处理前后遮挡和土星投向环的阴影。
- 3D恒星使用61,433条HYG v4.1记录：地球视星等≤8.5，或在30 pc以内；仅保留0–10,000 pc范围内非哨兵距离。未知距离没有随机补齐。位置和线性空间速度来自星表；观测方向随相机位置改变，视星等按绝对星等和距离模数更新。

### 物理边界 / Model limits

This is a **geometric and photometric approximation**, not a complete physical simulator. Solar-system positions use bundled Astronomy Engine 2.1.19 in heliocentric J2000 equatorial AU coordinates; ground observers use the library's Earth orientation and surface position. The engine's advertised angular accuracy does not imply equivalent close-flyby accuracy in this renderer.

HYG distances include catalogue estimates and measurement uncertainty; individual parallax uncertainty is not included in this subset, so these positions must not be described as exact. Stellar velocities are linear catalogue propagation, without gravitational N-body evolution. The selected catalogue is incomplete: moving far away will not reveal every star that should become visible. Stellar surfaces/radii other than the Sun are not modeled.

The renderer uses true geometry for parallax and angular radii, but star sizes/glows are display point-spread symbols and brightness is compressed for a screen. Bodies use mean spherical radii, representative colors and simplified Lambert lighting; these are not photographic textures. Rotational surface features, oblateness, mutual eclipses and rings other than Saturn are not modeled. Ring opacity, bands and shadows are simplified. No light-time, aberration or relativistic camera correction is applied.

Atmospheric scintillation is a seeded, band-limited temporal brightness proxy with an airmass dependence. It stops in space and below the horizon, and uses video time rather than accelerated celestial time. It is not a weather-driven turbulence calculation. Daylight, atmospheric scattering, extinction and refraction remain unmodeled. The original full-sphere ground view intentionally shows the lower hemisphere. The procedural Milky Way remains an artistic distant background, not a volumetric galaxy; this is not a physically complete galaxy-traversal mode.

These 3D features were introduced in v0.2.0. That version passed local coordinate/rendering checks and a short three-dimensional H.265 export; those checks do not establish coverage of every v0.3.0 background, language or export combination.

## 中文

星野是一个在本机运行的星空取景与视频创作工具。观察者位于完整星空球的中心，可以连续转动视角、越过天顶和下半球，没有地景遮挡或图片边缘。支持设置日期、时间、经纬度和时间流速，用同一个构图生成实时星空或加速星轨。

### 功能

- 完整360°球面方向与透视投影；自由环顾、缩放和画面旋转。
- 41,411条恒星记录，主星标记，一键对准牛郎星、织女星和天津四。
- 时间流速与轨迹保留独立控制，可复现的模拟流星。
- 标准、1080P、4K输出；横屏、竖屏和4:3取景。
- 网页版 MP4、本机版 MP4 / MOV；默认 H.264，H.265 按运行环境支持提供。无 WebM 成片选项。
- 支持时通过原生保存窗口选择文件名与文件夹，网页版也提供下载方式。文件名包含本地导出时间，精确到分钟，如 `星野-202609302227-1920x1080-60秒-H265.mp4`。
- 优先逐帧生成30fps，再在本机编码；显示编码进度、帧数和耗时，支持取消。
- 三维恒星距离与平移漫游，太阳系天体及可选的大气闪烁。
- 全屏星空，底部播放控制条自动隐藏，可开关成片取景框。
- 自动保存设置；首次默认4K、8.5等恒星、4:3、丰富流星和H.264。

### 本机运行

本机版使用 **Python 本机服务 + FFmpeg + 桌面 Chrome／Edge**。运行环境需在本机安装；网页版无需这些本机工具。

1. 下载 [Release](https://github.com/Wenshuishi0528/StarSkyStudio/releases) 的 ZIP 并解压。
2. 准备 **Python 3.9+、FFmpeg（含libx264/libx265）**，以及桌面版 **Chrome / Edge**。Python无需额外依赖；FFmpeg需在PATH中，macOS也检查常见安装位置。
3. macOS双击 `启动星野.command`，或在项目目录执行：

   ```sh
   python3 server.py
   ```

4. 用Chrome或Edge打开终端显示的本机网址。服务默认监听 `127.0.0.1:8765`，端口被占用时会选择其他端口。保持终端开启，结束时按Ctrl+C。
5. 调整天空与取景，选择输出分辨率、格式、编码和时长，点击“选择保存位置…”后导出。不要在聊天软件内嵌网页中导出：部分内嵌窗口不提供原生文件选择接口。

本机版请通过服务打开；网页版请使用 HTTPS 网址。直接以 `file://` 打开 `index.html` 时，浏览器可能阻止高清银河和星图数据加载，视频导出也不可用。代码、星表与可选素材均在本地，渲染和视频编码无需云端上传。历史版本已在 macOS 检查；其他平台可使用 Python 启动，但尚未完成平台验证。界面支持中文、英文和俄文。

### 分辨率

| 比例 | 标准 | 1080P | 4K |
|---|---|---|---|
| 16:9 | 1280×720 | 1920×1080 | 3840×2160 |
| 9:16 | 720×1280 | 1080×1920 | 2160×3840 |
| 4:3 | 1200×900 | 1440×1080 | 3840×2880 |

星点和轨迹绘制到目标分辨率。原版银河保留程序化低采样风格；高清银河在截图和视频中按完整输出尺寸绘制，预览按显示像素绘制。4K的4:3模式为3840×2880，像素量高于常见UHD，部分设备会回退软件编码，耗时可能超过视频时长。

### 操作与时间

“镜头焦段”默认自由调整，可选 14／24／48／121 mm，或输入 5–2000 mm。水平视野以水平 36 mm 全画幅宽度计算：`FOV = 2 × atan(36 / (2 × 焦距mm))`。这是本工具的水平全画幅等效约定，画面比例决定相应垂直视野；切换比例不改变该焦距对应的水平视野。滚轮缩放或拖动水平视野滑块后自动回到“自由调整”。

拖动环顾，滚轮缩放，方向键微调，Q/E旋转，Shift加速微调。“画面回正”清除倾斜；“沉浸取景”让星空铺满整个屏幕；鼠标移到底部显示播放与进度条，离开约1.4秒后隐藏。可开关的视频取景框标示实际导出范围，全屏不会改变输出比例或分辨率。Escape退出，Tab可唤出键盘操作控件。日期、经纬度、UTC偏移或速度变更会重置片段；一般画面调整保留进度。设置会自动保存在当前浏览器的当前网址中，刷新或重开后恢复，包括取景方向、时间地点和输出选项。首次使用默认4K、8.5等恒星、4:3、丰富流星、H.264。播放进度与文件保存授权不保存；更换浏览器、端口或清除网站数据后会重新使用默认值。

默认60秒，可设5–120秒。实时模式为1×点状星空，星轨预设为120×并持续累积：60秒成片对应两小时天空变化。**UTC偏移需手动考虑当地夏令时**。Cougar预设为2026-07-18 22:54，UTC−7，坐标为附近近似值，并非核实后的精确拍摄点。

请保持导出页面可见；切换标签页会取消任务。网页版使用 WebCodecs 逐帧生成，不支持当前组合时提示调整设置或使用本机版。本机版优先逐帧生成，缺少相应能力时回退实时采集；本机 FFmpeg 转码优先尝试硬件，再回退软件。连续120秒无转码进展会结束该次尝试并进入备用方案；总转码时限30分钟。

## English

StarSky Studio is a browser-based sky-composition and video-creation tool with an optional local encoding service. Its camera sits at the center of a complete spherical sky, with continuous rotation through the zenith and lower hemisphere. It has no landscape masking or flat-image boundaries. Set the observation date, time, location and playback speed to compose real-time sky or accelerated star-trail clips.

### Features

- Full 360° viewing, perspective projection, zoom and camera roll.
- 41,411 star records, bright-star labels and Summer Triangle framing.
- Independent time speed and trail retention; reproducible simulated meteors.
- Standard, 1080P and 4K rendering in landscape, portrait and 4:3 formats (dimensions above).
- Web MP4 and local MP4 / MOV output, default H.264 with H.265 where supported. No WebM final output.
- Native save dialog where supported, browser download fallback, and minute-precision local timestamps in filenames.
- Frame-by-frame 30fps generation when supported, local encoding, progress reporting and cancellation.
- Distance-based stellar navigation, Solar System bodies and optional ground-view scintillation.
- Immersive fullscreen sky with auto-hiding playback controls and a toggleable export frame.
- Automatically saved settings; initial defaults are 4K, magnitude 8.5, 4:3, rich meteors and H.264.

### Local quick start

The local version uses **Python + FFmpeg + desktop Chrome/Edge**. Install these runtime tools locally; the web version does not require them.

Download and extract the [release ZIP](https://github.com/Wenshuishi0528/StarSkyStudio/releases). Install Python 3.9+, FFmpeg with libx264/libx265, and desktop Chrome or Edge. No Python packages are required. From the extracted directory run:

```sh
python3 server.py
```

On macOS you can also double-click `启动星野.command`. Open the URL printed by the server in desktop Chrome or Edge. Keep the terminal open; press Ctrl+C to stop. The server binds only to localhost, normally port 8765, and chooses another port if occupied. No cloud upload is involved. Use the local server for the local version, or an HTTPS address for the web version. Opening `index.html` with `file://` can block optional background/chart assets and does not enable video export. Earlier releases have been checked on macOS; other platforms are not yet verified. The UI supports Chinese, English and Russian.

Drag to look around, scroll to zoom, use arrow keys for fine adjustments and Q/E for roll. Shift increases keyboard step size. Select a resolution, container and codec, choose a destination, then export. Embedded chat browsers may not support the save picker; use a standalone browser window. Keep the export tab visible. Valid settings are saved in this browser for the same web origin and restored on reopening. Playback position and save-file permission are not retained; changing the browser or port, or clearing site data, resets preferences.

In 3D mode, use W/S, A/D and R/F or the six on-screen movement buttons. Atmospheric scintillation is disabled in space. “沉浸取景” fills the screen with sky; moving the pointer to the bottom reveals playback controls, which hide about 1.4 seconds after leaving. Toggle the export frame to see the actual video crop. Esc returns to the editor and Tab reveals keyboard controls; fullscreen does not change export resolution or framing.

The default clip is 60 seconds (5–120 seconds supported). At 1×, one video minute represents one simulated minute. The 120× star-trail preset represents two hours in one video minute. Enter the correct UTC offset manually, including daylight saving time. The Cougar preset uses approximate coordinates and is not a verified camera location.

Video generation can take longer than playback duration. Browser output uses a 30fps timeline and requires native support for the selected codec and dimensions. The local version also supports real-time capture fallback and hardware-to-software FFmpeg transcoding fallback. The 3840×2880 4:3 setting exceeds UHD pixel count and may be unsupported by some browser encoders or require software transcoding locally.

## 精度与数据 / Accuracy and data

This is a creative prototype, not a precision observation planner. Star directions include approximate precession and sidereal-time rotation. The lower hemisphere intentionally remains visible. The Milky Way is either the retained procedural artistic texture or the optional NASA catalogue-based sky map; both are distant backgrounds. Meteors are simulated. The original ground star layer does not model stellar proper motion; the new 3D layer uses catalogue space velocities. Daylight brightness, terrain, atmospheric refraction, weather and light pollution remain unmodeled. See the new model limits above for solar-system coverage. Supported dates: 1900–2100. Original HEIC photos are not included.

恒星来自 [d3-celestial stars.8.json](https://github.com/ofrohn/d3-celestial/blob/master/data/stars.8.json)，其原始数据为 **XHIP: An Extended Hipparcos Compilation**, Anderson & Francis (2012), VizieR V/137D。`data/stars.js`保留HIP、J2000赤经/赤纬、星等及B−V字段。有关原始项目的数据说明见 [d3-celestial](https://github.com/ofrohn/d3-celestial#files)。

## 开发与测试 / Development and tests

```sh
node astro.test.cjs
node app.test.cjs
node universe.test.cjs
node galaxy.test.cjs
node star-chart.test.cjs
node i18n.test.cjs
node web-export.test.cjs
node web-build.test.cjs
python3 server.test.py
```

The tests cover sky transforms, continuous pole crossings, camera orthogonality, trail reproducibility, all output dimensions, save-picker feedback, filename timestamps, local encoding, cancellation before encoding and authenticated progress access. Node.js is needed only for JavaScript tests. The Python encoder tests require FFmpeg and ffprobe.

Historical browser checks confirmed native save-dialog operation in Chrome, 3840×2160 H.265 export at 30fps (5 seconds / 150 frames), and the local encoder fallback for 3840×2880 H.265 (1 second / 30 frames). These historical short checks do not establish browser-native export coverage or imply that every duration and hardware combination has been tested. The new module tests exercise resource loading/failure handling, chart clipping and label behavior; full-device validation remains separate.

## 许可证 / License

自 **v0.4.0** 起，由作者新提供的原创代码、文档和展示图采用 **[CC BY-NC 4.0](LICENSE)**。非商业性使用须署名 **Wenshuishi / StarSky Studio**、保留项目及许可证链接并说明修改；商业用途须另行取得作者书面许可，可通过 [GitHub: Wenshuishi0528](https://github.com/Wenshuishi0528) 联系。

此前 v0.1.0、v0.2.0 和已公开的 v0.3.0 内容授予的 **CC BY 4.0** 权利继续有效，本次不追溯撤销。第三方 BSD、MIT、HYG 的 CC BY-SA 4.0 及 NASA 等素材规则保持独立。具体范围见 [授权说明](LICENSING.md) 和 [第三方声明](THIRD_PARTY_NOTICES.md)。

Starting with **v0.4.0**, newly provided original code, documentation and preview images are licensed under **[CC BY-NC 4.0](LICENSE)**. Attribute **Wenshuishi / StarSky Studio**, retain project/license links and identify changes. Commercial use requires separate written permission from [Wenshuishi0528](https://github.com/Wenshuishi0528).

Earlier **CC BY 4.0** grants for v0.1.0, v0.2.0 and the published v0.3.0 material remain valid. Third-party BSD, MIT, HYG CC BY-SA 4.0 and NASA/source-specific terms are unchanged. See [LICENSING.md](LICENSING.md) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
