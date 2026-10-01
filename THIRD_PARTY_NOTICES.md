# Third-party notices

## d3-celestial / XHIP star catalogue

- Source: https://github.com/ofrohn/d3-celestial/blob/master/data/stars.8.json
- Upstream project: https://github.com/ofrohn/d3-celestial
- Upstream copyright: Copyright (c) 2015, Olaf Frohn.
- Original project license: BSD 3-Clause; complete notice retained in `data/D3-CELESTIAL-LICENSE.txt`.
- Underlying catalogue: XHIP: An Extended Hipparcos Compilation, Anderson E. & Francis C. (2012), VizieR V/137D.
- Transformation: `data/stars.js` contains selected HIP identifiers, J2000 RA/Dec, magnitudes and B−V values from the upstream GeoJSON. Preserve these credits when redistributing this file.

The project's CC BY 4.0 license does not replace third-party license terms.

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
- **CC BY-SA 4.0**, retained in `data/HYG-LICENSE.md`. The derived `data/stars3d.js` catalogue is also CC BY-SA 4.0. This dataset is an exception to the original-code CC BY 4.0 license.
- Conversion script: `scripts/build-spatial-catalog.py`. Select apparent magnitude ≤8.5 or distance ≤30 pc, with positive distance <10,000 pc; remove the unknown-distance sentinel. Preserve J2000 positions, linear velocities, absolute magnitudes, B−V, HIP IDs and available names. No fabricated distances.
- This is a catalogue subset, not a complete or error-free map of nearby space.
