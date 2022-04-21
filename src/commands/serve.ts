import path from 'path'
import fs from 'fs'
import express from 'express'
import proxy from 'express-http-proxy'
import fetch from 'node-fetch'
import { parser } from '@unvt/charites/dist/lib/yaml-parser'

import type { VectorSourceSpecification } from '@maplibre/maplibre-gl-style-spec/types'
import { Server } from 'http'

const cors = require('cors') // 21 April 2022

export interface ServeOptions {
  mapboxAccessToken?: string
  arcgisAccessToken?: string
  port?: string
  trustProxy?: boolean
  strict?: boolean
}

async function getTileUrls(url: string, serverPort: number) {
  const resp = await fetch(url, {
    headers: {
      origin: `http://localhost:${serverPort}`,
      referer: `http://localhost:${serverPort}`,
    },
  })
  const json = await resp.json()
  return (json as VectorSourceSpecification).tiles
}

export async function serve(source: string, options: ServeOptions) {
  let port = parseInt(process.env.PORT || '8080', 10)
  if (options.port) {
    port = Number(options.port)
  }
  let sourcePath = path.resolve(process.cwd(), source)

  // The `source` is absolute path.
  if (source.match(/^\//)) {
    sourcePath = source
  }

  if (!fs.existsSync(sourcePath)) {
    throw `${sourcePath}: No such file or directory`
  }

  const style = parser(sourcePath)

  if (Object.keys(style.sources).length > 1) {
    throw `itoma does not currently support styles with more than one source.`
  }
  const mainSource = style.sources[Object.keys(style.sources)[0]]
  if (mainSource.type !== 'vector') {
    throw `itoma currently only supports a single vector tile source.`
  }
  const tileUrls =
    mainSource.tiles ||
    (mainSource.url ? await getTileUrls(mainSource.url, port) : undefined)
  if (!tileUrls || tileUrls.length === 0) {
    throw `Vector tile URL was not able to be determined. Check sources section.`
  }
  const tileUrl = new URL(tileUrls[0])

  const spriteUrl = style.sprite ? new URL(style.sprite) : undefined
  const glyphsUrl = style.glyphs ? new URL(style.glyphs) : undefined

  const app = express()
  app.use(cors()) // 21 April 2022
  if (options.trustProxy) {
    app.set('trust proxy', true)
  }
  const rootDir = path.dirname(path.dirname(__dirname))
  const providerDir = path.join(rootDir, 'provider')

  const arcgisRouter = express.Router({ mergeParams: true })
  arcgisRouter.get('/:name/VectorTileServer', (req, res) => {
    const copyrightText = mainSource.attribution || ''
    res.setHeader('content-type', 'application/json; charset=UTF-8')
    res.end(
      JSON.stringify({
        currentVersion: 10.9,
        name: req.params.name,
        capabilities: 'TilesOnly,Tilemap',
        copyrightText,
        type: 'indexedVector',
        tileMap: 'tilemap',
        defaultStyles: 'resources/styles',
        tiles: [`tile/{z}/{y}/{x}.pbf`],
        exportTilesAllowed: false,
        initialExtent: {
          xmin: -2.0037507842788246e7,
          ymin: -2.0037508342787e7,
          xmax: 2.0037507842788246e7,
          ymax: 2.0037508342787e7,
          spatialReference: {
            wkid: 102100,
            latestWkid: 3857,
          },
        },
        fullExtent: {
          xmin: -2.0037507842788246e7,
          ymin: -2.0037508342787e7,
          xmax: 2.0037507842788246e7,
          ymax: 2.0037508342787e7,
          spatialReference: {
            wkid: 102100,
            latestWkid: 3857,
          },
        },
        minScale: 2.958287637957775e8,
        maxScale: 4513.9887055,
        tileInfo: {
          rows: 512,
          cols: 512,
          dpi: 96,
          format: 'pbf',
          origin: {
            x: -2.0037508342787e7,
            y: 2.0037508342787e7,
          },
          spatialReference: {
            wkid: 102100,
            latestWkid: 3857,
          },
          lods: [
            {
              level: 0,
              resolution: 78271.516964,
              scale: 2.958287637957775e8,
            },
            {
              level: 1,
              resolution: 39135.75848199995,
              scale: 1.479143818978885e8,
            },
            {
              level: 2,
              resolution: 19567.87924100005,
              scale: 7.39571909489445e7,
            },
            {
              level: 3,
              resolution: 9783.93962049995,
              scale: 3.6978595474472e7,
            },
            {
              level: 4,
              resolution: 4891.96981024998,
              scale: 1.8489297737236e7,
            },
            {
              level: 5,
              resolution: 2445.98490512499,
              scale: 9244648.868618,
            },
            {
              level: 6,
              resolution: 1222.992452562495,
              scale: 4622324.434309,
            },
            {
              level: 7,
              resolution: 611.496226281245,
              scale: 2311162.2171545,
            },
            {
              level: 8,
              resolution: 305.74811314069,
              scale: 1155581.1085775,
            },
            {
              level: 9,
              resolution: 152.874056570279,
              scale: 577790.5542885,
            },
            {
              level: 10,
              resolution: 76.4370282852055,
              scale: 288895.2771445,
            },
            {
              level: 11,
              resolution: 38.2185141425366,
              scale: 144447.638572,
            },
            {
              level: 12,
              resolution: 19.1092570712683,
              scale: 72223.819286,
            },
            {
              level: 13,
              resolution: 9.55462853563415,
              scale: 36111.909643,
            },
            {
              level: 14,
              resolution: 4.777314267817075,
              scale: 18055.9548215,
            },
            {
              level: 15,
              resolution: 2.388657133974685,
              scale: 9027.977411,
            },
            {
              level: 16,
              resolution: 1.19432856698734,
              scale: 4513.9887055,
            },
          ],
        },
        maxzoom: 16,
        resourceInfo: {
          styleVersion: 8,
          tileCompression: 'gzip',
          cacheInfo: {
            storageInfo: {
              packetSize: 128,
              storageFormat: 'compactV2',
            },
          },
        },
        minLOD: 4,
        maxLOD: 16,
        maxExportTilesCount: 100000,
        supportedExtensions: '',
      }),
    )
  })

  arcgisRouter.get(
    '/:name/VectorTileServer/resources/styles/root.json',
    (req, res) => {
      const fullUrl = req.protocol + '://' + req.get('host')
      const style = parser(sourcePath)
      res.setHeader('content-type', 'application/json; charset=UTF-8')
      res.statusCode = 200

      if (options.strict) {
        style.sources = Object.fromEntries(
          Object.entries(style.sources).map(([key, val]) => [
            key,
            {
              ...val,
              tiles: undefined,
              url: `${fullUrl}/arcgis/rest/services/${req.params.name}/VectorTileServer`,
            },
          ]),
        )
        if (style.sprite) {
          style.sprite = `${fullUrl}/arcgis/rest/services/${req.params.name}/VectorTileServer/resources/sprites/sprite`
        }
        if (style.glyphs) {
          style.glyphs = `${fullUrl}/arcgis/rest/services/${req.params.name}/VectorTileServer/resources/fonts/{fontstack}/{range}.pbf`
        }
      }
      res.end(JSON.stringify(style))
    },
  )

  arcgisRouter.get(
    '/:name/VectorTileServer/tilemap/:zoom/:top/:left/:width/:height',
    (req, res) => {
      const errorResp = JSON.stringify({
        error: {
          code: 422,
          message: 'No tile available for the specified boundary.',
          details: null,
        },
      })
      const zoom = parseInt(req.params.zoom, 10)
      if (zoom >= 15) {
        res.end(errorResp)
        return
      }
      const width = parseInt(req.params.width, 10)
      const height = parseInt(req.params.height, 10)
      if (width >= 64 || height >= 64) {
        res.end(errorResp)
        return
      }
      const left = parseInt(req.params.left, 10)
      const top = parseInt(req.params.top, 10)
      res.end(
        JSON.stringify({
          adjusted: false,
          location: {
            left,
            top,
            width,
            height,
          },
          data: new Array(height * width).fill(1),
        }),
      )
    },
  )

  // ArcGIS is z/y/x, not z/x/y
  // See: https://developers.arcgis.com/rest/services-reference/enterprise/vector-tile.htm
  arcgisRouter.get(
    '/:name/VectorTileServer/tile/:z/:y/:x.pbf',
    proxy(tileUrl.hostname, {
      https: tileUrl.protocol === 'https:',
      proxyReqPathResolver: (req) => {
        return tileUrl.pathname
          .replace('%7Bz%7D', req.params.z)
          .replace('%7Bx%7D', req.params.x)
          .replace('%7By%7D', req.params.y)
      },
    }),
  )

  if (typeof spriteUrl !== 'undefined') {
    arcgisRouter.get(
      /\/([^/]+)\/VectorTileServer\/resources\/sprites\/sprite([^$]*)/,
      proxy(spriteUrl.hostname, {
        https: spriteUrl.protocol === 'https:',
        proxyReqPathResolver: (req) => {
          const ending = req.params[1]
          return spriteUrl.toString() + ending
        },
      }),
    )
  }

  if (typeof glyphsUrl !== 'undefined') {
    arcgisRouter.get(
      '/:name/VectorTileServer/resources/fonts/:fontstack/:range.pbf',
      proxy(glyphsUrl.hostname, {
        https: glyphsUrl.protocol === 'https:',
        proxyReqPathResolver: (req) => {
          return glyphsUrl.pathname
            .replace('%7Bfontstack%7D', req.params.fontstack)
            .replace('%7Brange%7D', req.params.range)
        },
      }),
    )
  }

  app.get('/', (_req, res) => {
    res.send(`
      <ul>
        <li><a href="/maplibre">MapLibre</a></li>
        <li><a href="/mapbox">Mapbox</a></li>
        <li><a href="/arcgis">ArcGIS</a></li>
      </ul>
    `)
  })

  app.get('/maplibre/style.json', (_req, res) => {
    const style = parser(sourcePath)
    res.setHeader('content-type', 'application/json; charset=UTF-8')
    res.statusCode = 200
    res.end(JSON.stringify(style))
  })

  app.get('/mapbox/style.json', (_req, res) => {
    const style = parser(sourcePath)
    res.setHeader('content-type', 'application/json; charset=UTF-8')
    res.statusCode = 200
    res.end(JSON.stringify(style))
  })

  app.use('/arcgis/rest/services', arcgisRouter)

  app.use('/maplibre', express.static(path.join(providerDir, 'maplibre')))
  app.get('/mapbox/app.js', (_req, res) => {
    const dir = path.join(providerDir, 'mapbox')
    const app = fs.readFileSync(path.join(dir, 'app.js'), 'utf-8')
    const js = app.replace(
      '___MAPBOX_ACCESS_TOKEN___',
      options.mapboxAccessToken || 'ACCESS TOKEN NOT SET',
    )
    res.end(js)
  })
  app.use('/mapbox', express.static(path.join(providerDir, 'mapbox')))

  app.get('/arcgis/app.js', (_req, res) => {
    const dir = path.join(providerDir, 'arcgis')
    const app = fs.readFileSync(path.join(dir, 'app.js'), 'utf-8')
    const js = app.replace(
      '___ARCGIS_ACCESS_TOKEN___',
      options.arcgisAccessToken || 'ACCESS TOKEN NOT SET',
    )
    res.end(js)
  })
  app.use('/arcgis', express.static(path.join(providerDir, 'arcgis')))

  const serverPromise = new Promise<Server>((resolve) => {
    const server = app.listen(port, () => {
      console.log(`itoma listening on port ${port}\n`)
      console.log(`MapLibre interface: http://localhost:${port}/maplibre`)
      console.log(`Mapbox interface  : http://localhost:${port}/mapbox`)
      console.log(`ArcGIS interface  : http://localhost:${port}/arcgis`)
      resolve(server)
    })
  })
  const server = await serverPromise

  return [app, server] as const
}
