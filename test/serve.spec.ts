import path from 'path'
import fetch from 'node-fetch'
import { serve } from '../src/commands/serve'
import { expect } from 'chai'

describe('itoma server', () => {
  it('should start an HTTP server on the default port', async function () {
    this.timeout(10_000) // it takes time for the Express server to boot sometimes.
    const x = await serve(path.join(__dirname, 'data', 'style.yml'), {
      port: '53492',
    })
    const resp = await fetch('http://localhost:53492/maplibre/style.json')
    const json = await resp.json()
    expect(json).to.not.be.undefined
    x[1].close()
  })
})
