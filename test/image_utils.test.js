const { resizeTiles } = require('../src/image_utils')
const im = require('image-magick')

describe(('squareTiles') => {

  test('squares & resizes tiles to 100x100 pixels', async () => {
    await resizeTiles('./test/sample_images')
  
    const cb = (err, metadata) => {
      if (err) { return done(err) }
  
      expect(metadata.height).toBe(100)
      expect(metadata.width).toBe(100)
      done()
    }
  
    
  })
  

})

