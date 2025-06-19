import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profile/$profileId/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/profile/$slug/edit"!</div>
}
