import { createFileRoute } from "@tanstack/react-router";
import RegistrationForm from "@/components/RegistrationForm/RegistrationForm";

export const Route = createFileRoute("/register/")({
  component: RegisterPage,
});

export default function RegisterPage() {
  return (
    <div>
      <RegistrationForm />
    </div>
  )
}

