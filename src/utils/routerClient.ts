import { routeTree } from '@/routeTree.gen'
import { createRouter } from '@tanstack/react-router'
import { queryClient } from '@/utils/queryClient'
import { Pending } from '@/components/pending'

export const routerClient = createRouter({
  routeTree,
  defaultPendingComponent: Pending,
  context: {
    queryClient,
    auth: undefined!,
  },
  defaultPreload: 'intent',
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
})
