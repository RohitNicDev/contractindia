import { createFileRoute } from "@tanstack/react-router";

import TenderServices from "../Component/Public/Services/TenderServices";

export const Route = createFileRoute("/_public/services/tender")({
  component: TenderServices,
});
