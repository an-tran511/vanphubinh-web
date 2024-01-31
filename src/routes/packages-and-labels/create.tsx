import { Form, FormInstance } from 'houseform'
import { Create } from '@/components/crud/create'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import {
  TPackageAndLabel,
  TPackageAndLabelMutation,
} from 'types/package-and-label'
import { createPackageAndLabel } from '@/apis/package-and-label'
import { toast } from 'sonner'
import { PackageAndLabelForm } from './-components/package-and-label-form'

export const Route = createFileRoute('/packages-and-labels/create')({
  wrapInSuspense: true,
  component: CreateComponent,
})

export function CreateComponent() {
  const formRef = useRef<FormInstance<TPackageAndLabelMutation>>(null)
  const queryClient = useQueryClient()
  const navigate = useNavigate({ from: '/packages-and-labels/create' })

  //Mutation
  const mutation = useMutation({
    mutationFn: (values: TPackageAndLabelMutation) =>
      createPackageAndLabel(values),
    onSuccess: (data: TPackageAndLabel) => {
      const itemId = data.id
      queryClient.invalidateQueries({ queryKey: ['packages-and-labels'] })
      navigate({ to: '/packages-and-labels/$itemId', params: { itemId } })

      toast.success(`${data.name} đã được tạo thành công`)
    },
  })

  const doSubmit = () => {
    formRef?.current?.submit()
  }

  return (
    <Form
      onSubmit={(values: TPackageAndLabelMutation) => mutation.mutate(values)}
      ref={formRef}
    >
      {() => (
        <Create
          title="Bao bì & nhãn mác"
          submitHandler={doSubmit}
          savingState={mutation.isPending}
        >
          <PackageAndLabelForm />
        </Create>
      )}
    </Form>
  )
}
