import { createFileRoute } from "@tanstack/react-router";

import MarketingManagement from "../Component/Public/Services/MarketingManagement";

export const Route = createFileRoute("/_public/services/marketing")({
  component: MarketingManagement,
});
