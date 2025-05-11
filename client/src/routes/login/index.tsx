import LoginForm from '@/components/LoginForm/LoginForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <LoginForm />
    </div>
  )
}
