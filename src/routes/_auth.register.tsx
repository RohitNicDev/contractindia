import { createFileRoute } from "@tanstack/react-router";
import { RegisterForm } from "../components/auth/RegisterForm";

export const Route = createFileRoute("/_auth/register")({
  component: RegisterForm,
  head: () => ({
    meta: [
      { title: "Create account | ContractsIndia" },
      {
        name: "description",
        content: "Register your business on ContractsIndia — contractors, suppliers, and consultants.",
      },
      { property: "og:title", content: "Register | ContractsIndia" },
      {
        property: "og:description",
        content: "Join India’s construction and infrastructure marketplace.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
});
