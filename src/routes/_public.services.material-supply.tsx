import { createFileRoute } from "@tanstack/react-router";

import MaterialSuppler from "../Component/Public/Services/MaterialSuppler";

export const Route = createFileRoute("/_public/services/material-supply")({
  component: MaterialSuppler,
});
