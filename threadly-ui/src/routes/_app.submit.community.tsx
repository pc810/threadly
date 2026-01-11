import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/submit/community')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/submit/community"!</div>
}
