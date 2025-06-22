import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import EditProfileForm from '@/components/EditProfileForm/EditProfileForm';
import type { ProfileResponse } from '@/global/types/user';

export const Route = createFileRoute('/profile/$profileId/edit')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const response = await fetch(`/api/v1/users/${params.profileId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    const data: ProfileResponse = await response.json();

    if (!data.success) {
      throw new Error('Profile not found');
    }

    return data;
  },
});

// TODO:
// Add auth route validation (Maybe through tanstack!!)
// Sanitize all forms before moving forward to validation

function RouteComponent() {
  const { data, success } = useLoaderData({ from: '/profile/$profileId/edit' });

  // TODO: See about adding these checks to the loader when UI is built out
  if (!success) {
    return <div>There was an error loading this profile</div>;
  }

  if (!data?.userOwnsProfile) {
    return <div>You don't have permission to edit this profile</div>;
  }

  return data && <EditProfileForm profile={data} />;
}
