import { Command } from 'commander'
import { serve, ServeOptions } from '../commands/serve'
import { error } from '../lib/error'

const program = new Command()
program
  .name('serve')
  .arguments('<source>')
  .description('serve your map locally')
  .option(
    '--mapbox-access-token [mapboxAccessToken]',
    'Your Mapbox access token',
  )
  .option(
    '--arcgis-access-token [arcgisAccessToken]',
    'Your ArcGIS access token',
  )
  .option('--port [port]', 'Specify custom port')
  .option(
    '--trust-proxy',
    'Trust proxy headers (X-Forwarded-For, X-Forwarded-Host, etc. See the Express documentation for specific details: https://expressjs.com/en/guide/behind-proxies.html',
  )
  .option(
    '--strict',
    'Enable Strict Mode for the ArcGIS REST API. When Strict Mode is enabled, itoma will act as a proxy between the tiles, fonts, and glyphs specified in the style.yml and ArcGIS JavaScript API.',
  )
  .action((source: string, serveOptions: ServeOptions) => {
    const options: ServeOptions = program.opts()
    options.mapboxAccessToken = serveOptions.mapboxAccessToken
    options.arcgisAccessToken = serveOptions.arcgisAccessToken
    options.strict = serveOptions.strict
    options.port = serveOptions.port
    try {
      serve(source, program.opts())
    } catch (e) {
      error(e)
    }
  })

export default program
