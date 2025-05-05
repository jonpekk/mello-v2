// app/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'


async function getCount() {
  const count = await fetch(`/api/v1/counter`)
  const json = await count.json()
  return json.count
}


export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => await getCount(),
})

function Home() {
  const state = Route.useLoaderData()

  return (
    <>
      <p>Count from server {state}</p>
      <p>Need to</p>
      <ul>
        <li>Finish following the docs so that I am able to login using the express server's auth setup</li>
      </ul>
    </>
  )
}