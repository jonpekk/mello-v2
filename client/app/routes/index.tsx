// app/routes/index.tsx
import * as fs from 'node:fs'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'


async function getCount() {
  const count = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/counter`)
  const json = await count.json()
  return json.count
}


export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => await getCount(),
})

function Home() {
  const router = useRouter()
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