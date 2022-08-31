const { getPixels, identifyImage } = require('../src/image_utils')
const path = require('path')

describe('getPixels', () => {
    test('gathers all pixels in image', async () => {
        const filePath = path.join(__dirname, 'sample_images', 'sample_3.jpg')
        const pixels = await getPixels(filePath)
        const image = await identifyImage(filePath)

        expect(pixels.length).toBe(image.size.width * image.size.height)
    })

    test('pixels are ordered left to right and top to bottom', async () => {
        const filePath = path.join(__dirname, 'sample_images', 'sample_3.jpg')
        const pixels = await getPixels(filePath)
        const image = await identifyImage(filePath)

        for (i = 0; i < image.size.height; i++) {
            for (j = 0; j < image.size.width; j++) {
                expect(pixels[i * image.size.width + j]).toMatchObject({x: j, y: i})
            }
        }
    })

    test('properly captures pixel colors', async () => {
        const filePath = path.join(__dirname, 'sample_images', 'sample_3.jpg')
        const pixels = await getPixels(filePath)

        expect(pixels[0]).toMatchObject({r: 253, g: 253, b: 253})
        expect(pixels[500]).toMatchObject({r: 255, g: 255, b: 255})
        expect(pixels[5000]).toMatchObject({r: 139, g: 183, b: 228})
        expect(pixels[9999]).toMatchObject({r: 252, g: 237, b: 206})
    })
})
