import {
  Group,
  Stack,
  Card,
  Box,
  Button,
  Title,
  Pagination,
  Text,
  Anchor,
  em,
  TextInput,
  ActionIcon,
  SimpleGrid,
  Divider,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { House, MagnifyingGlass, Plus } from '@phosphor-icons/react';
import { useNavigate } from '@tanstack/react-router';
import { ReactNode } from 'react';
import { lighten } from '@mantine/core';

interface ListProps {
  children: ReactNode;
  title: string;
  onCreateHandler?: () => void;
  pagination?: {
    isLoading: boolean;
    total: number;
    page: number;
    lastPage: number;
    onPageChange: (page: number) => void;
  };
}

export const List = (props: ListProps) => {
  const { title, children, onCreateHandler, pagination } = props;
  const { page, onPageChange, lastPage, isLoading, total } = pagination ?? {};
  const navigate = useNavigate();
  const defaultHandleClick = () => navigate({ to: `create` });
  const isTablet = useMediaQuery(`(max-width: ${em(801)})`);

  const createHandler =
    typeof onCreateHandler === 'function' ? onCreateHandler : defaultHandleClick;
  const items = [
    {
      title: <House size={12} />,
      href: '#',
    },
    { title: 'Bao bì', href: '#' },
  ].map((item, index) => (
    <Anchor href={item.href} key={index} size="xs">
      {item.title}
    </Anchor>
  ));
  return (
    <Stack h={{ base: 'calc(100vh - 60px)', md: '100vh' }} gap="0">
      <Box
        py="md"
        px="xl"
        style={{
          borderBottom: '1px solid var(--mantine-color-gray-3)',
        }}
      >
        <Group justify="space-between">
          <Group>
            <Title order={isTablet ? 4 : 2}>{title}</Title>
          </Group>
          {/* <TextInput variant="underline"
            visibleFrom="md"
            variant="default"
            leftSection={<MagnifyingGlass size={14} weight="bold" />}
            placeholder="Tìm kiếm..."

            // placeholder="Tìm kiếm"
            // value={searchValueDraft}
            // onChange={(event) => setSearchValueDraft(event.currentTarget.value)}
          /> */}
          <Group justify="flex-end" gap="xs">
            {isTablet ? (
              <ActionIcon size="md" aria-label="Settings" onClick={createHandler}>
                <Plus size={14} weight="bold" />
              </ActionIcon>
            ) : (
              <Button
                size={isTablet ? 'xs' : 'sm'}
                variant="filled"
                justify="space-between"
                onClick={createHandler}
                radius="md"
              >
                Thêm mới
              </Button>
            )}
          </Group>
        </Group>
        {/* <TextInput variant="underline"
          mt="xs"
          variant="default"
          hiddenFrom="md"
          leftSection={<MagnifyingGlass size={14} weight="bold" />}
          size="xs"
          placeholder="Tìm kiếm..."

          // placeholder="Tìm kiếm"
          // value={searchValueDraft}
          // onChange={(event) => setSearchValueDraft(event.currentTarget.value)}
        /> */}
      </Box>
      <Card py="0" px="0" h="100%" mah="100%">
        {children}
      </Card>
      {page && onPageChange && lastPage && (
        <Box px={{ base: 'md', md: 'lg' }}>
          <Group justify="space-between" py="xs" visibleFrom="md">
            <Text size="sm" c="dimmed">
              Hiện{' '}
              <b>
                {(page - 1) * 30 + 1} - {page === lastPage ? total : page * 30}
              </b>{' '}
              trong tổng <b>{total}</b>
            </Text>
            <Pagination
              size="sm"
              disabled={isLoading}
              value={page}
              onChange={onPageChange}
              total={lastPage}
              withEdges
              radius="xl"
            />
          </Group>
          <Group justify="space-between" py={{ base: 'xs', md: 'sm' }} hiddenFrom="md">
            <Text c="dimmed" size="xs">
              <b>
                {(page - 1) * 30 + 1} - {page === lastPage ? total : page * 30}
              </b>{' '}
              / <b>{total}</b>
            </Text>
            <Pagination.Root
              total={lastPage}
              disabled={isLoading}
              size="xs"
              onChange={onPageChange}
              radius="xl"
            >
              <Group gap={7} justify="center">
                <Pagination.Previous />
                <Text size="xs">
                  {page} / {lastPage}
                </Text>
                <Pagination.Next />
              </Group>
            </Pagination.Root>
          </Group>
        </Box>
      )}
    </Stack>
  );
};
