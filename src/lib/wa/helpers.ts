import { WAMessage } from '@whiskeysockets/baileys'

// Mendapatkan property yang sering digunakan
export function getMessage(m: WAMessage) {
  const { message, key } = m;
  const { conversation, extendedTextMessage } = message || {};
  const text = (conversation || extendedTextMessage?.text || '').trim();
  const isCommand = text.startsWith('!');
  const [command, ...args] = text.split(' ').map((word) => word);

  return {
    text,
    jid: key.remoteJid!,
    fromMe: key.fromMe,
    isCommand,
    command: command?.trim().slice(1),
    args: args.join(' '),
  };
}
