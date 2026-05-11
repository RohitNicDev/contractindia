import { createFileRoute } from "@tanstack/react-router";

import LegalContracts from "../Component/Public/Services/LegalContracts";

export const Route = createFileRoute("/_public/services/legal-contracts")({
  component: LegalContracts,
});
