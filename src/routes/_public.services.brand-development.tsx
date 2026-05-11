import { createFileRoute } from "@tanstack/react-router";

import BrandDevelopment from "../Component/Public/Services/BrandDevelopment";

export const Route = createFileRoute("/_public/services/brand-development")({
  component: BrandDevelopment,
});
