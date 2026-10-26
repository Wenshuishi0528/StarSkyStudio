# v0.4.0 · 星野 StarSky Studio — 网页版 / Web version

## 中文

- **授权更新**：v0.4.0 新提供的原创内容采用 CC BY-NC 4.0，商业用途需另行取得作者书面许可。此前 v0.1.0／v0.2.0／v0.3.0 的 CC BY 4.0 授权继续有效；第三方许可不变，详见 [授权说明](LICENSING.md)。

- **网页运行**：增加静态网页构建与 GitHub Pages 自动部署，与本机版共用天空渲染和设置界面。
- **浏览器导出**：直接生成 MP4，默认 H.264；按浏览器和设备能力检测 H.265 及目标分辨率。原生保存窗口不可用时，提供点击下载。
- **保留本机导出**：Python／FFmpeg 路径继续支持 H.264、H.265、MP4 和 MOV。网页不提供 WebM 成片。
- **资源与设置**：银河、星图保持按需加载；脚本与样式使用内容版本标记，静态站点仅发布运行所需资源和许可证。网页与本机地址分别保存偏好。
- 导出页面需保持可见。编码支持、4K性能与保存窗口取决于浏览器和设备；不支持的组合会明确提示，不改用其他成片格式。

## English

- **Licensing:** newly provided original material in v0.4.0 uses CC BY-NC 4.0; commercial use requires separate written permission. Earlier CC BY 4.0 grants for v0.1.0/v0.2.0/v0.3.0 and third-party licenses remain valid. See [licensing scope](LICENSING.md).

- **Web hosting:** static-site builds and GitHub Pages deployment share the existing sky renderer and settings interface with the local app.
- **Browser export:** create MP4 directly, defaulting to H.264. H.265 and the requested resolution are checked against browser/device support. A download link is available when the native save picker is unavailable.
- **Local export retained:** Python/FFmpeg continues to support H.264, H.265, MP4 and MOV. The web version does not produce WebM final output.
- **Resources and settings:** optional galaxy/chart assets remain lazy-loaded; script/style content versions refresh changed code. The site includes runtime files and license notices, with preferences stored separately by origin.
- Keep the export page visible. Codec support, 4K performance and native file pickers depend on the browser/device. Unsupported combinations report an error instead of changing the final format.

---

# v0.3.0 · 星野 StarSky Studio — 本地更新 / Local update

本地版本说明；尚不代表已创建 v0.3.0 GitHub Release。 / Local version notes; a matching GitHub Release is not implied.

## 中文

- **设置收纳**：各组可展开／收起；观察方式与大气闪烁在前，太阳系与空间移动独立放在最后。新增“画质与背景”，集中银河选项、亮度及输出分辨率。
- **高清银河**：增加 NASA SVS 4851 的原生 16K 源银河背景，保留原版程序化背景与星野前景恒星。素材按需加载、切回释放，支持设备兼容的 8K／4K 回退；预览按显示像素，截图及视频按完整输出尺寸绘制。
- **独立星图**：恒星名称、88 星座名称、连线、边界及密度控制，保留原精选主星标签并去重避让。三维漫游只显示可定位恒星名称，停用固定地球星座图层。
- **镜头焦段**：默认自由调整，增加 14／24／48／121 mm 及 5–2000 mm 自定义档位，按水平 36 mm 全画幅宽度换算视野；滚轮或视野滑块调整后回到自由模式。
- **方向网格**：区分地平网格的天顶／天底与赤道网格的南北天极。
- **三语与署名**：中文、English、Русский 切换及偏好保存；页头显示作者 GitHub 与统一版本号。
- 保留 H.264/H.265、MP4/MOV、逐帧视频生成、自动保存及沉浸取景。新增背景与星图在导出前等待加载，失败时明确提示。

**运行与资源**：继续使用 Python 本机服务、FFmpeg 与桌面 Chrome／Edge；通过 `python3 server.py` 或 macOS 的“启动星野.command”运行。无需新增前端框架。16K／8K／4K 天空 JPEG 共约 68.4 MiB，不包含原始 EXR。GPU 内存与解码成本高于压缩文件体积。16K 是素材宽度，不是视频分辨率。来源见 [第三方声明](THIRD_PARTY_NOTICES.md) 与 [银河素材说明](data/sky/README.md)。

