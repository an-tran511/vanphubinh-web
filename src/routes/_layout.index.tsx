import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/')({
  component: Index,
})

function Index() {
  return (
    <blockquote className="text-2xl font-semibold italic text-center text-slate-900">
      When you look
      <span className="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-pink-500 relative inline-block">
        <span className="relative text-white">annoyed</span>
      </span>
      all the time, people think that you're busy.
    </blockquote>
  )
}
