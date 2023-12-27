import { connectToWhatsApp } from '@/lib/wa'
import { Route } from '@/routes'

export const broadcastRoute: Route = {
  path: '/broadcast',
  method: 'POST',
  handler: async (req, res) => {
    const body = req.body
    const sock = await connectToWhatsApp()

    const contacts = body.to.map((number: string) => number + '@s.whatsapp.net')

    for (const contact of contacts) {
      await sock.sendMessage(contact, { text: body.text })
    }

    res.json({ status: 200, message: 'Message has been sent.' })
  },
}
