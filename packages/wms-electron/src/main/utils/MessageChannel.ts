import { ipcMain } from 'electron'
import type { WebContents } from 'electron'

class MessageChannel {
  private messageId: number
  private webContents: WebContents

  constructor(options: { webContents: WebContents }) {
    this.messageId = 0
    this.webContents = options.webContents
  }

  generateId() {
    return ++this.messageId
  }

  runAsync(data) {
    const id = this.generateId()
    this.webContents.send('request-from-main', [id, data])
    return new Promise((resolve, reject) => {
      ipcMain.once(`response-from-renderer-${id}`, (_, { error, result }) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      })
    })
  }
}

export default MessageChannel
