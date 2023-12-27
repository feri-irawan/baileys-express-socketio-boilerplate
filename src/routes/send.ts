import { Route } from '@/lib/server'
import { sock, status } from '@/lib/wa'
import { ZodError, z } from 'zod'

const bodySchema = z.object({
  to: z.array(z.string()),
  text: z.string(),
})

export const sendRoute: Route = {
  path: '/send',
  method: 'POST',
  handler: async (req, res) => {
    // If whatsapp is not connected
    if (status !== 'open') {
      res
        .status(500)
        .json({ status: 500, message: 'Whatsapp is not connected' })
      return
    }

    try {
      const { to, text } = bodySchema.parse(req.body)
      const receivers = await sock.onWhatsApp(...to)

      // Send messages
      const errorReceivers = []
      for (const receiver of receivers) {
        if (receiver.exists) await sock.sendMessage(receiver.jid, { text })
        else errorReceivers.push(receiver.jid)
      }

      res.json({
        status: 200,
        message: 'Message has been sent.',
        errorReceivers,
      })
    } catch (error) {
      // If error is ZodError
      if (error instanceof ZodError) {
        res.status(400).json({ status: 400, message: error.issues })
        return
      }

      // If error is not ZodError
      res.status(500).json({ status: 500, message: error })
    }
  },
}
