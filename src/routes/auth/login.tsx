import { createFileRoute, redirect } from "@tanstack/react-router"
import {
	Button,
	Card,
	Center,
	Stack,
	Image,
	Title,
	TextInput,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { useLogin } from "@/hooks/useLogin"
import { valibotResolver } from "mantine-form-valibot-resolver"
import { email, minLength, object, string, parse, fallback } from "valibot"
import logo from "@/assets/logo.png"

const routeSearchSchema = object({
	redirect: fallback(string(), "/"),
})
export const Route = createFileRoute("/auth/login")({
	component: Login,
	validateSearch: (search) => parse(routeSearchSchema, search),
	beforeLoad: async ({ context }) => {
		if (context.auth.isAuthenticated) {
			throw redirect({
				to: "/",
			})
		}
	},
})

const loginFormSchema = object({
	email: string([email()]),
	password: string([minLength(6)]),
})

function Login() {
	const { login, isPending } = useLogin()

	const form = useForm({
		mode: "uncontrolled",
		initialValues: {
			email: "",
			password: "",
		},
		validate: valibotResolver(loginFormSchema),
	})

	const submitHandler = (data: { email: string; password: string }) => {
		login(data)
	}

	return (
		<Center h={{ base: "100dvh", md: "100vh" }}>
			<Stack w={{ base: "80%", md: "35%" }} gap="lg">
				<Center>
					<Image src={logo} w={{ base: "60%", md: "35%" }} />
				</Center>
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<form onSubmit={form.onSubmit(submitHandler)}>
						<Stack>
							<Center>
								<Title order={3}>Đăng nhập</Title>
							</Center>

							<TextInput
								name="email"
								type="email"
								label="Email"
								{...form.getInputProps("email")}
							/>
							<TextInput
								name="password"
								type="password"
								label="Mật khẩu"
								{...form.getInputProps("password")}
							/>
							<Button type="submit" loading={isPending}>
								Đăng nhập
							</Button>
						</Stack>
					</form>
				</Card>
			</Stack>
		</Center>
	)
}
