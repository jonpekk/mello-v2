import LoginForm from '@/components/LoginForm/LoginForm'
import { createFileRoute } from '@tanstack/react-router'
import { redirect } from '@tanstack/react-router'
import { checkAuthOnClient } from '@/helpers/auth'

export const Route = createFileRoute('/login/')({
  beforeLoad: async () => {
    const { isLoggedIn, id } = await checkAuthOnClient();
    if (isLoggedIn) {
      throw redirect({
        to: '/profile/$slug',
        params: {
          slug: id
        }
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <LoginForm />
    </div>
  )
}
