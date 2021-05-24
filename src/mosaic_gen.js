const { prepareImages } = require('./setup')
const gm = require('gm')
const im = gm.subClass({ imageMagick: true })

const createMosaic = async (sourceImagePath, tilesPath) => {
    const outputPath = await prepareImages(tilesPath)
}

module.exports = {
    createMosaic,
    getPixels
}
