import { createFileRoute } from "@tanstack/react-router";

import MaterialManufacture from "../Component/Public/Services/MaterialManufacture";

export const Route = createFileRoute(
  "/_public/services/material-manufacturing",
)({
  component: MaterialManufacture,
});
 