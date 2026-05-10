import { createFileRoute } from "@tanstack/react-router";
import ContactUs from "../Component/Public/ContactUs";

export const Route = createFileRoute("/_public/contact")({
  component: ContactUs,
  head: () => ({
    meta: [
      { title: "Contact us | ContractsIndia" },
      { name: "description", content: "Get in touch with ContractsIndia." },
    ],
  }),
});
