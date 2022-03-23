mapboxgl.accessToken = '___MAPBOX_ACCESS_TOKEN___'

if (mapboxgl.accessToken === 'ACCESS TOKEN NOT SET') {
  alert(
    'The Mapbox access token is not set. Use --mapbox-access-token to set it.',
  )
}

const map = new mapboxgl.Map({
  container: 'map',
  hash: true,
  style: `http://${window.location.host}/mapbox/style.json`,
})

map.addControl(new mapboxgl.NavigationControl(), 'top-right')

const showTileBoundaries = document.getElementById('showTileBoundaries')
const setShowTileBoundaries = function () {
  const checked = showTileBoundaries.checked
  map.showTileBoundaries = checked
}
setShowTileBoundaries()
showTileBoundaries.addEventListener('click', setShowTileBoundaries)

const showCollisionBoxes = document.getElementById('showCollisionBoxes')
const setShowCollisionBoxes = function () {
  const checked = showCollisionBoxes.checked
  map.showCollisionBoxes = checked
}
setShowCollisionBoxes()
showCollisionBoxes.addEventListener('click', setShowCollisionBoxes)

const showPadding = document.getElementById('showPadding')
const setShowPadding = function () {
  const checked = showPadding.checked
  map.showPadding = checked
}
setShowPadding()
showPadding.addEventListener('click', setShowPadding)
