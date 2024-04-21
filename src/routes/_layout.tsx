import {
	Outlet,
	createFileRoute,
	redirect,
	useRouterState,
} from "@tanstack/react-router"
import { AppShell, Burger, Group, em } from "@mantine/core"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import { useEffect } from "react"
import { NavbarNested } from "@/components/nested-nav"

export const Route = createFileRoute("/_layout")({
	component: Layout,
	beforeLoad: async ({ context, location }) => {
		if (!context.auth?.isAuthenticated) {
			throw redirect({
				to: "/auth/login",
				search: {
					redirect: location.href,
				},
			})
		}
	},
})

function Layout() {
	const [opened, { toggle, close }] = useDisclosure(false)
	const { location } = useRouterState()
	const isMobile = useMediaQuery(`(max-width: ${em(1023)})`)

	useEffect(() => {
		if (isMobile && opened) {
			close()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.pathname])

	return (
		<>
			<AppShell
				layout="alt"
				header={{ height: 60, collapsed: !isMobile }}
				navbar={{
					width: "250",
					breakpoint: "md",
					collapsed: { mobile: !opened },
				}}
				padding="0"
				transitionDuration={500}
				transitionTimingFunction="ease"
			>
				<AppShell.Header>
					<Group h="100%" px={{ base: "md", md: "lg" }}>
						<Burger
							opened={opened}
							onClick={toggle}
							hiddenFrom="md"
							size="sm"
						/>
					</Group>
				</AppShell.Header>
				<AppShell.Navbar p={0} m={0} withBorder={true}>
					<NavbarNested />
				</AppShell.Navbar>
				<AppShell.Main h="100dvh" bg="white">
					<Outlet />
				</AppShell.Main>
			</AppShell>
		</>
	)
}