**验证范围**：背景加载／回退、坐标转换、星图裁剪／避让、语言、应用与本机编码检查通过。在 macOS Edge 实测 16K 背景及星图标注的 3840×2880、30fps、5 秒 H.264/MP4 导出，成片为 150 帧；不同设备与完整片长组合尚未逐一实测。

## English

- **Collapsible settings:** separate observation and scintillation from Solar System navigation, which is placed last and initially collapsed. A new Quality & Background group contains Milky Way style, brightness and output resolution.
- **High-resolution Milky Way:** optional NASA SVS 4851 native-16K-source background alongside the original procedural style and StarSky foreground stars. GPU textures load on demand, are released when switching back and use explicit 8K/4K hardware fallback. Preview rendering follows display pixels; snapshots/videos use full output dimensions.
- **Independent star chart:** names, 88 constellations, outlines, boundaries and density controls, with collision handling and de-duplication against the existing selected-star labels. Space navigation labels identifiable stars and disables fixed Earth-reference constellation overlays.
- **Lens presets:** Free by default, with 14/24/48/121 mm presets and 5–2000 mm custom focal length. Horizontal field of view is derived from a 36 mm full-frame width; wheel/FOV-slider adjustments restore Free mode.
- **Coordinate grids:** horizontal zenith/nadir and equatorial celestial-pole grids are separately selectable.
- **Languages and identity:** Chinese, English and Russian with saved language preferences; GitHub author link and a consistent header version.
- Existing H.264/H.265, MP4/MOV, frame-by-frame export, saved preferences and immersive composition are retained. Selected background/chart assets must finish loading before export, with explicit failure feedback.

**Runtime and assets:** retain the local Python server, FFmpeg and desktop Chrome/Edge. No additional frontend framework or raw EXR is bundled. Prepared 16K/8K/4K sky JPEGs total about 68.4 MiB; decoded/GPU memory costs are higher. 16K describes source-map width, not video resolution. See [third-party notices](THIRD_PARTY_NOTICES.md) and [sky asset details](data/sky/README.md).

**Validation scope:** module and regression checks passed for background lifecycle/fallback, transforms, chart clipping/layout, localization, application behavior and local encoding. A 5-second 3840×2880 H.264/MP4 export with the 16K background and chart labels was tested in macOS Edge: 30fps, 150 frames. Other devices and full-duration combinations have not all been tested.

---

# v0.2.0 · 星野 StarSky Studio

## 中文

从地面星空进入三维空间，加入太阳系、全屏沉浸取景和自动保存设置。

- **三维漫游**：61,433条HYG恒星记录，按星表距离与空间速度显示位置。可六向平移、前往目的地附近或自动飞行；移动视点后，恒星方向与亮度随距离变化。
- **太阳系**：太阳、八大行星、冥王星、月球和木星四大卫星，共15个天体。默认真实角尺寸，配有简化受光球面、相位和土星环。
- **大气闪烁**：关闭、轻微、明显可选；地面模式按高度角变化，太空模式自动关闭。
- **沉浸取景**：星空铺满全屏。鼠标移到底部唤出播放和进度条，离开后自动隐藏；取景框可开关，Esc返回编辑界面，输出构图保持一致。
- **自动保存**：记住有效的时间地点、画面、取景方向、漫游位置及输出选项。首次默认4K、8.5等恒星、4:3、丰富流星和H.264；仍可选择H.265。
- 保留实时/星轨模式、标准/1080P/4K、MP4/MOV、本机保存位置选择和30fps逐帧导出。

**安装**：下载并解压 `StarSkyStudio-v0.2.0.zip`。需要Python 3.9+、含libx264/libx265的FFmpeg，以及桌面Chrome/Edge。macOS双击“启动星野.command”，或在解压目录执行 `python3 server.py`。运行环境不随包提供。

**验证**：天文坐标、三维位置与相位、界面/全屏构图、自动保存恢复和本机编码测试均通过；此前已验证短片H.265导出。不同设备和完整片长组合未逐一验证。

**模型范围**：这是几何、测光和显示近似。星表存在测量误差，银河为远景艺术纹理，闪烁为可复现的亮度模拟；不包含天气驱动的大气模型、光行时、相对论或完整卫星库。设置保存在同一浏览器、同一本机网址；不保存播放进度或文件保存授权。

