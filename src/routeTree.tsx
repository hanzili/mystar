import { RootRoute, Route } from '@tanstack/react-router'
import Root from './routes/root'
import Login from './routes/login'
import Prediction from './routes/prediction'
import History from './routes/history'
import Chat from './routes/chat'

export const rootRoute = new RootRoute({
  component: Root,
})

const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Login,
})

const predictionRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/prediction',
  component: Prediction,
})

const historyRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/history',
  component: History,
})

const chatRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/chat',
  component: Chat,
})

export const routeTree = rootRoute.addChildren([
  loginRoute,
  predictionRoute,
  historyRoute,
  chatRoute,
])