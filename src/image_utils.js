const fs = require('fs')
const path = require('path')
const outputPath = 'temp'

/**
 * Squares and resizes every image in the tilesPath
 * to 100x100 and outpus everything into a new tiles directory
 * @param {string} tilesPath 
 * @returns {string} Path to folder containing output
 */
const prepareImages = async (tilesPath) => {
  if (fs.existsSync(tilesPath)) {
    fs.rmdirSync(outputPath, { recursive: true })
  }
  fs.mkdirSync(outputPath)
  await copyTiles(tilesPath, outputPath)
  await squareTiles(outputPath)
  await resizeTiles(outputPath)

  return outputPath
}

const copyTiles = async (tilesPath, outputPath) => {
  files = fs.readdirSync(tilesPath)
  files.forEach(file => fs.copyFileSync(path.join(tilesPath, file), path.join(outputPath, file)))
}

const squareTiles = async (tilesPath) => {
  return true
}

const resizeTiles = async (tilesPath) => {
  return true
}

module.exports = {
  prepareImages
}
