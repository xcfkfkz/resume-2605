import sharp from 'sharp'
import { transferableSymbol, valueSymbol, move } from 'piscina'

export function run({ arrayBuffer, extractOptions, resizedWidth, extension }) {
  return new Promise((resolve) => {
    const extractedSharp = sharp(arrayBuffer).extract(extractOptions)
    const resizedSharp =
      extractOptions.width === resizedWidth
        ? extractedSharp
        : extractedSharp.resize(Math.floor(resizedWidth))
    resizedSharp.toFormat(extension, { quality: 100 }).toBuffer((error, buffer) => {
      if (error) {
        resolve({ error })
      } else {
        const arrayBuffer = buffer.buffer
        resolve(
          move({
            [valueSymbol]: { result: arrayBuffer },
            [transferableSymbol]: [arrayBuffer]
          })
        )
      }
    })
  })
}

export const type = 'extract'
