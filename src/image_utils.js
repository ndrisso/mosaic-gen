const fs = require('fs')
const gm = require('gm')
const im = gm.subClass({ imageMagick: true })
const path = require('path')

const pixel_regex = /(?<x>[\d]+),(?<y>[\d]+)\:\W\((?<r>[\d]+),(?<g>[\d]+),(?<b>[\d]+)/

const squareImages = (folderPath) => {
    files = fs.readdirSync(folderPath)
    return Promise.all(
        files.map(file => {
            return new Promise((resolve, reject) => {
                const filePath = path.join(folderPath, file)
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
    squareImages,
    getPixels
}
