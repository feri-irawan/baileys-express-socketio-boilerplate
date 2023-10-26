import http from "http";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";

export const app = express();
export const server = http.createServer(app);
export const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
