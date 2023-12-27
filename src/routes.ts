import { RequestHandler } from 'express'
import { broadcastRoute } from './lib/server/routes/broadcast'
import { rootRoute } from './lib/server/routes/root'
import { sendRoute } from './lib/server/routes/send'

export type Route = {
  path: string
  method: string
  handler: RequestHandler
}

export const routes: Route[] = [rootRoute, sendRoute, broadcastRoute]
