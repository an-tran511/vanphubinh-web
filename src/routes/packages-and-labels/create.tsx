import { Create } from '@/components/crud/create'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { PackageAndLabel } from '@/types/package-and-label'
import { createPackageAndLabel } from '@/apis/package-and-label'
import { toast } from 'sonner'
import { PackageAndLabelForm } from './-components/package-and-label-form'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { schema } from '@/schemas/package-and-label'
import { modals } from '@mantine/modals'
import { Text } from '@mantine/core'

export const Route = createFileRoute('/packages-and-labels/create')({
  wrapInSuspense: true,
  component: CreateComponent,
})

export function CreateComponent() {
  const navigate = useNavigate({ from: '/packages-and-labels/create' })

  //Mutation
  const { isPending, mutate } = useMutation({
    mutationFn: createPackageAndLabel,
    onSuccess: (data: PackageAndLabel) => {
      const itemId = data.id
      navigate({ to: '/packages-and-labels/$itemId', params: { itemId } })
      toast.success(`${data.name} đã được tạo thành công`)
    },
    onError: () => {
      toast.error('Tạo bao bì & nhãn mác thất bại')
    },
  })

  const methods = useForm<PackageAndLabel>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      uomId: 0,
      firstItemCode: '',
      secondItemCode: '',
      note: '',
      images: [],
      specs: {
        dimension: '',
        spreadDimension: '',
        thickness: undefined,
        numberOfColors: undefined,
      },
      newMoulds: [],
    },
  })

  const onSubmit = (data: PackageAndLabel) => {
    const partnerId = methods.getValues('partnerId')
    if (partnerId) {
      mutate(data)
    } else {
      modals.openConfirmModal({
        title: 'Bạn chưa chọn khách hàng',
        centered: true,
        children: (
          <Text size="sm">
            Mã sản phẩm được tạo dựa trên mã khách hàng. Hãy xác nhận bạn không
            muốn chọn khách hàng.
          </Text>
        ),
        labels: { confirm: 'Xác nhận', cancel: 'Huỷ' },
        onCancel: () => console.log('Cancel'),
        onConfirm: () => mutate(data),
      })
    }
  }
  return (
    <form
      onSubmit={(e) => {
        methods.clearErrors()
        methods.handleSubmit(onSubmit)(e)
      }}
    >
      <Create title="Bao bì & nhãn mác" savingState={isPending}>
        <FormProvider {...methods}>
          <PackageAndLabelForm control={methods.control} viewType="create" />
        </FormProvider>
      </Create>
    </form>
  )
}
