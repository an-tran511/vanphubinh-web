import {
  Group,
  Stack,
  Box,
  Title,
  Text,
  Button,
  em,
  ActionIcon,
  Card,
  Divider,
  Popover,
  ScrollArea,
  Drawer,
  Badge,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { CaretDown, Note, Plus } from '@phosphor-icons/react';
import { ReactNode } from 'react';
import classes from './Crud.module.css';

interface CreateProps {
  children: ReactNode;
  title: string;
  submitHandler?: () => void;
  savingState?: boolean;
}

export const Create = (props: CreateProps) => {
  const { children, title, savingState, submitHandler } = props;
  const isTablet = useMediaQuery(`(max-width: ${em(801)})`);
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Stack h={{ base: 'calc(100vh - 60px)', md: '100vh' }} gap="0">
      <Box
        py="md"
        px="xl"
        style={{
          borderBottom: '1px solid var(--mantine-color-gray-3)',
          position: 'sticky',
          top: 0,
        }}
      >
        <Group justify="space-between">
          <Group gap="xs">
            <Title order={isTablet ? 4 : 2}>{title}</Title>
            <Badge variant="light" color="blue" ml="sm">
              Mới
            </Badge>
          </Group>

          <Group justify="flex-end" gap="xs">
            {isTablet ? (
              <Group gap="xs">
                <ActionIcon
                  size="md"
                  aria-label="Save"
                  onClick={submitHandler}
                  loading={savingState}
                >
                  <Plus size={14} weight="bold" />
                </ActionIcon>
                <ActionIcon
                  size="md"
                  aria-label="Notes"
                  color="gray"
                  variant="light"
                  onClick={open}
                >
                  <Note size={14} weight="bold" />
                </ActionIcon>
              </Group>
            ) : (
              <Group>
                <Button
                  size={isTablet ? 'xs' : 'sm'}
                  variant="filled"
                  radius="md"
                  justify="space-between"
                  onClick={submitHandler}
                  loading={savingState}
                >
                  Tạo
                </Button>
              </Group>
            )}
          </Group>
        </Group>
      </Box>
      <Box className={classes.wrapper}>
        <Box className={classes.main}>
          <ScrollArea h="100%">{children}</ScrollArea>
        </Box>
        <Box className={classes.aside} visibleFrom="md">
          <Card px="xl" bg="gray.0">
            <Group>
              <Popover width="target" position="bottom" withArrow shadow="md" offset={-5}>
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
            <Divider my="sm" />
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
        ></Drawer>
      </Box>
    </Stack>
  );
};
