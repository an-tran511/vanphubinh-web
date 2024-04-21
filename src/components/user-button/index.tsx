import { Group, Text, ActionIcon } from '@mantine/core'
import { SignOut } from '@phosphor-icons/react'
import Avvvatars from 'avvvatars-react'
import initials from 'initials'
import { useMutation } from '@tanstack/react-query'
import { flushSync } from 'react-dom'
import { useNavigate } from '@tanstack/react-router'
import classes from './UserButton.module.css'
import { useAuth } from '@/hooks/useAuth'
import { logout } from '@/apis/auth'

export function UserButton() {
  const { user, setUser } = useAuth()
  const name = user?.name?.split(' ').slice(-2).join(' ') || ''
  const navigate = useNavigate()
  const { mutate } = useMutation({
    mutationKey: ['logout'],
    mutationFn: logout,
    onSettled: () => {
      flushSync(() => {
        setUser(null)
      })
      ///replace = false to refresh the page
      navigate({ to: '/auth/login', replace: false })
    },
  })
  return (
    <Group className={classes.user} justify="space-between">
      <Group gap="xs">
        <Avvvatars value={initials(name)} size={30} />

        <div style={{ flex: 1 }}>
          <Text size="xs" fw={500}>
            {user?.name}
          </Text>

          <Text c="dimmed" size="xs">
            {user?.email}
          </Text>
        </div>
      </Group>
      <ActionIcon
        color="red"
        variant="subtle"
        aria-label="Logout"
        onClick={() => mutate()}
        size="md"
      >
        <SignOut />
      </ActionIcon>
    </Group>
  )
}
