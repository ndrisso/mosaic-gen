const { prepareImages, cleanUp } = require('./setup')
const { averageColor, parseImage, appendImages } = require('./image_utils')
const fs = require('fs')
const path = require('path')
const gm = require('gm')
const im = gm.subClass({ imageMagick: true })
const resultPath = path.join(__dirname, '..')

const createMosaic = async (sourceImagePath, tilesPath, outputImagePath) => {
  console.log('Prepping tiles...')
  const outputPath = await prepareImages(tilesPath)
  console.log('Parsing source image pixels...')
  const sourceImage = await parseImage(sourceImagePath)
  console.log('Calculating average color for each tile...')
  const tiles = await loadTiles(outputPath)
  console.log('Creating mosaic...')
  await writeMosaic(sourceImage, tiles, outputImagePath)
  cleanUp()
  console.log('Done!')
}

const writeMosaic = async (sourceImage, tiles, outputImagePath) => {
  const { height, width, pixels } = sourceImage

  let promises = []

  for (let i = 0; i < height; i++) {
    let imageRow = []

    for (let j = 0; j < width; j++) {
      let pixel = pixels[i * width + j]
      imageRow.push(closestTile(pixel, tiles).file)
    }

    promises.push(appendImages(imageRow, path.join(__dirname, '..', 'temp', `row-${i}.png`)))
  }

  const files = await Promise.all(promises)
  await appendImages(files, outputImagePath, false)
}

const loadTiles = (tilesPath) => {
  const files = fs.readdirSync(tilesPath)

  let tiles = files.map(async file => {
    let fullPath = path.join(tilesPath, file)

    return {
      'file': fullPath,
      'avgPixel': await averageColor(fullPath)
    }
  })

  return Promise.all(tiles)
}

const closestTile = (pixel, tiles) => {
  let closestTile = null
  let minDiff = null
  tiles.forEach(tile => {
    let diff = diffPixels(pixel, tile.avgPixel)

    if (minDiff == null || minDiff > diff) {
      closestTile = tile
      minDiff = diff
    }
  })

  return closestTile
}

const diffPixels = (pixelA, pixelB) => (
  Math.sqrt(Math.pow(pixelA.r - pixelB.r, 2) + Math.pow(pixelA.b - pixelB.b, 2) + Math.pow(pixelA.g - pixelB.g, 2))
)

module.exports = {
  createMosaic
}
