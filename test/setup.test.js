const { prepareImages } = require('../src/setup')
const gm = require('gm')
const im = gm.subClass({ imageMagick: true })
const fs = require('fs')
const path = require('path')

describe('prepareImages', () => {
    test('squares & resizes tiles to 100x100 pixels', async () => {
        const outputPath = await prepareImages('./test/sample_images')
        const tiles = await identifyImages(outputPath)

        tiles.forEach(tile => {
            expect(tile.size.width).toBe(100)
            expect(tile.size.height).toBe(100)
        })
    })
})

const identifyImages = (outputPath) => {
    files = fs.readdirSync(outputPath)
    return Promise.all(files.map(file => identifyPromise(path.join(outputPath, file))))
}

const identifyPromise = (file) => {
    return new Promise((resolve, reject) => {
        im(file).identify((err, features) => {
            if (err) {
                reject(err)
            } else {
                resolve(features)
            }
        })
    })
}
