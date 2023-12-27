import { Command } from '@/lib/wa'

export const pingCommand: Command = {
  name: 'ping',
  description: 'Ping!',
  handler: async ({ sock, message }) => {
    await sock.sendMessage(message.key.remoteJid!, { text: 'Pong!' })
  },
}
