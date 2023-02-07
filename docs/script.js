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
  
    // 河川ラインのデータソース
    map.addSource('Stream', {
      type: 'geojson',
      data: './data/Stream.geojson'
    });
    // 河川ラインの表示設定
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
    // ラインデータのラベル表示設定
    map.addLayer({
      'id': 'Label',
      'type': 'symbol',
      'source': 'Stream',
      'layout': {
      //'icon-image': 'custom-marker',
      // get the year from the source's "year" property
      'text-field': ['get', 'W05_004'],
      // 'text-font': [
      // 'Open Sans Semibold',
      // 'Arial Unicode MS Bold'
      // ],
      'text-offset': [0, 1.25],
      'text-anchor': 'top'
      }
      });

    // 河川ラインデータクリック時のアクション
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

  //PMTilesプラグインの追加
  let protocol = new pmtiles.Protocol();
  maplibregl.addProtocol("pmtiles", protocol.tile);
  const p = new pmtiles.PMTiles("https://x.optgeo.org/a.pmtiles")
  protocol.add(p);

  map.on('load', () => {
    // 法務省地図XMLベクトルタイル追加
    map.addSource("pmtiles", {
        type: "vector",
        url: "pmtiles://https://x.optgeo.org/a.pmtiles",
        attribution: '© <a href="https://github.com/amx-project">法務省地図XMLアダプトプロジェクト</a>'
    });

    //代表点の中身
    map.addLayer({
        "id": "daihyo",
        "source": "pmtiles",
        "source-layer": "daihyo",
        "type": "circle",
        'paint': {
            'circle-color': '#00bfff ',
            'circle-blur': 0.1,
            'circle-radius': 3
        }
    });

    //代表点の中身 
    map.addLayer({
        "id": "daihyo2",
        "source": "pmtiles",
        "source-layer": "daihyo",
        "type": "circle",
        'paint': {
            'circle-color': '#f0f8ff ',
            //'circle-radius': 1
            'circle-radius': 1.5
        }
    });

    //筆ポリゴンのライン
    map.addLayer({
        "id": "fude-line",
        "source": "pmtiles",
        "source-layer": "fude",
        "type": "line",
        "paint": {
            'line-color': '#00bfff',
            'line-width': 1,
        }
    });

    //筆ポリゴン
    map.addLayer({
        "id": "fude-poligon",
        "source": "pmtiles",
        "source-layer": "fude",
        "type": "fill",
        "paint": {
            'fill-color': '#e0ffff ',
            'fill-opacity': 0.25,
        }
    });
  })