#!/usr/bin/env node

const argv = require('yargs')
  .scriptName("mosaic-gen")
  .usage('Photomosaic generator \n\nUsage: $0 [options]')
  .version(false)
  .options({
    source_image_path: {
      alias: 's',
      description: "Path to source image",
      requiresArg: true,
      required: true,
      type: 'string'
    },
    tiles_path: {
      alias: 't',
      description: "Path to tiles folder, if omited will try to use the contents of the squared_tiles folder",
      requiresArg: true,
      required: false,
      default: 'squared_tiles',
      type: 'string'
    }
  })
  .argv

const { createMosaic } = require('./src/mosaic_gen')
createMosaic(argv.source_image_path, argv.tiles_path)
