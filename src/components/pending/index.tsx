import { Center, Loader } from "@mantine/core"

export const Pending = () => {
	return (
		<Center h={{ base: "100dvh", md: "100vh" }}>
			<Loader />
		</Center>
	)
}
