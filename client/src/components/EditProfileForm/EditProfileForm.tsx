import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from '@tanstack/react-router';
import { validateAlphaNumeric, validateEmail, validateRequiredField } from "@/helpers/form/validations";
import { useAppForm } from "@/hook/form";
import type { Profile } from '@/global/types/user';
import type { BaseServerResponse } from '@/global/types/response';

async function updateUserProfile({ userId, data }: { userId: string; data: Partial<Profile> }): Promise<BaseServerResponse> {
  try {
    const response = await fetch(`/api/v1/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return await response.json();
  } catch (error) {
    const err = error as BaseServerResponse;
    return err;
  }
}

interface EditProfileFormProps {
  profile: Profile;
}

export default function EditProfileForm({ profile }: EditProfileFormProps) {
  const navigate = useNavigate();
  const { profileId } = useParams({ from: '/profile/$profileId/edit' });

  const updateProfile = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      if (data.error) {
        // TODO: Show error message (when I build UI out)
        console.error('Update failed:', data.error);
        return;
      }

      navigate({ to: `/profile/${profileId}` });
    },
  });

  const form = useAppForm({
    defaultValues: {
      email: profile?.email || "",
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      username: profile?.username || "",
    },
    onSubmit: async ({ value }) => {
      await updateProfile.mutateAsync({
        userId: profileId,
        data: value,
      });
    },
  });

  // TODO: Add Loaders when UI is built out
  return (
    <div>
      <h1>Edit Profile</h1>
      <form
        onSubmit={e => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.AppField
          name="email"
          children={(field) => (
            <div>
              <field.TextInput
                label="Email"
              />
            </div>
          )}
          validators={{
            onSubmit: ({ value }) => validateEmail(value),
          }}
        />
        <form.AppField
          name="username"
          children={(field) => (
            <div>
              <field.TextInput
                label="Username"
              />
            </div>
          )}
          validators={{
            onSubmit: ({ value }) => {
              if (validateRequiredField("Username", value)) {
                return validateRequiredField("Username", value);
              }
              if (validateAlphaNumeric(value)) {
                return validateAlphaNumeric(value);
              }
            },
          }}
        />
        <div>
          <form.AppField
            name="firstName"
            children={(field) => (
              <div>
                <field.TextInput
                  label="First Name"
                />
              </div>
            )}
          />
          <form.AppField
            name="lastName"
            children={(field) => (
              <div>
                <field.TextInput
                  label="Last Name"
                />
              </div>
            )}
          />
        </div>
        <div>
          <button
            type="button"
            onClick={() => navigate({ to: `/profile/${profileId}` })}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
