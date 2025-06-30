import { useMutation } from "@tanstack/react-query";
import { validateAlphaNumeric, validateEmail, validateRequiredField } from "@/helpers/form/validations";
import { useAppForm } from "@/hook/form";
import type { CreateUserResponse, RegisterInputs } from '@/components/RegistrationForm/types';

async function registerUser(value: RegisterInputs): Promise<CreateUserResponse> {
  try {
    const response = await fetch("/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value),
    })

    if (response.status === 201) {
      const resBody = await response.json()
      return resBody
    }

    const resError = await response.json()

    throw (resError)
  } catch (error) {
    const err = error as CreateUserResponse
    return err
  }
}

export default function RegistrationForm() {
  const createUser = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      if (data.error) {
        console.warn(data.error)
      }

      return data
    },
  })
  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      username: ""
    },
    onSubmit: async ({ value }) => {
      createUser.mutateAsync(value)
    }
  })

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <div>
          <h1>Register</h1>
          <form.AppField
            name="email"
            children={(field) => <field.TextInput label="Email" />}
            validators={{
              onSubmit: ({ value }) => validateEmail(value),
            }}
          />
          <form.AppField
            name="password"
            children={(field) => <field.TextInput label="Password" />}
            validators={{
              onSubmit: ({ value }) => validateRequiredField("Password", value)
            }}
          />
          <form.AppField
            name="username"
            children={(field) => <field.TextInput label="Username" />}
            validators={{
              onSubmit: ({ value }) => {
                if (validateRequiredField("Username", value)) {
                  return validateRequiredField("Username", value)
                }
                if (validateAlphaNumeric(value)) {
                  return validateAlphaNumeric(value)
                }
              }
            }}
          />
          <form.AppField
            name="firstName"
            children={(field) => <field.TextInput label="First Name" />}
          />
          <form.AppField
            name="lastName"
            children={(field) => <field.TextInput label="Last Name" />}
          />
          <form.AppForm>
            <form.SubmitButton label="Register" />
          </form.AppForm>
        </div>
      </form>
      {createUser.isSuccess && (
        <p>User created Successfully</p>
      )}
    </div>
  );

}