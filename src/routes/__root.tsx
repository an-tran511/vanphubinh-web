import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"
import { QueryClient } from "@tanstack/react-query"
import { lazy } from "react"
import { AuthContext } from "../authContext"

const TanStackRouterDevtools =
	process.env.NODE_ENV === "production"
		? () => null // Render nothing in production
		: lazy(() =>
				// Lazy load in development
				import("@tanstack/router-devtools").then((res) => ({
					default: res.TanStackRouterDevtools,
					// For Embedded Mode
					// default: res.TanStackRouterDevtoolsPanel
				})),
			)

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient
	auth: AuthContext
}>()({
	component: RootComponent,
})
function RootComponent() {
	return (
		<>
			<Outlet />
			<TanStackRouterDevtools />
		</>
	)
}
