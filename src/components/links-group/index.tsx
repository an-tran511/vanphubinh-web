import { useState } from 'react'
import {
  Group,
  Box,
  Collapse,
  ThemeIcon,
  Text,
  UnstyledButton,
  rem,
} from '@mantine/core'
import { Calendar, CaretRight, Icon } from '@phosphor-icons/react'
import { useNavigate } from '@tanstack/react-router'
import classes from './LinksGroup.module.css'

interface LinksGroupProps {
  icon: Icon
  label: string
  initiallyOpened?: boolean
  link?: string
  links?: { label: string; link: string }[]
}

export default function LinksGroup({
  icon: Icon,
  label,
  initiallyOpened,
  links,
  link,
}: LinksGroupProps) {
  const hasLinks = Array.isArray(links)
  const [opened, setOpened] = useState(initiallyOpened || false)
  const navigate = useNavigate()
  const items = (hasLinks ? links : []).map((link) => (
    <Text
      component="a"
      className={classes.link}
      href={link.link}
      key={link.label}
      onClick={(e) => {
        e.preventDefault()
        navigate({ to: link?.link, replace: false })
      }}
    >
      {link.label}
    </Text>
  ))
  const onClickHandler = (e: { preventDefault: () => void }) => {
    if (link) {
      e.preventDefault()
      navigate({ to: link, replace: false })
    } else {
      setOpened((o) => !o)
    }
  }

  return (
    <>
      <UnstyledButton
        onClick={onClickHandler}
        className={classes.control}
        component={hasLinks ? 'button' : 'a'}
        href={hasLinks ? undefined : String(link)}
      >
        <Group justify="space-between" gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon variant="light" size={30}>
              <Icon style={{ width: rem(18), height: rem(18) }} />
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <CaretRight
              className={classes.chevron}
              weight="bold"
              style={{
                width: rem(12),
                height: rem(12),
                transform: opened ? 'rotate(-90deg)' : 'none',
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  )
}

const mockdata = {
  label: 'Releases',
  icon: Calendar,
  links: [
    { label: 'Upcoming releases', link: '/' },
    { label: 'Previous releases', link: '/' },
    { label: 'Releases schedule', link: '/' },
  ],
}

export function NavbarLinksGroup() {
  return (
    <Box mih={220} p="md">
      <LinksGroup {...mockdata} />
    </Box>
  )
}
