import { io, server } from './lib/server'
import { connectToWhatsApp, status } from './lib/wa'

io.on('connection', () => {
  io.emit('status', status)
})

server.listen(3000, async () => {
  await connectToWhatsApp()
  console.log('Server online!')
})
