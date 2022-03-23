require([
  'esri/config',
  'esri/Map',
  'esri/views/MapView',
  'esri/Basemap',
  'esri/layers/VectorTileLayer',
], function (esriConfig, Map, MapView, Basemap, VectorTileLayer) {
  esriConfig.apiKey = '___ARCGIS_ACCESS_TOKEN___'
  const tilesetName = 'itoma'
  const itomaBasemap = new Basemap({
    baseLayers: [
      new VectorTileLayer({
        title: tilesetName,
        url:
          '/arcgis/rest/services/' +
          tilesetName +
          '/VectorTileServer/resources/styles/root.json',
      }),
    ],
    title: tilesetName,
    id: tilesetName,
  })

  const map = new Map({
    basemap: itomaBasemap,
  })

  const view = new MapView({
    container: 'viewDiv',
    map: map,
    zoom: 8,
    center: [139.69167, 35.68944], // longitude, latitude
  })

  window._mainMapView = view
})
