import { createFileRoute, useLoaderData, notFound } from "@tanstack/react-router";
import type { BaseServerResponse } from "@/global/types/response";
import type { Profile } from "@/global/types/user";

interface ProfileResponse extends BaseServerResponse {
  profile: Profile,

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

  const { profile } = useLoaderData({ from: '/profile/$slug' })


  return (
    <div>
      <h1>Profile</h1>
      <p>{profile.id}</p>
      {profile?.email && <p>{profile.email}</p>}
    </div>
  )
}