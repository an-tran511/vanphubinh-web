import { ScrollArea, rem, Image, Center } from "@mantine/core"
import {
	AddressBook,
	Gauge,
	Package,
	Warehouse,
	Cylinder,
} from "@phosphor-icons/react"
import LinksGroup from "@/components/links-group"
import classes from "./NavbarNested.module.css"
import logo from "@/assets/logo.png"
import { UserButton } from "@/components/user-button"

const mockdata = [
	{ label: "Bảng điều khiển", icon: Gauge, link: "/" },
	{ label: "Quản lý trục", icon: Cylinder, link: "/purchase-mould-orders" },
	{
		label: "Hàng hoá",
		icon: Package,
		initiallyOpened: true,
		links: [
			{ label: "Bao bì", link: "/packagings" },
			{ label: "Trục in", link: "/moulds" },
		],
	},
	{ label: "Đối tác", icon: AddressBook, link: "/partners" },
	{
		label: "Kho bãi",
		icon: Warehouse,
		initiallyOpened: false,
		links: [
			// { label: 'Kho', link: '/warehouses' },
			{ label: "Vị trí kho", link: "/locations" },
		],
	},
]

export function NavbarNested() {
	const links = mockdata.map((item) => (
		<LinksGroup {...item} key={item.label} />
	))

	return (
		<nav className={classes.navbar}>
			<div className={classes.header}>
				<Center>
					<Image src={logo} style={{ width: rem(140) }} />
				</Center>
			</div>

			<ScrollArea className={classes.links}>
				<div className={classes.linksInner}>{links}</div>
			</ScrollArea>

			<div className={classes.footer}>
				<UserButton />
			</div>
		</nav>
	)
}
