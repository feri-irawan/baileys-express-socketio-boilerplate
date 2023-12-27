import { Route } from '@/routes'

export const rootRoute: Route = {
  path: '/',
  method: 'GET',
  handler: (req, res) => {
    res.sendFile(__dirname + '/index.html')
  },
}
