
// ==== From your bounds (BD-09 Mercator-ish), converted to lon/lat ====
// SW: (12732795.715049, 4551407.60245475) -> ~ (114.380650, 37.801396)
// NE: (12773627.715049, 4573199.60245475) -> ~ (114.747450, 37.955913)
// Center: ~ (114.564050, 37.878695)

const map = new BMapGL.Map('map');
const sw = new BMapGL.Point(114.380650, 37.801396);
const ne = new BMapGL.Point(114.747450, 37.955913);
const center = new BMapGL.Point(114.564050, 37.878695);

map.centerAndZoom(center, 17);
map.enableScrollWheelZoom(true);

// Satellite (matches your Baidu share); comment for normal map
map.setMapType(BMAP_SATELLITE_MAP);
map.setTilt(45);

// Fit to your area
map.setViewport([sw, ne]);

// Marker at center
const marker = new BMapGL.Marker(center);
map.addOverlay(marker);

// Optional: add a label
const label = new BMapGL.Label('睿和中心', { position: center, offset: new BMapGL.Size(10, -20) });
label.setStyle({ color: '#fff', backgroundColor: 'rgba(0,0,0,.55)', border: 'none', padding: '4px 8px', borderRadius: '6px' });
map.addOverlay(label);
