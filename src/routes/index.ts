import { Route } from '@/lib/server'
import { rootRoute } from './root'
import { sendRoute } from './send'

export const routes: Route[] = [rootRoute, sendRoute]
