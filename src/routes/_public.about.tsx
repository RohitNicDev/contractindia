import { createFileRoute } from "@tanstack/react-router";
import AboutUs from "../Component/Public/AboutUs";

export const Route = createFileRoute("/_public/about")({
  component: AboutUs,
  head: () => ({
    meta: [
      { title: "About us | ContractsIndia" },
      { name: "description", content: "Learn about ContractsIndia." },
    ],
  }),
});
