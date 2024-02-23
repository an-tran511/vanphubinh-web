import { Create } from '@/components/crud/create'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { TPackageAndLabel } from '@/types/package-and-label'
import { createPackageAndLabel } from '@/apis/package-and-label'
import { toast } from 'sonner'
import { PackageAndLabelForm } from './-components/package-and-label-form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { schema } from '@/schemas/package-and-label'

export const Route = createFileRoute('/packages-and-labels/create')({
  wrapInSuspense: true,
  component: CreateComponent,
})

export function CreateComponent() {
  const navigate = useNavigate({ from: '/packages-and-labels/create' })

  //Mutation
  const { isPending, mutate } = useMutation({
    mutationFn: createPackageAndLabel,
    onSuccess: (data: TPackageAndLabel) => {
      const itemId = data.id
      navigate({ to: '/packages-and-labels/$itemId', params: { itemId } })
      toast.success(`${data.name} đã được tạo thành công`)
    },
    onError: () => {
      toast.error('Tạo bao bì & nhãn mác thất bại')
    },
  })

  const { control, handleSubmit, clearErrors } = useForm<TPackageAndLabel>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      uomId: 0,
      firstItemCode: '',
      secondItemCode: '',
      note: '',
      specs: {
        dimension: '',
        spreadDimension: '',
        thickness: undefined,
        numberOfColors: undefined,
      },
      newMoulds: [],
    },
  })

  const onSubmit = (data: TPackageAndLabel) => {
    mutate(data)
  }
  return (
    <form
      onSubmit={(e) => {
        clearErrors()
        handleSubmit(onSubmit)(e)
      }}
    >
      <Create title="Bao bì & nhãn mác" savingState={isPending}>
        <PackageAndLabelForm control={control} viewType="create" />
      </Create>
    </form>
  )
}
