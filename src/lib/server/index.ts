import { routes } from '@/routes'
import cors from 'cors'
import express, { RequestHandler } from 'express'
import http from 'http'
import { Server } from 'socket.io'

export const app = express()
export const server = http.createServer(app)
export const io = new Server(server, { cors: { origin: '*' } })

app.use(cors())
app.use(express.json())

export type Route = {
  path: string
  method: string
  handler: RequestHandler
}

routes.forEach((route) => {
  switch (route.method) {
    case 'GET':
      app.get(route.path, route.handler)
      break
    case 'POST':
      app.post(route.path, route.handler)
      break
    case 'PUT':
      app.put(route.path, route.handler)
      break
    case 'DELETE':
      app.delete(route.path, route.handler)
      break
    default:
      break
  }
})
