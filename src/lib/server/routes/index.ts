import { routes } from '@/routes'
import { Router } from 'express'

const router = Router()

routes.forEach((route) => {
  switch (route.method) {
    case 'GET':
      router.get(route.path, route.handler)
      break
    case 'POST':
      router.post(route.path, route.handler)
      break
    case 'PUT':
      router.put(route.path, route.handler)
      break
    case 'DELETE':
      router.delete(route.path, route.handler)
      break
    default:
      break
  }
})

export { router }
