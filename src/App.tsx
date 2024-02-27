import '@mantine/core/styles.layer.css'
import 'mantine-datatable/styles.layer.css'
import '@mantine/dropzone/styles.css'
import { Loader, MantineProvider, Center } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { theme } from './theme'
import {
  QueryClientProvider,
  QueryClient,
  QueryCache,
  MutationCache,
} from '@tanstack/react-query'
import { Router, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { Toaster, toast } from 'sonner'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
  // queryCache: new QueryCache({
  //   onError: (error, query) => {
  //     // 🎉 only show error toasts if we already have data in the cache
  //     // which indicates a failed background update
  //     if (query.state.data !== undefined) {
  //       toast.error(`Lỗi: ${error.message}`)
  //     }
  //     toast.error(`Lỗi: ${error.message}`)
  //   },
  // }),
  // mutationCache: new MutationCache({
  //   onError: (error: { message: string }) => {
  //     // 🎉 only show error toasts if we already have data in the cache
  //     // which indicates a failed background update

  //     toast.error(`Lỗi: ${error.message}`)
  //   },
  // }),
})

const router = new Router({
  routeTree,
  defaultPendingComponent: () => (
    <Center h="100vh">
      <Loader />
    </Center>
  ),
  defaultErrorComponent: () => <>erro</>,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
})

function App() {
  return (
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <ModalsProvider>
          <Toaster richColors />
          <RouterProvider router={router} />
        </ModalsProvider>
      </QueryClientProvider>
    </MantineProvider>
  )
}

export default App
