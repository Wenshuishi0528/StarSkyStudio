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
