import {
  handleBroadcastRoute,
  handleIndexRoute,
  handleSendRoute,
} from "./routeHandlers";
import { app, io, server } from "./server";
import { connectToWhatsApp, status } from "./wa";

io.on("connection", () => {
  io.emit("status", status);
});

app.get("/", handleIndexRoute);
app.post("/send", handleSendRoute);
app.post("/broadcast", handleBroadcastRoute);

server.listen(3000, () => {
  connectToWhatsApp();
  console.log("Server online!");
});
