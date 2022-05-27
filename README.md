# itoma
ArcGIS REST API from style.yml of Charites

![social preview image](https://repository-images.githubusercontent.com/444032842/ddd2f074-225e-4fe5-9311-2b41be83d48a)

# About the social preview image
the [social preview image](https://repository-images.githubusercontent.com/444032842/ddd2f074-225e-4fe5-9311-2b41be83d48a) is [Brush Rest (Fude-oki) in the Shape of a Narcissus Spray and Blossoming Plum Branch](https://www.metmuseum.org/art/collection/search/49431).

## Install

```
$ npm install -g @unvt/itoma
```

## How to use

```
$ itoma serve [path/to/style.yml]
```

More information on options are available with the `--help` option.

```
$ itoma --help
Usage: itoma [options] [command]

Options:
  -v, --version             output the version number
  -h, --help                display help for command

Commands:
  serve [options] <source>  serve your map locally
  help [command]            display help for command
```

### Map Preview
Map Previews by Mapbox GL JS, MapLibre GL JS, and ArcGIS API for Javascript can be seen from http://localhost:8080 (or any specified port).

### ArcGIS REST API response
Once "itoma serve" starts, we can see the ArcGIS REST API responses from http://localhost:8080/arcgis/rest/services/{any_name}/VectorTileServer.  

* index.json: http://localhost:8080/arcgis/rest/services/{any_name}/VectorTileServer/index.json
* root.json (style): http://localhost:8080/arcgis/rest/services/{any_name}/VectorTileServer/resources/styles/root.json
* sprites: http://localhost:8080/arcgis/rest/services/{any_name}/VectorTileServer/resources/sprites/
* glyphs (fonts): http://localhost:8080/arcgis/rest/services/{any_name}/VectorTileServer/resources/fonts/
* tilemap: http://localhost:8080/arcgis/rest/services/{any_name}/VectorTileServer/tilemap
    * Please be advised that the tilemap range (of ZL) is fixed. (You may need to edit source code to adjust it for your own tile range.) 

It is important to understand that ArcGIS Online now supports https protocol only (not http). When you use unvt/itoma to preview your tile with ArcGIS online, please use https protocol for localhost.


## Development

```
$ git clone https://github.com/unvt/itoma
$ cd itoma
$ npm install
```

Then you can install:

```
$ npm install -g .
```

## License

MIT
