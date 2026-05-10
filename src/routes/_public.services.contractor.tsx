import { createFileRoute } from "@tanstack/react-router";
import ContractorService from "../Component/Public/Services/ContractorService";

export const Route = createFileRoute("/_public/services/contractor")({
  component: ContractorService,
  head: () => ({
    meta: [
      { title: "Contractor services | ContractsIndia" },
      { name: "description", content: "Verified EPC, civil, and contractor networks." },
    ],
  }),
});
