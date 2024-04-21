import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { createContext, useState } from "react"
import { me } from "@/apis/auth"

type User = {
	email: string | null
	name: string | null
}

export interface AuthContext {
	isAuthenticated: boolean
	setUser: (user: User | null) => void
	user: User | null
}

export const AuthContextInstance = createContext<AuthContext | null>(null)

const queryOption = queryOptions({
	queryKey: ["auth", "me"],
	queryFn: me,
	retry: 0,
	retryOnMount: false,
	refetchOnMount: false,
	refetchOnWindowFocus: false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const { data } = useSuspenseQuery(queryOption)
	const [user, setUser] = useState<User | null>(data?.user || null)
	const isAuthenticated = !!user

	return (
		<AuthContextInstance.Provider value={{ isAuthenticated, user, setUser }}>
			{children}
		</AuthContextInstance.Provider>
	)
}
