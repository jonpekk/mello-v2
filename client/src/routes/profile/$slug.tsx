import { createFileRoute, useLoaderData, notFound, Link } from "@tanstack/react-router";
import type { ProfileResponse } from "@/global/types/user";


async function getProfile(id: string): Promise<ProfileResponse> {
  const response = await fetch(`/api/v1/users/${id}`)
  if (!response.ok) {
    throw notFound()
  }

  const profile = await response.json()

  return profile
}

export const Route = createFileRoute("/profile/$slug")({
  component: ProfilePage,
  loader: ({ params }) => getProfile(params.slug),
})

function ProfilePage() {

  const { data, success } = useLoaderData({ from: '/profile/$slug' })

  if (!success) {
    return <div>There was an error Loading this profile</div>
  }


  return data && (
    <div>
      <h1>Profile</h1>
      <p>id: {data.id}</p>
      <p>Username: @{data.username}</p>
      {data.email && <p>Email: {data.email}</p>}
      {data.firstName && <p>First Name: {data.firstName}</p>}
      {data.userOwnsProfile && <Link to={`/profile/$profileId/edit`} params={{ profileId: data.id.toString() }}>Edit</Link>}
    </div>
  )
}