import { getRouteApi, useRouter } from "@tanstack/react-router"
import { useAuth } from "./useAuth"
import { useMutation } from "@tanstack/react-query"
import { flushSync } from "react-dom"
import { login } from "@/apis/auth"
import { toast } from "sonner"

export const useLogin = () => {
	const auth = useAuth()
	const routeApi = getRouteApi("/auth/login")
	const search = routeApi.useSearch()

	const { navigate } = useRouter()

	const { mutate, isPending } = useMutation({
		mutationKey: ["login"],
		mutationFn: login,
		onSuccess: (data) => {
			flushSync(() => {
				auth.setUser(
					{ email: data?.user?.email, name: data?.user.name } || null,
				)
			})
			navigate({ to: search.redirect })
		},
		onError: () => {
			toast.error("Đăng nhập thất bại")
		},
	})
	return {
		login: (data: { email: string; password: string }) => {
			mutate(data)
		},
		isPending,
	}
}
