import { Boom } from "@hapi/boom";
import makeWASocket, {
  ConnectionState,
  DisconnectReason,
  useMultiFileAuthState,
  WAMessage,
  WASocket,
} from "@whiskeysockets/baileys";
import { io } from "./server";
import qrcode from "qrcode";
import config from "../config";
import fs from "node:fs/promises";
import { existsSync } from "fs";
import path from "path";

const sessionName = config.sessionName || "my-session";

export let sock: WASocket;
export let status: string = "connecting";

// WhatsApp
export async function connectToWhatsApp(isReconnecting?: boolean) {
  const { state, saveCreds } = await useMultiFileAuthState(
    `sessions/${sessionName}`
  );
  sock = isReconnecting
    ? makeWASocket({ auth: state })
    : sock ?? makeWASocket({ auth: state });

  sock.ev.on("connection.update", handleConnection);
  sock.ev.on("connection.update", handleQR);
  sock.ev.on("creds.update", saveCreds);
  sock.ev.on("messages.upsert", (m) => handleMessages(sock, m));
}

// Hanlde connection WA
async function handleConnection(update: Partial<ConnectionState>) {
  const { connection, lastDisconnect } = update;

  if (connection === "close") {
    handleStatus(connection);

    const shouldReconnect =
      (lastDisconnect?.error as Boom)?.output?.statusCode !==
      DisconnectReason.loggedOut;

    console.log(
      "connection closed due to ",
      lastDisconnect?.error,
      ", reconnecting ",
      shouldReconnect
    );

    // reconnect if not logged out
    if (shouldReconnect) {
      handleStatus("reconnecting");
      connectToWhatsApp(true);
    } else {
      sock = null as any;
      handleStatus("connecting");
      await removeSessionFolder();
      connectToWhatsApp();
    }
  } else if (connection === "open") {
    handleStatus(connection);
    console.log("opened connection");
  }
}

// Remove session folder
async function removeSessionFolder() {
  const sessionFolder = path.resolve(sessionName);
  if (existsSync(sessionFolder)) {
    await fs.rm(sessionFolder, { recursive: true, force: true });
  }
  return;
}

// Handle status
function handleStatus(connection: string) {
  status = connection;
  io.emit("status", status);
}

// Handle QR code
async function handleQR({ qr }: any) {
  if (!qr) return;
  const base64 = await qrcode.toDataURL(qr);
  io.emit("qr", base64);
}

// Handle semua pesan
async function handleMessages(
  sock: WASocket,
  { messages }: { messages: WAMessage[] }
) {
  for (let message of messages) {
    if (await handleCommand(sock, message)) return;
    else handleMessage(sock, message);
  }
}

// Handle pesan yang berupa command
async function handleCommand(sock: WASocket, message: WAMessage) {
  const { isCommand, command, fromMe, jid } = getMessage(message);
  if (fromMe || !isCommand) return false;

  switch (command) {
    case "ping":
      await sock.sendMessage(jid, { text: "Pong!" });
      break;

    default:
      await sock.sendMessage(jid, {
        text: `It's *!${command}* command, i dont know that, sorry.`,
      });
      break;
  }

  return true;
}

// Handle satu pesan yang bukan command
async function handleMessage(sock: WASocket, message: WAMessage) {
  const { text, fromMe, jid } = getMessage(message);
  if (fromMe) return;

  await sock.sendMessage(jid, {
    text: "Hello",
  });
}

// Mendapatkan property yang sering digunakan
function getMessage(m: WAMessage) {
  console.log(JSON.stringify(m, null, 2));
  const text = (
    m.message?.conversation ||
    m.message?.extendedTextMessage?.text ||
    ""
  ).trim();
  return {
    text,
    fromMe: m.key.fromMe,
    isCommand: text.startsWith("!"),
    jid: m.key.remoteJid!,
    command: text.split(" ").at(0)?.slice(1).trim(),
    args: text.split(" ").slice(1).join(" "),
  };
}
