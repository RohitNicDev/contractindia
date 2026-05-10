import { createFileRoute } from "@tanstack/react-router";
import ConsultingService from "../Component/Public/Services/ConsultingService";

export const Route = createFileRoute("/_public/services/consulting")({
  component: ConsultingService,
  head: () => ({
    meta: [
      { title: "Consulting services | ContractsIndia" },
      { name: "description", content: "PMC, planning, and engineering consulting." },
    ],
  }),
});
