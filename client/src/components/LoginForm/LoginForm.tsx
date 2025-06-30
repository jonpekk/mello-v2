import { useMutation } from "@tanstack/react-query"
import { validateRequiredField } from "@/helpers/form/validations"
import { useAppForm } from "@/hook/form"
import type { UserLogin, LoginResponse } from "@/global/types/user"

async function login(value: UserLogin): Promise<LoginResponse> {
  try {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value)
    })

    if (!response.ok) {
      throw (await response.json())
    }

    return await response.json()

  } catch (err: unknown) {
    const error = err as LoginResponse
    return error
  }
}

export default function LoginForm() {
  const loginMutation = useMutation({
    mutationFn: login
  })
  const form = useAppForm({
    defaultValues: {
      email: "",
      password: ""
    },
    onSubmit: async ({ value }) => {
      loginMutation.mutateAsync(value)
    }
  })

  return (
    <div>
      <h1>Login</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.AppField
          name="email"
          children={(field) => <field.TextInput label="Email" />}
          validators={{
            onSubmit: ({ value }) => validateRequiredField('Email', value)
          }}
        />
        <form.AppField
          name="password"
          children={(field) => <field.TextInput label="Password" />}
          validators={{
            onSubmit: ({ value }) => validateRequiredField('Password', value)
          }}
        />
        <form.AppForm>
          <form.SubmitButton label="Login" />
        </form.AppForm>
      </form>
      {loginMutation.data?.success && (
        <p>Logged in successfully</p>
      )}

      {!loginMutation.data?.success && (
        <p>{loginMutation.data?.data?.message}</p>
      )}
    </div>
  )
}