const { prepareImages } = require('../src/setup')
const { identifyImages } = require('../src/image_utils')

const fs = require('fs')
const path = require('path')

describe('prepareImages', () => {
    test('squares & resizes tiles to 100x100 pixels', async () => {
        const outputPath = await prepareImages(path.join(__dirname, 'sample_images'))
        const tiles = await identifyImages(outputPath)

        tiles.forEach(tile => {
            expect(tile.size.width).toBe(100)
            expect(tile.size.height).toBe(100)
        })
    })
})
