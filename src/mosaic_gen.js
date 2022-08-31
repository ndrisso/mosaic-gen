const { prepareImages } = require('./setup')
const { getPixels, averageColor } = require('./image_utils')
const fs = require('fs')
const path = require('path')

const createMosaic = async (sourceImagePath, tilesPath) => {
    const outputPath = await prepareImages(tilesPath)
    const pixels = await getPixels(sourceImagePath)
    const tiles = await loadTiles(outputPath)

    writeMosaic(pixels, tiles)
}

const writeMosaic = (pixels, tiles) => {
    pixels.forEach(pixel => {
        tile = closestTile(pixel, tiles)
        //Write routine to write tile at pixel.x and pixel.y
        im('./src/temp/sample_1.jpg').
            montage('./src/temp/sample_2.jpg').
            geometry('100x100+0+0').
            tile('1x2').
            write('./mon.jpg', (err) => console.log(err))
    })
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
        diff = diffPixels(pixel, tile.avgPixel)

        if (minDiff == null || minDiff > diff) {
            closestTile = tile
            minDiff = diff
        }
    })

    return closesTile
}

const diffPixels = (pixelA, pixelB) => {
    Math.sqrt(Math.pow(pixelA.r - pixelB.r, 2) + Math.pow(pixelA.b - pixelB.b, 2) + Math.pow(pixelA.g - pixelB.g, 2))
}

module.exports = {
    createMosaic,
    loadTiles,
    closestTile
}

var tiles = loadTiles('./src/temp')
console.dir(tiles)
