const { prepareImages } = require('../src/image_utils')
const im = require('imagemagick')
const fs = require('fs')
const path = require('path')
const { resolve } = require('path')

describe('prepareImages', () => {
  test('squares & resizes tiles to 100x100 pixels', async () => {
    const outputPath = await prepareImages('./test/sample_images')
    const tiles = await identifyImages(outputPath)
    tiles.forEach(tile => {
      expect(tile.width).toBe(100)
      expect(tile.height).toBe(100)
    })
  })
})

const identifyImages = (outputPath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(outputPath, (err, files) => {
      if (err) {
        reject(err)
        return
      }

      promises = files.map(file => identifyPromise(path.join(outputPath, file)))
      resolve(Promise.all(promises))
    })
  })
}

const identifyPromise = (file) => {
  return new Promise((resolve, reject) => {
    im.identify(file, (err, features) => {
      if (err) {
        reject(err)
      } else {
        resolve(features)
      }
    })
  })
}
