(function(root){
'use strict';
const messages={
 "星野 · StarSky Studio": [
  "StarSky Studio",
  "StarSky Studio"
 ],
 "星野": [
  "StarSky",
  "StarSky"
 ],
 "版本": [
  "Version",
  "Версия"
 ],
 "界面语言": [
  "Interface language",
  "Язык интерфейса"
 ],
 "↗ Cougar · 夏夜预设": [
  "↗ Cougar · Summer night",
  "↗ Cougar · Летняя ночь"
 ],
 "全屏星空，拖动环顾，滚轮缩放": [
  "Fullscreen sky; drag to look around, scroll to zoom",
  "Небо на весь экран: перетаскивайте для обзора, колесо для масштаба"
 ],
 "视频取景范围": [
  "Video frame",
  "Кадр видео"
 ],
 "把这一刻，留给星空。": [
  "Keep this moment among the stars.",
  "Сохраните этот миг среди звёзд."
 ],
 "● 实时 · 1×": [
  "● Real time · 1×",
  "● Реальное время · 1×"
 ],
 "三维星空取景画面，拖动环顾，滚轮缩放": [
  "Sky view; drag to look around, scroll to zoom",
  "Обзор неба: перетаскивайте для обзора, колесо для масштаба"
 ],
 "加载星表…": [
  "Loading star catalogue…",
  "Загрузка звёздного каталога…"
 ],
 "任意方向拖动 · 滚轮缩放 · 方向键微调 · Q/E旋转": [
  "Drag to look · Scroll to zoom · Arrow keys to adjust · Q/E to roll",
  "Перетаскивание — обзор · Колесо — масштаб · Стрелки — настройка · Q/E — поворот"
 ],
 "播放与取景控制": [
  "Playback and framing controls",
  "Воспроизведение и кадрирование"
 ],
 "▶ 播放": [
  "▶ Play",
  "▶ Воспроизвести"
 ],
 "Ⅱ 暂停": [
  "Ⅱ Pause",
  "Ⅱ Пауза"
 ],
 "回到片段开始": [
  "Return to the start",
  "К началу фрагмента"
 ],
 "↺ 重播": [
  "↺ Restart",
  "↺ Сначала"
 ],
 "片段进度": [
  "Clip progress",
  "Позиция во фрагменте"
 ],
 "保存图片": [
  "Save image",
  "Сохранить изображение"
 ],
 "隐藏取景框": [
  "Hide frame",
  "Скрыть рамку"
 ],
 "显示取景框": [
  "Show frame",
  "Показать рамку"
 ],
 "沉浸取景": [
  "Immersive view",
  "Полноэкранный обзор"
 ],
 "退出沉浸 · Esc": [
  "Exit fullscreen · Esc",
  "Выйти из полноэкранного режима · Esc"
 ],
 "天空时间": [
  "Sky time",
  "Время неба"
 ],
 "正在准备星空…": [
  "Preparing the sky…",
  "Подготовка неба…"
 ],
 "✦ 完整球形星空 · 无地平线遮挡": [
  "✦ Full celestial sphere · No horizon mask",
  "✦ Полная небесная сфера · Без маски горизонта"
 ],
 "银河背景可选 · 流星为模拟效果": [
  "Selectable Milky Way · Simulated meteors",
  "Выбор фона Млечного Пути · Метеоры смоделированы"
 ],
 "观察方式": [
  "Observation",
  "Наблюдение"
 ],
 "观察模式": [
  "Viewing mode",
  "Режим наблюдения"
 ],
 "地面环顾 · 原版星空": [
  "Ground view · Original sky",
  "С Земли · Исходное небо"
 ],
 "三维漫游 · 真实距离": [
  "3D travel · Catalogue distances",
  "3D-полёт · Расстояния по каталогу"
 ],
 "大气闪烁": [
  "Atmospheric scintillation",
  "Атмосферное мерцание"
 ],
 "关闭": [
  "Off",
  "Выключено"
 ],
 "开启": [
  "On",
  "Включено"
 ],
 "轻微": [
  "Subtle",
  "Слабое"
 ],
 "明显": [
  "Strong",
  "Сильное"
 ],
 "地面模式支持大气闪烁；太空中自动关闭。恒星距离与亮度按星表计算。": [
  "Scintillation is available on the ground and disabled in space. Stellar distances and brightness use catalogue data.",
  "Мерцание доступно при наблюдении с Земли и отключено в космосе. Расстояния и яркость звёзд рассчитываются по каталогу."
 ],
 "时间与地点": [
  "Time and location",
  "Время и место"
 ],
 "地点名称": [
  "Location name",
  "Название места"
 ],
 "纬度（北为正）": [
  "Latitude (north positive)",
  "Широта (север — плюс)"
 ],
 "经度（东为正）": [
  "Longitude (east positive)",
  "Долгота (восток — плюс)"
 ],
 "当地起始日期与时间": [
  "Local start date and time",
  "Местные дата и время начала"
 ],
 "该时刻 UTC 偏移（手动，含夏令时）": [
  "UTC offset at this time (manual, includes DST)",
  "Смещение UTC (вручную, с учётом летнего времени)"
 ],
 "预设坐标是附近的近似值。更换地点、季节时，请同时核对 UTC 偏移。": [
  "Preset coordinates are approximate. Check the UTC offset when changing location or season.",
  "Координаты пресета приблизительные. При смене места или сезона проверьте смещение UTC."
 ],
 "时间如何流动": [
  "Time flow",
  "Ход времени"
 ],
 "实时模式": [
  "Real time",
  "Реальное время"
 ],
 "星轨模式": [
  "Star trails",
  "Звёздные треки"
 ],
 "时间流速": [
  "Time speed",
  "Скорость времени"
 ],
 "1× · 实时": [
  "1× · Real time",
  "1× · Реальное время"
 ],
 "60× · 分钟变秒": [
  "60× · 1 minute / second",
  "60× · 1 минута / секунду"
 ],
 "120× · 2小时 / 分钟": [
  "120× · 2 hours / minute",
  "120× · 2 часа / минуту"
 ],
 "240× · 4小时 / 分钟": [
  "240× · 4 hours / minute",
  "240× · 4 часа / минуту"
 ],
 "600× · 10小时 / 分钟": [
  "600× · 10 hours / minute",
  "600× · 10 часов / минуту"
 ],
 "轨迹保留": [
  "Trail retention",
  "Сохранение треков"
 ],
 "关闭 · 点状星空": [
  "Off · Point stars",
  "Выключено · Точечные звёзды"
 ],
 "持续累积": [
  "Accumulate",
  "Накопление"
 ],
 "逐渐淡去": [
  "Fade gradually",
  "Постепенное затухание"
 ],
 "时间流速与星轨独立控制。实时模式下，一分钟内星点移动很小。": [
  "Time speed and trails are independent. Stars move very little during one minute in real time.",
  "Скорость времени и треки настраиваются отдельно. За минуту реального времени звёзды смещаются очень мало."
 ],
 "取景与画面": [
  "Framing and view",
  "Кадр и обзор"
 ],
 "方位角": [
  "Azimuth",
  "Азимут"
 ],
 "仰角": [
  "Altitude",
  "Высота"
 ],
 "画面旋转（°）": [
  "View roll (°)",
  "Поворот кадра (°)"
 ],
 "↶ 画面回正": [
  "↶ Level view",
  "↶ Выровнять кадр"
 ],
 "视点位于星空球中心，上下左右均可连续转动。仰角是当前朝向读数，不是拖动限位。": [
  "Look freely around the celestial sphere. Altitude reports the viewing direction and does not limit dragging.",
  "Обзор небесной сферы свободный. Высота показывает направление взгляда и не ограничивает перетаскивание."
 ],
 "水平视野": [
  "Horizontal field of view",
  "Горизонтальное поле зрения"
 ],
 "⌖ 对准牛郎 · 织女 · 天津四": [
  "⌖ Frame Altair · Vega · Deneb",
  "⌖ Навести на Альтаир · Вегу · Денеб"
 ],
 "取景比例": [
  "Aspect ratio",
  "Соотношение сторон"
 ],
 "16:9 横屏": [
  "16:9 Landscape",
  "16:9 Альбомное"
 ],
 "9:16 竖屏": [
  "9:16 Portrait",
  "9:16 Портретное"
 ],
 "4:3 照片": [
  "4:3 Photo",
  "4:3 Фото"
 ],
 "恒星显示深度": [
  "Limiting magnitude",
  "Предельная звёздная величина"
 ],
 "肉眼 · 6等": [
  "Naked eye · mag 6",
  "Невооружённый глаз · 6 зв. вел."
 ],
 "丰富 · 7等": [
  "Rich · mag 7",
  "Больше звёзд · 7 зв. вел."
 ],
 "摄影 · 8.5等": [
  "Photographic · mag 8.5",
  "Фотография · 8,5 зв. вел."
 ],
 "主星标记 · 原版": [
  "Selected star labels · Original",
  "Избранные звёзды · Исходные метки"
 ],
 "坐标网格": [
  "Coordinate grid",
  "Координатная сетка"
 ],
 "地平坐标 · 天顶与天底": [
  "Horizontal · Zenith and nadir",
  "Горизонтальная · Зенит и надир"
 ],
 "赤道坐标 · 南北天极": [
  "Equatorial · Celestial poles",
  "Экваториальная · Полюса мира"
 ],
 "画质与背景": [
  "Quality and background",
  "Качество и фон"
 ],
 "银河背景": [
  "Milky Way background",
  "Фон Млечного Пути"
 ],
 "原版 · 程序化银河": [
  "Original · Procedural Milky Way",
  "Исходный · Процедурный Млечный Путь"
 ],
 "观赏增强 · 16K 银河": [
  "Enhanced · 16K Milky Way",
  "Улучшенный · Млечный Путь 16K"
 ],
 "银河亮度": [
  "Milky Way brightness",
  "Яркость Млечного Пути"
 ],
 "输出分辨率": [
  "Output resolution",
  "Разрешение вывода"
 ],
 "标准 · 流畅预览": [
  "Standard · Smooth preview",
  "Стандартное · Плавный просмотр"
 ],
 "1080P · 全高清": [
  "1080P · Full HD",
  "1080P · Full HD"
 ],
 "4K · 高画质输出": [
  "4K · High-quality output",
  "4K · Высокое качество"
 ],
 "设置自动保存在此浏览器，下次打开恢复。": [
  "Settings are saved in this browser and restored next time.",
  "Настройки сохраняются в этом браузере и восстанавливаются при следующем открытии."
 ],
 "设置已自动保存，下次打开恢复。": [
  "Settings saved; they will be restored next time.",
  "Настройки сохранены и будут восстановлены при следующем открытии."
 ],
 "浏览器未允许保存设置；当前设置仍可使用。": [
  "Browser storage is unavailable; current settings still work.",
  "Браузер не разрешил сохранение; текущие настройки доступны."
 ],
 "标准横屏1280×720 · 30fps目标帧率": [
  "Standard landscape 1280×720 · Target 30 fps",
  "Стандартное 1280×720 · Цель: 30 кадров/с"
 ],
 "16K 指全天空背景素材精度，视频分辨率由输出选项决定。": [
  "16K is the full-sky source resolution. Video resolution is set separately above.",
  "16K — разрешение исходного фона всего неба. Разрешение видео задаётся отдельно выше."
 ],
 "星图标注": [
  "Star chart",
  "Звёздная карта"
 ],
 "启用星图标注": [
  "Enable star chart",
  "Включить звёздную карту"
 ],
 "恒星名称": [
  "Star names",
  "Названия звёзд"
 ],
 "星座名称": [
  "Constellation names",
  "Названия созвездий"
 ],
 "标注范围": [
  "Label scope",
  "Набор подписей"
 ],
 "主要恒星": [
  "Major stars",
  "Основные звёзды"
 ],
 "全部已收录星名": [
  "All catalogued names",
  "Все имена в каталоге"
 ],
 "星座连线": [
  "Constellation lines",
  "Линии созвездий"
 ],
 "星座边界": [
  "Constellation boundaries",
  "Границы созвездий"
 ],
 "标注密度": [
  "Label density",
  "Плотность подписей"
 ],
 "主星标记独立控制。三维漫游仅标注实际恒星，不显示地球视角的固定星座。": [
  "Selected star labels are independent. In 3D travel, labels follow stars; fixed Earth-view constellations are hidden.",
  "Метки избранных звёзд независимы. В 3D-полёте подписи следуют за звёздами; фиксированные созвездия с точки зрения Земли скрыты."
 ],
 "流星与成片": [
  "Meteors and video",
  "Метеоры и видео"
 ],
 "模拟流星": [
  "Simulated meteors",
  "Моделирование метеоров"
 ],
 "偶尔 · 2颗 / 分钟": [
  "Occasional · 2 / minute",
  "Редко · 2 / минуту"
 ],
 "丰富 · 5颗 / 分钟": [
  "Frequent · 5 / minute",
  "Часто · 5 / минуту"
 ],
 "随机种子": [
  "Random seed",
  "Случайное зерно"
 ],
 "视频格式": [
  "Video container",
  "Контейнер видео"
 ],
 "视频编码": [
  "Video codec",
  "Видеокодек"
 ],
 "H.264 · 默认": [
  "H.264 · Default",
  "H.264 · По умолчанию"
 ],
 "成片时长（秒）": [
  "Clip duration (seconds)",
  "Длительность (секунды)"
 ],
 "导出辅助标记": [
  "Export overlays",
  "Метки при экспорте"
 ],
 "隐藏 · 干净画面": [
  "Hide · Clean image",
  "Скрыть · Чистое изображение"
 ],
 "保留": [
  "Keep",
  "Сохранить"
 ],
 "同一种子可复现流星。优先逐帧导出30fps；生成耗时取决于画质与设备。请保持此页可见。分辨率见取景框。": [
  "The same seed reproduces meteors. Frame-by-frame export uses 30 fps; time depends on quality and hardware. Keep this page visible. Resolution appears in the frame.",
  "Одинаковое зерно повторяет метеоры. Покадровый экспорт — 30 кадров/с; время зависит от качества и устройства. Оставьте страницу видимой. Разрешение указано в кадре."
 ],
 "太阳系与空间移动": [
  "Solar System and travel",
  "Солнечная система и полёт"
 ],
 "太阳系大小": [
  "Solar System body size",
  "Размер тел Солнечной системы"
 ],
 "真实角尺寸": [
  "Physical angular size",
  "Реальный угловой размер"
 ],
 "微小天体加可见标记": [
  "Add markers to tiny bodies",
  "Метки для малых объектов"
 ],
 "显示太阳、行星与已收录卫星": [
  "Show the Sun, planets and included moons",
  "Показать Солнце, планеты и включённые спутники"
 ],
 "目的地": [
  "Destination",
  "Цель"
 ],
 "太阳": [
  "Sun",
  "Солнце"
 ],
 "水星": [
  "Mercury",
  "Меркурий"
 ],
 "金星": [
  "Venus",
  "Венера"
 ],
 "地球": [
  "Earth",
  "Земля"
 ],
 "月球": [
  "Moon",
  "Луна"
 ],
 "火星": [
  "Mars",
  "Марс"
 ],
 "木星": [
  "Jupiter",
  "Юпитер"
 ],
 "木卫一 · Io": [
  "Io",
  "Ио"
 ],
 "木卫二 · Europa": [
  "Europa",
  "Европа"
 ],
 "木卫三 · Ganymede": [
  "Ganymede",
  "Ганимед"
 ],
 "木卫四 · Callisto": [
  "Callisto",
  "Каллисто"
 ],
 "土星": [
  "Saturn",
  "Сатурн"
 ],
 "天王星": [
  "Uranus",
  "Уран"
 ],
 "海王星": [
  "Neptune",
  "Нептун"
 ],
 "冥王星": [
  "Pluto",
  "Плутон"
 ],
 "参宿四 · Betelgeuse": [
  "Betelgeuse",
  "Бетельгейзе"
 ],
 "天狼星 · Sirius": [
  "Sirius",
  "Сириус"
 ],
 "比邻星 · Proxima Centauri": [
  "Proxima Centauri",
  "Проксима Центавра"
 ],
 "织女星 · Vega": [
  "Vega",
  "Вега"
 ],
 "牛郎星 · Altair": [
  "Altair",
  "Альтаир"
 ],
 "对准目的地": [
  "Aim at destination",
  "Навести на цель"
 ],
 "前往附近 · 漫游": [
  "Travel nearby",
  "Перейти к цели"
 ],
 "移动步长 / 自动飞行每秒距离": [
  "Step size / Auto-flight distance per second",
  "Шаг / Расстояние автополёта за секунду"
 ],
 "0.0001 AU · 约1.5万公里": [
  "0.0001 AU · About 15,000 km",
  "0,0001 а.е. · Около 15 000 км"
 ],
 "0.1光年": [
  "0.1 light-year",
  "0,1 светового года"
 ],
 "1光年": [
  "1 light-year",
  "1 световой год"
 ],
 "向前 W": [
  "Forward W",
  "Вперёд W"
 ],
 "向后 S": [
  "Backward S",
  "Назад S"
 ],
 "向左 A": [
  "Left A",
  "Влево A"
 ],
 "向右 D": [
  "Right D",
  "Вправо D"
 ],
 "上移 R": [
  "Up R",
  "Вверх R"
 ],
 "下移 F": [
  "Down F",
  "Вниз F"
 ],
 "播放 / 导出时沿当前视线自动飞行": [
  "Fly along the current view during playback / export",
  "Автополёт вдоль линии взгляда при воспроизведении / экспорте"
 ],
 "返回地面观察点": [
  "Return to ground observer",
  "Вернуться к наблюдателю на Земле"
 ],
 "漫游相机可加速移动，不代表飞船真实运动。位置为几何位置，未校正光行时。球面着色为简化反照模型；不是观测级照片。": [
  "Camera travel may be accelerated; it is not a spacecraft dynamics model. Positions are geometric without light-time correction. Body shading is simplified, not observational imagery.",
  "Движение камеры может быть ускоренным и не моделирует динамику корабля. Положения геометрические, без поправки на время света. Затенение тел упрощённое, это не снимки наблюдений."
 ],
 "选择保存位置…": [
  "Choose save location…",
  "Выбрать место сохранения…"
 ],
 "未选择；导出时选择文件名和文件夹": [
  "Not selected; choose a filename and folder on export",
  "Не выбрано; задайте имя файла и папку при экспорте"
 ],
 "↓ 导出视频": [
  "↓ Export video",
  "↓ Экспорт видео"
 ],
 "取消录制": [
  "Cancel recording",
  "Отменить запись"
 ],
 "取消导出": [
  "Cancel export",
  "Отменить экспорт"
 ],
 "下载视频": [
  "Download video",
  "Скачать видео"
 ],
 "精度与数据来源": [
  "Accuracy and data sources",
  "Точность и источники данных"
 ],
 "d3-celestial / XHIP 数据来源 ↗": [
  "d3-celestial / XHIP data source ↗",
  "Источник данных d3-celestial / XHIP ↗"
 ],
 "本地运行，H.265/H.264在本机编码，文件不上传云端。请用“启动星野.command”启用完整导出。当前版本没有把原照片作为天空贴图。": [
  "Runs locally with H.265/H.264 encoding on your computer; files are not uploaded. Use “启动星野.command” for full export. Original photographs are not used as sky textures.",
  "Работает локально, кодирование H.265/H.264 выполняется на компьютере; файлы не загружаются в облако. Для полного экспорта используйте «启动星野.command». Исходные фотографии не используются как текстуры неба."
 ],
 "恒星采用 XHIP 星表的 d3-celestial GeoJSON 数据（J2000），含近似岁差修正。三维漫游采用HYG距离与空间速度；太阳系采用Astronomy Engine。收录太阳、八大行星、冥王星、月球与木星四大卫星，不包含完整卫星目录。未校正大气折射、光行时与相对论效应。原版银河为程序化示意，增强银河采用 NASA 星表可视化背景。全景模式不遮挡下半球，也不模拟白昼亮度；时间和地点决定星空朝向，不代表地面实拍可见性。": [
  "Ground-view stars use d3-celestial XHIP data (J2000) with approximate precession. 3D travel uses HYG distances and space velocities; Solar System positions use Astronomy Engine. Includes the Sun, eight planets, Pluto, the Moon and four Galilean moons, not a complete moon catalogue. Atmospheric refraction, light-time and relativity are omitted. The original Milky Way is procedural; the enhanced background uses NASA catalogue visualization. The lower hemisphere is unmasked and daylight brightness is not simulated; time and location set orientation, not actual ground visibility.",
  "Звёзды при наблюдении с Земли основаны на XHIP/d3-celestial (J2000) с приближённой прецессией. В 3D используются расстояния и скорости HYG; Солнечная система — Astronomy Engine. Включены Солнце, восемь планет, Плутон, Луна и четыре галилеевых спутника, а не полный каталог спутников. Рефракция, время распространения света и релятивистские эффекты не учтены. Исходный Млечный Путь процедурный; улучшенный фон — визуализация каталога NASA. Нижняя полусфера не скрывается, дневная яркость не моделируется. Время и место задают ориентацию, а не реальную видимость с Земли."
 ]
};
Object.assign(messages,{
 "请检查 {field}": [
  "Please check {field}",
  "Проверьте: {field}"
 ],
 "{width} × {height} · 30fps逐帧 · {quality}": [
  "{width} × {height} · Frame-by-frame 30 fps · {quality}",
  "{width} × {height} · Покадрово, 30 кадров/с · {quality}"
 ],
 "可先用标准模式取景，再切4K导出": [
  "Frame in Standard mode, then switch to 4K for export",
  "Настройте кадр в стандартном режиме, затем выберите 4K для экспорта"
 ],
 "全高清画质": [
  "Full HD quality",
  "Качество Full HD"
 ],
 "标准画质": [
  "Standard quality",
  "Стандартное качество"
 ],
 "已更新片段起点。": [
  "Clip start updated.",
  "Начало фрагмента обновлено."
 ],
 "已保留当前进度，画面参数已更新。": [
  "View settings updated; playback position preserved.",
  "Параметры изображения обновлены; позиция воспроизведения сохранена."
 ],
 "正在加载高清银河…": [
  "Loading high-resolution Milky Way…",
  "Загрузка Млечного Пути высокого разрешения…"
 ],
 "16K 全天空素材 · 输出尺寸由分辨率决定": [
  "16K full-sky source · Output size follows the resolution setting",
  "Исходный фон всего неба 16K · Размер вывода задаётся настройкой разрешения"
 ],
 "设备兼容模式：{size}K 银河素材": [
  "Device compatibility mode: {size}K Milky Way source",
  "Режим совместимости: фон Млечного Пути {size}K"
 ],
 "高清银河暂不可用，已回退原版。重新选择可重试。": [
  "High-resolution Milky Way unavailable; using the original. Select it again to retry.",
  "Фон высокого разрешения недоступен; используется исходный. Выберите снова для повторной попытки."
 ],
 "正在加载星图…": [
  "Loading star chart…",
  "Загрузка звёздной карты…"
 ],
 "星图载入失败，重新开启可重试。": [
  "Star chart failed to load; toggle it off and on to retry.",
  "Не удалось загрузить карту; выключите и включите её для повторной попытки."
 ],
 "漫游仅显示可定位恒星名称；地球星座连线与边界已停用。": [
  "Travel mode labels located stars only; Earth-view constellation lines and boundaries are disabled.",
  "В полёте подписаны только звёзды с известным положением; линии и границы созвездий с точки зрения Земли отключены."
 ],
 "正在准备高清银河…": [
  "Preparing high-resolution Milky Way…",
  "Подготовка Млечного Пути высокого разрешения…"
 ],
 "正在准备星图…": [
  "Preparing star chart…",
  "Подготовка звёздной карты…"
 ],
 "高清银河未就绪，请重试或选择原版背景后导出。": [
  "High-resolution Milky Way is not ready. Retry or select the original background before exporting.",
  "Фон высокого разрешения не готов. Повторите попытку или выберите исходный фон перед экспортом."
 ],
 "星图未就绪，请重试或关闭星图后导出。": [
  "Star chart is not ready. Retry or disable the chart before exporting.",
  "Звёздная карта не готова. Повторите попытку или отключите карту перед экспортом."
 ],
 "{duration}秒成片 · 天空经过 {minutes} 分钟": [
  "{duration}s video · {minutes} minutes of sky time",
  "Видео {duration} с · На небе проходит {minutes} мин"
 ],
 "三维漫游 · 距太阳 {distance} · 大气闪烁 / 流星 / 地面星轨已停用{flight}": [
  "3D travel · {distance} from the Sun · Scintillation / meteors / ground trails disabled{flight}",
  "3D-полёт · От Солнца: {distance} · Мерцание / метеоры / земные треки отключены{flight}"
 ],
 "地面全景 · 大气闪烁{twinkle} · 下半球为透视展示，不是地面实际可见区域": [
  "Ground panorama · Scintillation: {twinkle} · Lower hemisphere is shown through the ground, not actually visible",
  "Обзор с Земли · Мерцание: {twinkle} · Нижняя полусфера показана сквозь Землю, а не как реально видимая"
 ],
 " · 自动飞行": [
  " · Auto-flight",
  " · Автополёт"
 ],
 "三维漫游": [
  "3D travel",
  "3D-полёт"
 ],
 "点状星空": [
  "Point stars",
  "Точечные звёзды"
 ],
 "星轨": [
  "Star trails",
  "Звёздные треки"
 ],
 "惯性朝向": [
  "Inertial direction",
  "Инерциальное направление"
 ],
 "方位": [
  "Azimuth",
  "Азимут"
 ],
 "{direction} {az}° · 仰角 {alt}° · 旋转 {roll}° · 视野 {fov}°": [
  "{direction} {az}° · Altitude {alt}° · Roll {roll}° · FOV {fov}°",
  "{direction} {az}° · Высота {alt}° · Поворот {roll}° · Поле зрения {fov}°"
 ],
 "{phase} {elapsed} / {duration} · 请保持此页可见": [
  "{phase} {elapsed} / {duration} · Keep this page visible",
  "{phase} {elapsed} / {duration} · Оставьте страницу видимой"
 ],
 "逐帧生成": [
  "Rendering frames",
  "Рендеринг кадров"
 ],
 "录制中": [
  "Recording",
  "Запись"
 ],
 "已对准夏季大三角，可向任意方向继续转动。": [
  "Framed the Summer Triangle; you can keep turning in any direction.",
  "Кадр направлен на Летний треугольник; можно продолжать поворот в любом направлении."
 ],
 "格式已改变，请重新选择保存位置": [
  "Format changed; choose the save location again",
  "Формат изменён; выберите место сохранения заново"
 ],
 "光年": [
  "ly",
  "св. лет"
 ],
 "已对准 {name} · 距离 {distance}": [
  "Aimed at {name} · Distance {distance}",
  "Цель: {name} · Расстояние {distance}"
 ],
 "请先切换到三维漫游模式。": [
  "Switch to 3D travel first.",
  "Сначала переключитесь в режим 3D-полёта."
 ],
 "已将画面回正，朝向与播放进度保持不变。": [
  "View leveled; direction and playback position preserved.",
  "Кадр выровнен; направление и позиция воспроизведения сохранены."
 ],
 "无法进入全屏：{error}": [
  "Cannot enter fullscreen: {error}",
  "Не удалось включить полноэкранный режим: {error}"
 ],
 "请选择桌面Chrome或Edge，以便指定保存文件夹": [
  "Use desktop Chrome or Edge to choose a save folder",
  "Используйте настольный Chrome или Edge для выбора папки"
 ],
 "{format} 视频": [
  "{format} video",
  "Видео {format}"
 ],
 "文件名需以 .{ext} 结尾": [
  "Filename must end in .{ext}",
  "Имя файла должно заканчиваться на .{ext}"
 ],
 "已选择：{name}（保存到所选文件夹）": [
  "Selected: {name} (in the chosen folder)",
  "Выбрано: {name} (в выбранной папке)"
 ],
 "已取消选择，原保存位置未更改。": [
  "Selection cancelled; previous save location retained.",
  "Выбор отменён; прежнее место сохранения не изменено."
 ],
 "此窗口不允许选择文件，请在独立的桌面 Chrome 或 Edge 中打开本地网址。": [
  "This window cannot choose files. Open the local address in standalone desktop Chrome or Edge.",
  "В этом окне нельзя выбрать файл. Откройте локальный адрес в отдельном настольном Chrome или Edge."
 ],
 "请通过“启动星野.command”打开本地导出服务": [
  "Open the local export service using “启动星野.command”",
  "Запустите локальный сервис экспорта через «启动星野.command»"
 ],
 "正在本机编码 {codec} / {format}…": [
  "Encoding locally: {codec} / {format}…",
  "Локальное кодирование: {codec} / {format}…"
 ],
 "正在传送到本机编码器 · 已耗时 {seconds}秒": [
  "Sending to local encoder · {seconds}s elapsed",
  "Передача локальному кодировщику · Прошло {seconds} с"
 ],
 "正在封装并保存文件 · 已耗时 {seconds}秒": [
  "Packaging and saving · {seconds}s elapsed",
  "Упаковка и сохранение · Прошло {seconds} с"
 ],
 "本机编码 {codec} / {format} · {percent}% · {frame}/{total}帧 · 已耗时 {seconds}秒{software}": [
  "Local encoding {codec} / {format} · {percent}% · {frame}/{total} frames · {seconds}s elapsed{software}",
  "Локальное кодирование {codec} / {format} · {percent}% · {frame}/{total} кадров · Прошло {seconds} с{software}"
 ],
 " · 软件编码": [
  " · Software encoding",
  " · Программное кодирование"
 ],
 "本地编码失败": [
  "Local encoding failed",
  "Ошибка локального кодирования"
 ],
 "导出已取消": [
  "Export cancelled",
  "Экспорт отменён"
 ],
 "编码完成，正在写入所选文件…": [
  "Encoding complete; writing the selected file…",
  "Кодирование завершено; запись выбранного файла…"
 ],
 "下载已生成的 {format} 副本": [
  "Download the generated {format} copy",
  "Скачать созданную копию {format}"
 ],
 "已保存：{name}": [
  "Saved: {name}",
  "Сохранено: {name}"
 ],
 "已保存 {format} · {codec} · {width}×{height} · {duration}秒。": [
  "Saved {format} · {codec} · {width}×{height} · {duration}s.",
  "Сохранено: {format} · {codec} · {width}×{height} · {duration} с."
 ],
 "编码帧数不完整": [
  "Encoded frame count is incomplete",
  "Закодированы не все кадры"
 ],
 "编码器返回了不支持的重排序帧": [
  "Encoder returned unsupported reordered frames",
  "Кодировщик вернул кадры с неподдерживаемой перестановкой"
 ],
 "生成已取消，未保存视频。": [
  "Rendering cancelled; no video saved.",
  "Рендеринг отменён; видео не сохранено."
 ],
 "导出已取消，未写入目标文件。": [
  "Export cancelled; destination file was not written.",
  "Экспорт отменён; целевой файл не записан."
 ],
 "导出失败：{error}": [
  "Export failed: {error}",
  "Ошибка экспорта: {error}"
 ],
 "完整导出需要本地服务：请双击文件夹中的“启动星野.command”。": [
  "Full export requires the local service: double-click “启动星野.command” in the project folder.",
  "Для полного экспорта нужен локальный сервис: откройте «启动星野.command» в папке проекта."
 ],
 "此浏览器不支持视频录制，请在桌面 Chrome 中打开。": [
  "This browser does not support video recording. Open in desktop Chrome.",
  "Браузер не поддерживает запись видео. Откройте в настольном Chrome."
 ],
 "未找到浏览器支持的视频编码。": [
  "No supported browser video codec found.",
  "Не найден видеокодек, поддерживаемый браузером."
 ],
 "录制失败，请重试或换用 Chrome。": [
  "Recording failed. Retry or use Chrome.",
  "Ошибка записи. Повторите попытку или используйте Chrome."
 ],
 "无法开始录制：{error}": [
  "Cannot start recording: {error}",
  "Не удалось начать запись: {error}"
 ],
 "360°完整球形星空 · {count}颗恒星。上下左右均可连续转动。": [
  "Full 360° celestial sphere · {count} stars. Look freely in any direction.",
  "Полная небесная сфера 360° · {count} звёзд. Свободный обзор во всех направлениях."
 ],
 "初始化失败：{error}": [
  "Initialization failed: {error}",
  "Ошибка инициализации: {error}"
 ],
 "织女星": [
  "Vega",
  "Вега"
 ],
 "牛郎星": [
  "Altair",
  "Альтаир"
 ],
 "天津四": [
  "Deneb",
  "Денеб"
 ],
 "北极星": [
  "Polaris",
  "Полярная звезда"
 ],
 "天狼星": [
  "Sirius",
  "Сириус"
 ],
 "参宿四": [
  "Betelgeuse",
  "Бетельгейзе"
 ],
 "比邻星": [
  "Proxima Centauri",
  "Проксима Центавра"
 ],
 "木卫一": [
  "Io",
  "Ио"
 ],
 "木卫二": [
  "Europa",
  "Европа"
 ],
 "木卫三": [
  "Ganymede",
  "Ганимед"
 ],
 "木卫四": [
  "Callisto",
  "Каллисто"
 ]
});
Object.assign(messages,{
 "本机未找到FFmpeg": [
  "FFmpeg was not found on this computer",
  "FFmpeg не найден на этом компьютере"
 ],
 "不支持的导出格式": [
  "Unsupported export format",
  "Неподдерживаемый формат экспорта"
 ],
 "编码连续120秒无进展或超过总时限": [
  "Encoding made no progress for 120 seconds or exceeded the time limit",
  "Кодирование не продвигалось 120 секунд или превысило лимит времени"
 ],
 "任务尚未开始或已经完成": [
  "The job has not started or has already finished",
  "Задача ещё не началась или уже завершена"
 ],
 "无效的导出请求或视频过大": [
  "Invalid export request or video too large",
  "Недопустимый запрос экспорта или слишком большое видео"
 ],
 "已有本地编码正在进行，请稍后再试": [
  "Another local encoding job is running. Try again later.",
  "Уже выполняется локальное кодирование. Повторите позже."
 ],
 "输入视频传输中断": [
  "Input video transfer was interrupted",
  "Передача входного видео прервана"
 ],
 "编码失败：{error}": [
  "Encoding failed: {error}",
  "Ошибка кодирования: {error}"
 ]
});
Object.assign(messages,{
 "镜头焦段": [
  "Lens focal length",
  "Фокусное расстояние объектива"
 ],
 "自由调整": [
  "Free adjustment",
  "Свободная настройка"
 ],
 "自定义": [
  "Custom",
  "Своё значение"
 ],
 "自定义焦距（mm）": [
  "Custom focal length (mm)",
  "Своё фокусное расстояние (мм)"
 ],
 "按全画幅等效焦距换算水平视角，滚轮仍可微调。": [
  "Horizontal field of view uses full-frame-equivalent focal length. Scroll to fine-tune.",
  "Горизонтальное поле зрения рассчитано по эквивалентному фокусному расстоянию полного кадра. Колесо мыши позволяет точную настройку."
 ]
});
Object.assign(messages,{
 "网页版 · 视频在此设备生成，不上传云端。": [
  "Web version · Video is generated on this device, without cloud upload.",
  "Веб-версия · Видео создаётся на этом устройстве без загрузки в облако."
 ],
 "本机版 · 使用本地编码服务。": [
  "Local version · Uses the local encoding service.",
  "Локальная версия · Используется локальная служба кодирования."
 ],
 "正在检查浏览器编码能力…": [
  "Checking browser encoding support…",
  "Проверка возможностей кодирования браузера…"
 ],
 "此设备不支持当前编码与分辨率，请改用 H.264、较低分辨率或本机版。": [
  "This device does not support the selected codec and resolution. Try H.264, a lower resolution or the local version.",
  "Это устройство не поддерживает выбранные кодек и разрешение. Попробуйте H.264, меньшее разрешение или локальную версию."
 ],
 "网页版支持 MP4；MOV 请使用本机版。": [
  "The web version exports MP4. Use the local version for MOV.",
  "Веб-версия экспортирует MP4. Для MOV используйте локальную версию."
 ],
 "此浏览器由下载设置决定保存位置。": [
  "This browser uses its download settings to choose the save location.",
  "Место сохранения определяется настройками загрузок браузера."
 ],
 "视频已生成，请点击下载保存。": [
  "Video is ready. Click Download to save it.",
  "Видео готово. Нажмите «Скачать», чтобы сохранить его."
 ],
 "下载 MP4 视频": [
  "Download MP4 video",
  "Скачать видео MP4"
 ],
 "正在浏览器中封装 MP4…": [
  "Packaging MP4 in the browser…",
  "Сборка MP4 в браузере…"
 ],
 "此浏览器不支持直接导出 MP4，请使用新版 Chrome / Edge 或本机版。": [
  "This browser cannot export MP4 directly. Use a recent Chrome / Edge or the local version.",
  "Этот браузер не поддерживает прямой экспорт MP4. Используйте новую версию Chrome / Edge или локальную версию."
 ],
 "网页与本机版均在此设备生成视频，不上传云端。网页版输出 MP4，编码支持取决于浏览器与设备；本机版通过“启动星野.command”使用 FFmpeg。原照片未作为天空贴图。": [
  "Both web and local versions generate video on this device without cloud upload. The web version exports MP4; codec support depends on the browser and device. The local version uses FFmpeg through the command launcher. Original photos are not used as sky textures.",
  "Веб-версия и локальная версия создают видео на этом устройстве без загрузки в облако. Веб-версия экспортирует MP4; поддержка кодеков зависит от браузера и устройства. Локальная версия использует FFmpeg через файл запуска. Исходные фотографии не используются как текстуры неба."
 ]
});
messages['编码器在生成途中改变了视频配置，请降低分辨率后重试。']=[
 'The encoder changed the video configuration during generation. Try a lower resolution.',
 'Кодировщик изменил параметры видео во время создания. Попробуйте меньшее разрешение.'
];
Object.assign(messages,{
 '编码器未返回有效参数或画面':[
  'The encoder did not return valid parameters or video frames.',
  'Кодировщик не вернул допустимые параметры или видеокадры.'
 ],
 '无效的视频尺寸或帧率':[
  'Invalid video dimensions or frame rate.',
  'Недопустимые размеры видео или частота кадров.'
 ],
 '浏览器编码等待超时，请降低分辨率后重试。':[
  'Browser encoding timed out. Try a lower resolution.',
  'Время ожидания кодирования в браузере истекло. Попробуйте меньшее разрешение.'
 ]
});
const languages=['zh','en','ru'],storageKey='starsky.language.v1';
let language='zh',initialized=false;
try{const saved=root.localStorage?.getItem(storageKey);if(languages.includes(saved))language=saved;}catch{}
const listeners=new Set(),texts=[],attributes=[];
function t(key,params={}){
 if(language!=='zh'&&typeof key==='string'&&key.startsWith('编码失败：')&&!Object.hasOwn(messages,key))return t('编码失败：{error}',{error:t(key.slice(5))});
 const translation=language==='zh'?key:(messages[key]?.[language==='en'?0:1]??key);
 return String(translation).replace(/\{(\w+)\}/g,(_,name)=>String(params[name]??''));
}
function render(){
 const doc=root.document;if(!doc)return;
 doc.documentElement.lang=language==='zh'?'zh-CN':language;doc.title=t('星野 · StarSky Studio');
 for(const entry of texts)if(entry.node.isConnected)entry.node.nodeValue=entry.before+t(entry.key)+entry.after;
 for(const {el,name,key} of attributes)if(el.isConnected)el.setAttribute(name,t(key));
 for(const [id,lang] of [['languageZh','zh'],['languageEn','en'],['languageRu','ru']])doc.getElementById(id)?.setAttribute('aria-pressed',String(language===lang));
 const version=doc.getElementById('appVersion');if(version)version.textContent='v'+api.version;
}
function setLanguage(value){
 if(!languages.includes(value)||value===language)return;
 language=value;try{root.localStorage?.setItem(storageKey,language);}catch{}
 render();for(const fn of listeners)fn(language);
}
function init(){
 if(initialized)return;const doc=root.document;if(!doc)return;initialized=true;
 const walker=doc.createTreeWalker(doc.body,4);
 while(walker.nextNode()){
  const node=walker.currentNode;if(node.parentElement.closest('script,style,[data-no-i18n]'))continue;
  const key=node.nodeValue.trim();if(!Object.hasOwn(messages,key))continue;
  const start=node.nodeValue.indexOf(key);texts.push({node,key,before:node.nodeValue.slice(0,start),after:node.nodeValue.slice(start+key.length)});
 }
 for(const el of doc.querySelectorAll('[aria-label],[title]'))for(const name of ['aria-label','title']){
  const key=el.getAttribute(name);if(key&&Object.hasOwn(messages,key))attributes.push({el,name,key});
 }
 for(const [id,lang] of [['languageZh','zh'],['languageEn','en'],['languageRu','ru']]){
  const button=doc.getElementById(id);if(button)button.onclick=()=>setLanguage(lang);
 }
 render();
}
const api={version:'0.4.0',get language(){return language;},t,setLanguage,init,onChange(fn){listeners.add(fn);return ()=>listeners.delete(fn);},messages};
root.StarSkyI18n=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
