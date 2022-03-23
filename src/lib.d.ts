declare module '@unvt/charites/dist/lib/yaml-parser' {
  import type { StyleSpecification } from '@maplibre/maplibre-gl-style-spec/types'
  export function parser(file: string): StyleSpecification
}