原创代码、文档与展示图继续采用CC BY 4.0，署名Wenshuishi / StarSky Studio；HYG派生星表采用CC BY-SA 4.0，Astronomy Engine采用MIT，其余第三方声明随包保留。

## English

Travel from an Earth-based sky view into 3D space, with the Solar System, immersive fullscreen and automatically saved preferences.

- **3D navigation**: 61,433 HYG catalogue stars with catalogue distances and linear space velocities. Translate in six directions, visit nearby destinations or follow an automatic flight path. Apparent direction and brightness change with the observer's position.
- **Solar System**: the Sun, eight planets, Pluto, the Moon and four Galilean moons—15 bodies. Physical angular sizes are the default, with simplified illuminated spheres, phases and Saturn's rings.
- **Atmospheric scintillation**: off, mild or strong; altitude-dependent in ground view and disabled in space.
- **Immersive composition**: sky fills the screen. Playback controls appear at the bottom and hide after the pointer leaves. Toggle the export frame, or press Esc to return to the editor; video framing is preserved.
- **Saved preferences**: valid time/location, display, camera, navigation and export settings are restored. Initial defaults are 4K, magnitude 8.5, 4:3, rich meteors and H.264; H.265 remains available.
- Existing real-time/trail modes, Standard/1080P/4K, MP4/MOV, native save selection and frame-by-frame 30fps export remain available.

**Install**: extract `StarSkyStudio-v0.2.0.zip`. Install Python 3.9+, FFmpeg with libx264/libx265 and desktop Chrome/Edge. Run `python3 server.py`, or double-click the macOS command launcher. Runtime dependencies are not bundled.

**Validation**: coordinate, 3D geometry/phase, UI/fullscreen framing, preference restoration and local encoding tests passed. Short H.265 exports were also tested previously; not every device and full-duration combination has been tested.

**Model scope**: geometry, photometry and rendering are approximations. Catalogue measurements have uncertainty; the Milky Way is an artistic distant background and scintillation is a reproducible brightness proxy. Weather-driven atmosphere, light-time, relativity and a complete satellite catalogue are not modeled. Preferences are local to the same browser/address; playback position and save-file permission are not retained.

Original code, documentation and the preview image retain CC BY 4.0, attributed to Wenshuishi / StarSky Studio. The derived HYG catalogue is CC BY-SA 4.0; Astronomy Engine is MIT. All third-party notices are included.

---

# v0.1.0 · 星野 StarSky Studio

## 中文

首个公开版本：完整360°星空取景、实时与星轨模式、可复现模拟流星。

- 标准 / 1080P / 4K输出，支持16:9、9:16和4:3。
- MP4 / MOV，默认H.265，可选H.264，无WebM成片选项。
- 原生保存位置选择，文件名含精确到分钟的本地时间。
- 编码进度、耗时、硬件/软件回退与取消。
- 中英文介绍，CC BY 4.0；第三方星表保留原许可及署名。

下载ZIP并解压；需要Python 3.9+、FFmpeg及桌面Chrome/Edge。macOS双击“启动星野.command”，或执行 `python3 server.py`。这不是自带运行环境的独立安装包。

银河和流星是艺术模拟，未包含地景、月亮、行星或真实天空亮度复原。4K软件编码可能较慢，请保持导出页面可见。已实测短片导出，未验证所有设备与片长组合。

## English

First public release: full 360° sky composition, real-time and star-trail modes, and reproducible simulated meteors.

- Standard / 1080P / 4K rendering in 16:9, 9:16 and 4:3.
- MP4 / MOV, default H.265 and optional H.264; no WebM final output.
- Native destination picker and minute-precision local timestamps in filenames.
- Encoding progress, elapsed time, hardware/software fallback and cancellation.
- Bilingual documentation and CC BY 4.0 licensing, with original third-party catalogue notices retained.

Extract the ZIP and install Python 3.9+, FFmpeg and desktop Chrome/Edge. Run `python3 server.py`, or double-click the macOS command launcher. Runtime dependencies are not bundled.

The Milky Way and meteors are artistic simulations. Terrain, the Moon, planets and realistic sky brightness are not modeled. Software 4K encoding can be slow; keep the export tab visible. Short export checks passed, but not every hardware/duration combination has been tested.
