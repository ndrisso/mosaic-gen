const { prepareImages } = require('./setup')
const { getPixels, averageColor, parseImage } = require('./image_utils')
const fs = require('fs')
const path = require('path')
const gm = require('gm')
const im = gm.subClass({ imageMagick: true })
const resultPath = path.join(__dirname, '..')

const createMosaic = async (sourceImagePath, tilesPath) => {
  const outputPath = await prepareImages(tilesPath)
  const sourceImage = await parseImage(sourceImagePath)
  const tiles = await loadTiles(outputPath)

  writeMosaic(sourceImage, tiles)
}

const writeMosaic = async (sourceImage, tiles) => {
  console.log('Creating mosaic...')
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
  await appendImages(files, path.join(resultPath, 'mosaic.png'), false)

  console.log('Mosaic created!')
}

const appendImages = (tilesFilePaths, resultFilePath, leftToRight = true) => {
  let resultImage = im(tilesFilePaths.shift())
  
  tilesFilePaths.forEach(filePath => {
    resultImage = resultImage.append(filePath, leftToRight)
  })

  return new Promise((resolve, reject) => {
    resultImage.write(resultFilePath, (err) => {
      if (err) {
        reject(err)
      }

      resolve(resultFilePath)
    })
  })
}

const loadTiles = (tilesPath) => {
  console.log('Loading tiles and calculating their average color...')
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
  createMosaic,
  loadTiles,
  closestTile
}
