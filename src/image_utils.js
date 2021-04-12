const fs = require('fs')
const path = require('path')
const im = require('imagemagick')
const outputPath = path.join(__dirname, '..', 'temp')

/**
 * Squares and resizes every image in the tilesPath
 * to 100x100 and outpus everything into a new tiles directory
 * @param {string} tilesPath 
 * @returns {string} Path to folder containing output
 */
const prepareImages = async (tilesPath) => {
  cleanPreexistingTemp(outputPath)
  copyTiles(tilesPath, outputPath)
  await squareTiles(outputPath)

  return outputPath
}

const cleanPreexistingTemp = (outputPath) => {
  if (fs.existsSync(outputPath)) {
    fs.rmdirSync(outputPath, { recursive: true })
  }
  fs.mkdirSync(outputPath)
}

const copyTiles = (tilesPath, outputPath) => {
  files = fs.readdirSync(tilesPath)
  files.forEach(file => fs.copyFileSync(path.join(tilesPath, file), path.join(outputPath, file)))
}

const squareTiles = (outputPath) => {
  files = fs.readdirSync(outputPath)
  return Promise.all(
    files.map(file => {
      return new Promise((resolve, reject) => {
        im.convert([path.join(outputPath, file), '-resize', '100x100!', path.join(outputPath, file)], (err, stdout, stderr) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      })
    })
  )
}

module.exports = {
  prepareImages
}
