import { commands } from '@/commands'
import { Boom } from '@hapi/boom'
import makeWASocket, {
  ConnectionState,
  DisconnectReason,
  useMultiFileAuthState,
  WAMessage,
  WASocket,
} from '@whiskeysockets/baileys'
import fs from 'fs'
import path from 'path'
import qrcode from 'qrcode'
import config from '../../../config'
import { io } from '../server'
import { getMessage } from './helpers'

const sessionName = config.sessionName || 'my-session'

export let sock: WASocket
export let status: string = 'connecting'

// WhatsApp
export async function connectToWhatsApp(
  isReconnecting?: boolean
): Promise<WASocket> {
  const { state, saveCreds } = await useMultiFileAuthState(
    `sessions/${sessionName}`
  )

  if (isReconnecting) {
    sock = makeWASocket({ auth: state })
  } else {
    sock = sock ?? makeWASocket({ auth: state })
  }

  sock.ev.on('connection.update', handleConnection)
  sock.ev.on('connection.update', handleQR)
  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('messages.upsert', ({ messages }) =>
    handleIncomingMessages({ sock, messages })
  )

  return sock
}

/** Handle connection update from WhatsApp */
async function handleConnection(update: Partial<ConnectionState>) {
  const { connection, lastDisconnect } = update

  if (connection === 'close') {
    handleStatus(connection)

    const shouldReconnect =
      (lastDisconnect?.error as Boom)?.output?.statusCode !==
      DisconnectReason.loggedOut

    console.log(
      `connection closed due to ${lastDisconnect?.error}, reconnecting ${shouldReconnect}`
    )

    if (shouldReconnect) {
      handleStatus('reconnecting')
      connectToWhatsApp(true)
    } else {
      sock = null as any
      handleStatus('connecting')
      await removeSessionFolder()
      connectToWhatsApp()
    }
  } else if (connection === 'open') {
    handleStatus(connection)
    console.log('opened connection')
  }
}

/** Remove session folder if exists */
async function removeSessionFolder() {
  const sessionFolder = path.resolve(sessionName)

  if (!fs.existsSync(sessionFolder)) return

  await fs.promises.rm(sessionFolder, { recursive: true, force: true })
}

// Handle status
function handleStatus(connection: string) {
  status = connection
  io.emit('status', status)
}

// Handle QR code
async function handleQR({ qr }: { qr?: string }) {
  if (!qr) return

  const base64 = await qrcode.toDataURL(qr)
  io.emit('qr', base64)
}

// Handle semua pesan
async function handleIncomingMessages({
  sock,
  messages,
}: {
  sock: WASocket
  messages: WAMessage[]
}) {
  for (let message of messages) {
    await handleCommand({ sock, message })
  }
}

/** Handle pesan yang berupa command */
export async function handleCommand({
  sock,
  message,
}: {
  sock: WASocket
  message: WAMessage
}) {
  const { isCommand, command, fromMe } = getMessage(message)

  // Jika bukan command
  if (fromMe || !isCommand) return false

  // Cari command yang sesuai dengan command yang dikirim user dan jalankan handlernya
  for (const cmd of commands) {
    if (cmd.name === command || cmd.aliases?.includes(command as string)) {
      await cmd.handler({ sock, message })
    }
  }
}
