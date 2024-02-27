import { createPartner } from '@/apis/partner'
import { Partner } from '@/types/partner'
import { Button, Checkbox, Group, Stack, TextInput } from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  Controller,
  FieldValues,
  UseFormStateReturn,
  useForm,
} from 'react-hook-form'

interface PartnerCreateProps {
  closeModalCallback: () => void
}
export function PartnerCreate(props: PartnerCreateProps) {
  const { closeModalCallback } = props
  const queryClient = useQueryClient()

  const { control, handleSubmit, clearErrors } = useForm<Partner>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      isCustomer: true,
      isSupplier: false,
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: createPartner,
    onSuccess: (data: Partner) => {
      queryClient.invalidateQueries({ queryKey: ['partners'] })
      toast.success(`${data.name} đã được tạo thành công`)
      closeModalCallback()
    },
  })
  const onSubmit = (data: Partner) => {
    mutate(data)
  }
  return (
    <form
      onSubmit={(e) => {
        clearErrors()
        handleSubmit(onSubmit)(e)
      }}
    >
      <Stack>
        <Controller
          key="name"
          name="name"
          control={control}
          render={({
            field,
            formState: { errors },
          }: {
            field: FieldValues
            formState: UseFormStateReturn<Partner>
          }) => (
            <TextInput
              {...field}
              error={errors?.name?.message}
              label="Tên"
              radius="md"
            />
          )}
        />

        <Group gap="xl">
          <Controller
            key="isCustomer"
            name="isCustomer"
            control={control}
            render={({
              field,
              formState: { errors },
            }: {
              field: FieldValues
              formState: UseFormStateReturn<Partner>
            }) => (
              <Checkbox
                {...field}
                label="Khách hàng"
                error={errors?.isCustomer?.message}
              />
            )}
          />
          <Controller
            key="isSupplier"
            name="isSupplier"
            control={control}
            render={({
              field,
              formState: { errors },
            }: {
              field: FieldValues
              formState: UseFormStateReturn<Partner>
            }) => (
              <Checkbox
                {...field}
                label="Nhà cung cấp"
                error={errors?.isSupplier?.message}
              />
            )}
          />
        </Group>
        <Controller
          key="email"
          name="email"
          control={control}
          render={({
            field,
            formState: { errors },
          }: {
            field: FieldValues
            formState: UseFormStateReturn<Partner>
          }) => (
            <TextInput
              {...field}
              error={errors?.email?.message}
              label="Email"
              radius="md"
            />
          )}
        />
        <Controller
          key="phone"
          name="phone"
          control={control}
          render={({
            field,
            formState: { errors },
          }: {
            field: FieldValues
            formState: UseFormStateReturn<Partner>
          }) => (
            <TextInput
              {...field}
              error={errors?.phone?.message}
              label="Số điện thoại"
              radius="md"
            />
          )}
        />
        <Controller
          key="address"
          name="address"
          control={control}
          render={({
            field,
            formState: { errors },
          }: {
            field: FieldValues
            formState: UseFormStateReturn<Partner>
          }) => (
            <TextInput
              {...field}
              error={errors?.address?.message}
              label="Địa chỉ"
              radius="md"
            />
          )}
        />

        <Button radius="md" type="submit" loading={isPending}>
          Tạo
        </Button>
      </Stack>
    </form>
  )
}
