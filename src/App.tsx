import "./App.css"
import "@mantine/core/styles.layer.css"
import "@mantine/dates/styles.layer.css"
import "mantine-datatable/styles.layer.css"

import { RouterProvider } from "@tanstack/react-router"
import { useAuth } from "@/hooks/useAuth"
import { routerClient } from "@/utils/routerClient"
import { queryClient } from "@/utils/queryClient"

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		routerClient: typeof routerClient
	}
}

function App() {
	const auth = useAuth()

	return (
		<RouterProvider router={routerClient} context={{ auth, queryClient }} />
	)
}

export default App
