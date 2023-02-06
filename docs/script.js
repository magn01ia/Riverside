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
  
    // ラインのデータソース設定
    map.addSource('Stream', {
      type: 'geojson',
      data: './data/Stream.geojson'
    });
  
    // ラインのデータソース設定
    map.addLayer({
      "id": "Stream",
      "type": "line",
      "source": "Stream",
      "layout": {},
      "paint": {
          'line-width': 2.5,
          'line-opacity':0.5, 
          'line-color': '#0000CD'
      }
    });
    // ラインデータクリック時のアクション
    map.on("click", "Stream", (e) => {
      const props = e.features[0].properties;
      const html = `<h2>${props.W05_004}</h2>`;
      new maplibregl.Popup().setLngLat(e.lngLat).setHTML(html).addTo(map);
    });
//------------------------------------------------------------------------
     // ポリゴンのデータソース設定
     map.addSource('WatershedBoundary', {
      type: 'geojson',
      data: './data/WatershedBoundary.geojson'
    });
  
    // ポリゴンのデータソース設定
    map.addLayer({
      "id": "WatershedBoundary",
      "type": "fill",
      "source": "WatershedBoundary",
      "layout": {},
      "paint": {
          //'full-width': 3,
          'fill-opacity':0, 
          'fill-color': '#40E0D0'
      }
    });
    //ポリゴンのアウトライン設定
    map.addLayer({
      'id': 'outline',
      'type': 'line',
      'source': 'WatershedBoundary',
      'layout': {},
      'paint': {
      'line-color': '#ff1493 ',
      'line-width': 0.5
      }
    });
//------------------------------------------------------------------
    //ベクトルタイル表示、オーバーズーミングしていない？
    map.addSource("mito", {
      type: "vector",
      tiles: [
        "https://magn01ia.github.io/fudevt/mito/{z}/{x}/{y}.pbf"
      ],
      minzoom: 10,
      maxzoom: 14, //ここでソースのズームレベルを指定してやらないとオーバーズーミングが効かない(空のズームレベルを表示してしまうため？)
    });

    map.addLayer({
      id: "fude",
      type: "fill",
      source: "mito",
      "source-layer": "mito",
      "minzoom": 9,
      "maxzoom": 22,
      paint: {
        "fill-color": "#FF00FF",
        "fill-opacity": 0.3,
        "fill-outline-color": "white"
      }
    });
  });

  map.addControl(new maplibregl.FullscreenControl());