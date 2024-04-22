import "@mantine/core/styles.layer.css"
import "@mantine/dates/styles.layer.css"
import "mantine-datatable/styles.layer.css"

import React from "react"
import ReactDOM from "react-dom/client"
import { MantineProvider } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import { Toaster } from "sonner"
import { AuthProvider } from "@/authContext"
import { theme } from "@/theme"
import { queryClient } from "@/utils/queryClient"
import { DatesProvider } from "@mantine/dates"
import App from "./App.tsx"

import "dayjs/locale/vi"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<MantineProvider theme={theme}>
				<ModalsProvider>
					<AuthProvider>
						<DatesProvider settings={{ locale: "vi", consistentWeeks: true }}>
							<Toaster richColors />
							<App />
							<ReactQueryDevtools />
						</DatesProvider>
					</AuthProvider>
				</ModalsProvider>
			</MantineProvider>
		</QueryClientProvider>
	</React.StrictMode>,
)
