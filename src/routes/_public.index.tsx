import { createFileRoute } from "@tanstack/react-router";
import HomePage from "../Component/Public/HomePage";

export const Route = createFileRoute("/_public/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "ContractsIndia — Construction & Infrastructure Marketplace" },
      {
        name: "description",
        content:
          "India's integrated B2B platform for tenders, verified contractors, consulting, and procurement.",
      },
      { property: "og:title", content: "ContractsIndia" },
      {
        property: "og:description",
        content: "Tenders, contractors, and procurement in one marketplace.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
});
