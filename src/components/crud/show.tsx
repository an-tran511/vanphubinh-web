import {
  Group,
  Stack,
  Box,
  Title,
  Text,
  Button,
  ActionIcon,
  Card,
  Divider,
  Popover,
  ScrollArea,
  Drawer,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  ArrowCounterClockwise,
  CaretDown,
  FloppyDisk,
  Note,
} from '@phosphor-icons/react'
import { ReactNode } from 'react'
import classes from './Crud.module.css'

interface CreateProps {
  children: ReactNode
  title: string
  isDirty?: boolean
  submitHandler?: () => void
  savingState?: boolean
  reset: () => void
}

export const Show = (props: CreateProps) => {
  const { children, title, isDirty, savingState, reset } = props
  const [opened, { open, close }] = useDisclosure(false)
  return (
    <Stack h={{ base: 'calc(100vh - 60px)', md: '100vh' }} gap="0">
      <Box
        px={{ base: 'lg', md: 'lg' }}
        py="md"
        style={{
          borderBottom: '1px solid var(--mantine-color-gray-3)',
          position: 'sticky',
          top: 0,
        }}
      >
        <Group justify="space-between">
          <Group gap="xs">
            <Title order={6}>{title}</Title>
            {isDirty && (
              <>
                <ActionIcon
                  size="sm"
                  aria-label="Save"
                  type="submit"
                  loading={savingState}
                  variant="subtle"
                >
                  <FloppyDisk size={14} weight="bold" />
                </ActionIcon>
                <ActionIcon
                  size="sm"
                  color="gray"
                  aria-label="Save"
                  type="submit"
                  disabled={savingState}
                  variant="subtle"
                  onClick={() => reset()}
                >
                  <ArrowCounterClockwise size={14} weight="bold" />
                </ActionIcon>
              </>
            )}
          </Group>
          <>
            <ActionIcon
              size="md"
              aria-label="Notes"
              color="gray"
              variant="light"
              onClick={open}
              hiddenFrom="md"
            >
              <Note size={14} weight="bold" />
            </ActionIcon>
          </>
        </Group>
      </Box>
      <Box className={classes.wrapper}>
        <Box className={classes.main}>
          <ScrollArea h="100%">{children}</ScrollArea>
        </Box>
        <Box className={classes.aside} visibleFrom="md">
          <Card px="md" bg="gray.0">
            <Group>
              <Popover
                width="target"
                position="bottom"
                withArrow
                shadow="md"
                offset={-5}
              >
                <Popover.Target>
                  <Button
                    color="gray.0"
                    autoContrast
                    justify="space-between"
                    rightSection={<CaretDown size={14} />}
                    size="compact-md"
                  >
                    <Text fw={500}>Bình luận</Text>
                  </Button>
                </Popover.Target>
                <Popover.Dropdown p="xs">
                  <Stack gap="xs">
                    <Button variant="subtle" autoContrast size="compact-md">
                      <Text fw={500}>Tất cả</Text>
                    </Button>
                    <Button variant="subtle" autoContrast size="compact-md">
                      <Text fw={500}>Bình luận</Text>
                    </Button>
                    <Button variant="subtle" autoContrast size="compact-md">
                      <Text fw={500}>Lịch sử</Text>
                    </Button>
                  </Stack>
                </Popover.Dropdown>
              </Popover>
            </Group>
            <Divider my="xs" />
          </Card>
        </Box>
        <Drawer
          opened={opened}
          onClose={close}
          title={
            <Popover width="target" position="bottom" withArrow shadow="md">
              <Popover.Target>
                <Button
                  color="gray.0"
                  autoContrast
                  justify="space-between"
                  rightSection={<CaretDown size={14} />}
                  size="compact-md"
                >
                  <Text fw={500}>Bình luận</Text>
                </Button>
              </Popover.Target>
              <Popover.Dropdown p="xs">
                <Stack gap="xs">
                  <Button variant="subtle" autoContrast size="compact-md">
                    <Text fw={500}>Tất cả</Text>
                  </Button>
                  <Button variant="subtle" autoContrast size="compact-md">
                    <Text fw={500}>Bình luận</Text>
                  </Button>
                  <Button variant="subtle" autoContrast size="compact-md">
                    <Text fw={500}>Lịch sử</Text>
                  </Button>
                </Stack>
              </Popover.Dropdown>
            </Popover>
          }
          position="bottom"
          styles={{
            header: {
              backgroundColor: 'var(--mantine-color-gray-0)',
              borderBottom: '1px solid var(--mantine-color-gray-3)',
              padding: '0',
              marginLeft: '16px',
              marginRight: '16px',
            },
            content: {
              backgroundColor: 'var(--mantine-color-gray-0)',
            },
          }}
          size="85%"
        >
          Khu vuc binh luan
        </Drawer>
      </Box>
    </Stack>
  )
}
