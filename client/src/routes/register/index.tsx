import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/register/")({
  component: () => {
    return (
      <div>
        <h1>Register</h1>
      </div>
    );
  },
});