# Milky Way background

Source: NASA SVS **Deep Star Maps 2020**, corrected J2000 galactic-coordinate map,
https://svs.gsfc.nasa.gov/4851/ .

Credit: NASA/Goddard Space Flight Center Scientific Visualization Studio;
Ernie Wright. Gaia DR2: ESA/Gaia/DPAC.

These JPEGs were copied unchanged from Tiangong Orbit Simulator's prepared sky
assets. Its `scripts/prepare-sky.py` reprojects the native 16384 × 8192 linear EXR
into OpenGL cube faces (`px,nx,py,ny,pz,nz`, upload without vertical flipping),
applies exposure ×8 and Reinhard mapping, then encodes sRGB JPEG at quality 95
with 4:4:4 subsampling. The 16K set has six 4096 × 4096 faces; 8K and 4K sets
have 2048 and 1024 pixel faces for hardware fallback. No source EXR is bundled.

16K describes the original full-sky source width, not video output resolution.
The source is a catalogue-based background visualization; it is not a live
photograph or a three-dimensional model of the Milky Way. StarSky renders its
foreground catalogue stars separately.

Retain the above source credit and follow the NASA media usage guidelines:
https://www.nasa.gov/nasa-brand-center/images-and-media/ . NASA does not endorse
this application. The application's CC BY-NC 4.0 statement does not replace the
source's attribution and usage terms.
