import sharp from 'sharp'
import { transferableSymbol, valueSymbol, move } from 'piscina'

export function run({ arrayBuffer, angle }) {
  return new Promise((resolve) => {
    sharp(arrayBuffer)
      .rotate()
      .toBuffer((error, buffer) => {
        if (error) {
          resolve(
            move({
              [valueSymbol]: {
                error,
                arrayBuffer
              },
              [transferableSymbol]: [arrayBuffer]
            })
          )
        } else {
          if (angle > 0) {
            sharp(buffer)
              .rotate(angle)
              .toBuffer((error, buffer) => {
                if (error) {
                  resolve(
                    move({
                      [valueSymbol]: {
                        error,
                        arrayBuffer
                      },
                      [transferableSymbol]: [arrayBuffer]
                    })
                  )
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
          } else {
            const arrayBuffer = buffer.buffer
            resolve(
              move({
                [valueSymbol]: { result: arrayBuffer },
                [transferableSymbol]: [arrayBuffer]
              })
            )
          }
        }
      })
  })
}

export const type = 'correctRotate'
