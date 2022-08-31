const fs = require('fs')
const gm = require('gm')
const im = gm.subClass({ imageMagick: true })
const path = require('path')

const pixel_regex = /(?<x>[\d]+),(?<y>[\d]+)\:\W\((?<r>[\d*\.?\d+]+),(?<g>[\d*\.?\d+]+),(?<b>[\d*\.?\d+]+)/

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

const averageColor = async (imagePath) => {
    const image = im(imagePath).resize(1, 1, '!')
    return (await getPixels(image))[0]
}

const getPixels = async (sourceImage) => {
    const image = typeof(sourceImage) == 'string' ? im(sourceImage) : sourceImage
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

const imageToTxt = (image) => {
    return new Promise((resolve, reject) => {
        image.toBuffer('txt', (err, buff) => { 
            if (err) {
                reject(err)
            } else {
                resolve(buff.toString())
            }
        })
    })
}

const identifyImages = (folderPath) => {
    files = fs.readdirSync(folderPath)
    return Promise.all(files.map(file => identifyImage(path.join(folderPath, file))))
}

const identifyImage = (filePath) => {
    return new Promise((resolve, reject) => {
        im(filePath).identify((err, features) => {
            if (err) {
                reject(err)
            } else {
                resolve(features)
            }
        })
    })
}

module.exports = {
    imageToTxt,
    averageColor,
    squareImages,
    getPixels,
    identifyImages,
    identifyImage,
}
