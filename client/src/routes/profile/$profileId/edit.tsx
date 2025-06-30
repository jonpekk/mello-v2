import { redirect } from '@tanstack/react-router';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import EditProfileForm from '@/components/EditProfileForm/EditProfileForm';
import { checkAuthOnClient } from '@/helpers/auth';
import type { ProfileResponse } from '@/global/types/user';

export const Route = createFileRoute('/profile/$profileId/edit')({
  component: RouteComponent,
  beforeLoad: async () => {
    const { isLoggedIn } = await checkAuthOnClient();
    if (!isLoggedIn) {
      throw redirect({
        to: '/login',
        search: {
          // TODO: Use this redirect to redirect back to this page after login
          // You can also just redirect back to the profile, but this can be edited later
          redirect: location.href,
        },
      })
    }
  },
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
