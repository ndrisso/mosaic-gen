const { prepareImages } = require('./setup')

const createMosaic = async (sourceImagePath, tilesPath) => {
    const outputPath = await prepareImages(tilesPath)
}


module.exports = {
    createMosaic
}
