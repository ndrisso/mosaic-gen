const fs = require('fs')
const path = require('path')
const gm = require('gm')
const im = gm.subClass({ imageMagick: true })
const outputPath = path.join(__dirname, '..', 'temp')

const pixel_regex = /(?<x>[\d]+),(?<y>[\d]+)\:\W\((?<r>[\d]+),(?<g>[\d]+),(?<b>[\d]+)/

/**
 * Squares and resizes every image in tilesPath
 * to 100x100 and outputs to a temp directory
 * @param {string} tilesPath 
 * @returns {string} Path to folder containing resized images
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
                const filePath = path.join(outputPath, file)
                im(filePath).resize(100, 100, '!').write(filePath, (err) => {
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

const getPixels = async (sourceImagePath) => {
    const image = im(sourceImagePath)
    const txtImage = await imageToTxt(image)
    let pixelsArray = txtImage.split('\n')
    // First and last elements are not pixels
    pixelsArray.shift()
    pixelsArray.pop()

    return pixelsArray.map(pixel => {
        let group = pixel.match(pixel_regex).groups
        Object.keys(group).forEach(key => group[key] = parseInt(group[key]))
        return group
    })
}

const imageToTxt = async (image) => {
    const txtImage = await new Promise((resolve, reject) => {
        image.toBuffer('txt', (err, buff) => { 
            if (err) {
                reject(err)
            } else {
                resolve(buff.toString())
            }
        })
    })

    return txtImage
}

module.exports = {
    prepareImages,
    getPixels
}
