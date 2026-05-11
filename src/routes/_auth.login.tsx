import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "../components/auth/LoginForm";

export const Route = createFileRoute("/_auth/login")({
  component: LoginForm,
  head: () => ({
    meta: [
      { title: "Sign in | ContractsIndia" },
      // {
      //   name: "description",
      //   content: "Sign in to ContractsIndia to manage tenders, partners, and procurement.",
      // },
      { property: "og:title", content: "Sign in | ContractsIndia" },
      { property: "og:description", content: "Access your ContractsIndia workspace." },
      { property: "og:type", content: "website" },
    ],
  }),
});
