import { WAMessage, WASocket } from '@whiskeysockets/baileys'

type Command = {
  name: string
  description?: string
  aliases?: string[]
  handler: ({
    sock,
    message,
  }: {
    sock: WASocket
    message: WAMessage
  }) => Promise<void>
}

export const commands: Command[] = [
  // Ping
  {
    name: 'ping',
    description: 'Ping!',
    handler: async ({
      sock,
      message,
    }: {
      sock: WASocket
      message: WAMessage
    }) => {
      await sock.sendMessage(message.key.remoteJid!, { text: 'Pong!' })
    },
  },
]
