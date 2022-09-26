const { squareImages } = require('./image_utils')
const fs = require('fs')
const path = require('path')

const outputPath = path.join(__dirname, '..', 'temp')

/**
 * Squares and resizes every image in tilesPath
 * to 100x100 and outputs to a temp directory
 * @param {string} tilesPath 
 * @returns {string} Path to folder containing resized images
 */
 const prepareImages = async (tilesPath) => {
  cleanUp()
  fs.mkdirSync(outputPath)
  copyTiles(tilesPath, outputPath)
  await squareImages(outputPath)

  return outputPath
}

const cleanUp = () => {
  if (fs.existsSync(outputPath)) {
    fs.rmdirSync(outputPath, { recursive: true })
  }
}

const copyTiles = (tilesPath, outputPath) => {
  const files = fs.readdirSync(tilesPath).filter(f => ['.jpg', '.png'].includes(path.extname(f)))
  files.forEach(file => fs.copyFileSync(path.join(tilesPath, file), path.join(outputPath, file)))
}

module.exports = {
  prepareImages,
  cleanUp
}
