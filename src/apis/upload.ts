import { client } from '@/utils/client'
import { FileWithPath } from '@mantine/dropzone'
export const uploads = async (files: FileWithPath[] | null) => {
  if (files == null) {
    return
  }
  const formData = new FormData()
  formData.append('file', files[0])
  const response = await client.postForm('/files', formData)
  return response
}
