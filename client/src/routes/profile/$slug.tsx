import { createFileRoute, useLoaderData, notFound, Link } from "@tanstack/react-router";
import type { BaseServerResponse } from "@/global/types/response";
import type { Profile } from "@/global/types/user";

interface ProfileResponse extends BaseServerResponse {
  profile: Profile,
  userOwnsProfile: boolean
}


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

  const { profile, userOwnsProfile } = useLoaderData({ from: '/profile/$slug' })


  return (
    <div>
      <h1>Profile</h1>
      <p>id: {profile.id}</p>
      <p>Username: @{profile.username}</p>
      {profile?.email && <p>Email: {profile.email}</p>}
      {profile?.firstName && <p>First Name: {profile.firstName}</p>}
      {userOwnsProfile && <Link to={`/profile/$profileId/edit`} params={{ profileId: profile.id.toString() }}>Edit</Link>}
    </div>
  )
}