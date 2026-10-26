# Third-party notices

## d3-celestial / XHIP star catalogue

- Source: https://github.com/ofrohn/d3-celestial/blob/master/data/stars.8.json
- Upstream project: https://github.com/ofrohn/d3-celestial
- Upstream copyright: Copyright (c) 2015, Olaf Frohn.
- Original project license: BSD 3-Clause; complete notice retained in `data/D3-CELESTIAL-LICENSE.txt`.
- Underlying catalogue: XHIP: An Extended Hipparcos Compilation, Anderson E. & Francis C. (2012), VizieR V/137D.
- Transformation: `data/stars.js` contains selected HIP identifiers, J2000 RA/Dec, magnitudes and B−V values from the upstream GeoJSON. Preserve these credits when redistributing this file.

The project's CC BY-NC 4.0 license does not replace third-party license terms or impose a NonCommercial restriction on the components below. Earlier CC BY 4.0 grants also remain valid; see [LICENSING.md](LICENSING.md).

## External runtime tools

Python, browsers and FFmpeg are separately installed tools and are not bundled in the release. Their respective licenses apply to those tools.


## Astronomy Engine 2.1.19

- https://github.com/cosinekitty/astronomy
- https://www.npmjs.com/package/astronomy-engine/v/2.1.19
- MIT, copyright Don Cross. Full license is embedded at the beginning of `vendor/astronomy.js`.
- Vendored npm browser build, without modifications. Used for geometric ephemerides, Earth-observer transforms and Jupiter's four major moons.

## HYG v4.1 spatial catalogue

- https://github.com/astronexus/HYG-Database/tree/main/hyg/CURRENT
- Source: `hygdata_v41.csv`, David Nash / Astronexus and credited underlying catalogues.
- **CC BY-SA 4.0**, retained in `data/HYG-LICENSE.md`. The derived `data/stars3d.js` catalogue is also CC BY-SA 4.0. This dataset is an exception to the original-code CC BY-NC 4.0 license.
- Conversion script: `scripts/build-spatial-catalog.py`. Select apparent magnitude ≤8.5 or distance ≤30 pc, with positive distance <10,000 pc; remove the unknown-distance sentinel. Preserve J2000 positions, linear velocities, absolute magnitudes, B−V, HIP IDs and available names. No fabricated distances.
- This is a catalogue subset, not a complete or error-free map of nearby space.


## NASA SVS Deep Star Maps 2020 — optional Milky Way background

- Source: [NASA SVS 4851, Deep Star Maps 2020](https://svs.gsfc.nasa.gov/4851/), corrected J2000 galactic-coordinate `milkyway_2020_16k_gal.exr`.
- Credit: **NASA/Goddard Space Flight Center Scientific Visualization Studio; Ernie Wright. Gaia DR2: ESA/Gaia/DPAC.**
- Prepared JPEG cube faces are copied from Wenshuishi's Tiangong Orbit Simulator. The native 16384×8192 source is reprojected to six 4096×4096 faces, with 2048/1024 face sets for hardware fallback; the source EXR is not distributed. The source map separates bright Hipparcos/Tycho stars from the unresolved Gaia background so StarSky can retain its independent foreground catalogue. It is a catalogue visualization, not a photograph.
- Retain source credits and follow the [NASA media usage guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/). NASA does not endorse this application. Original application code's CC BY-NC 4.0 license does not replace the source's attribution and usage terms.
- Reprojection, tone mapping, cube orientation and source details are documented in [data/sky/README.md](data/sky/README.md).

## Star-chart names, constellation figures and boundaries

- `data/star-chart.json` is copied from the Tiangong Orbit Simulator's prepared chart data; its `source` object retains upstream URLs, pinned revision, input SHA-256 hashes and processing notes.
- Star names, translated constellation names and constellation figures: [d3-celestial](https://github.com/ofrohn/d3-celestial), revision `7e720a3de062059d4c5400a379146a601d9010e0`; copyright (c) 2015 Olaf Frohn, **BSD 3-Clause**. Full notice is retained in [data/D3-CELESTIAL-LICENSE.txt](data/D3-CELESTIAL-LICENSE.txt).
- Constellation boundaries: **Davenhall & Leggett (1989), CDS/VizieR VI/49**, [`bound_20.dat`](https://cdsarc.cds.unistra.fr/ftp/VI/49/bound_20.dat.gz), published J2000 one-degree samples, including the July 2024 CEP/UMI correction. Retain this scientific-data attribution; the application license does not relicense the catalogue. Metadata and coordinate-frame explanation: [CDS VI/49 ReadMe](https://cdsarc.cds.unistra.fr/ftp/VI/49/ReadMe), [boundary notes](https://cdsarc.cds.unistra.fr/ftp/VI/49/constell.txt).
- Preparation joins names to HIP IDs, adds simplified Chinese/common-name aliases, identifies major stars, deduplicates boundary edges and retains both Serpens components. Astronomy Engine's B1875 transform was used in the source preparation only to classify/order the published boundary samples; rendering uses the retained J2000 positions.
- `star-chart.js` adapts the source project's collision-aware label layout to StarSky's Canvas2D projection. It does not bundle Three.js, BVH geometry or the source project's spacecraft-occlusion system.
