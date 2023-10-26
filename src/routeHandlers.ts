import { RequestHandler } from "express";
import { connectToWhatsApp, sock } from "./wa";

// GET `/`
export const handleIndexRoute: RequestHandler = (req, res) => {
  res.sendFile(__dirname + "/index.html");
};

// POST `/send`
export const handleSendRoute: RequestHandler = async (req, res) => {
  const body = req.body;
  await connectToWhatsApp();

  await sock.sendMessage(body.to, { text: body.text });

  res.json({ status: 200, message: "Message has been sent." });
};

// POST `/broadcast`
export const handleBroadcastRoute: RequestHandler = async (req, res) => {
  const body = req.body;
  await connectToWhatsApp();

  const contacts = body.to.map((v: string) => v + "@s.whatsapp.net");

  for (const contact of contacts) {
    await sock.sendMessage(contact, { text: body.text });
  }

  res.json({ status: 200, message: "Message has been sent." });
};
