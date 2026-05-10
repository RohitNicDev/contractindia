import { createFileRoute } from "@tanstack/react-router";
import Projects from "../Component/Public/Projects";

export const Route = createFileRoute("/_public/projects")({
  component: Projects,
  head: () => ({
    meta: [
      { title: "Projects | ContractsIndia" },
      { name: "description", content: "Explore infrastructure and construction projects." },
    ],
  }),
});
