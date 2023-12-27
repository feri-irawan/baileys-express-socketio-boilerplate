import { connectToWhatsApp } from '@/lib/wa'
import { Route } from '@/routes'

export const sendRoute: Route = {
  path: '/send',
  method: 'POST',
  handler: async (req, res) => {
    const body = req.body
    const sock = await connectToWhatsApp()

    await sock.sendMessage(body.to, { text: body.text })

    res.json({ status: 200, message: 'Message has been sent.' })
  },
}
