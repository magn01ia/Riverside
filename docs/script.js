 var map = new maplibregl.Map({
    container: "map",
    style: {
      version: 8,
      sources: {
        rtile: {
          type: "raster",
          tiles: ["https://tile.openstreetmap.jp/{z}/{x}/{y}.png"],
          tileSize: 256,
          attribution:
            '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
        }
      },
      layers: [
        {
          id: "raster-tiles",
          type: "raster",
          source: "rtile",
          minzoom: 0,
          maxzoom: 22
        }
      ]
    },
    center: [139.9823,36.6761],
    zoom: 9
  });

  map.on('load', function () {
    // サークル設定
    map.addSource('Stream', {
        type: 'geojson',
        data: 'https://github.io/magn01ia/Riverside/data/Stream.geojson'
    });
    // スタイル設定
    map.addLayer({
        'id': 'Stream',
        'type': 'line',
        'source': 'Stream',
        //'layout': {},
        //'paint': {
          //  'line-color': '#FF0000'
    })
  });

map.addControl(new maplibregl.NavigationControl());