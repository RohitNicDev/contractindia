import { createFileRoute } from "@tanstack/react-router";

import AssetsManagement from "../Component/Public/Services/AssetsManagement";

export const Route = createFileRoute("/_public/services/assets-management")({
  component: AssetsManagement,
});
 
function RouteComponent() {
  return <div>Hello "/_public/services/assets-management"!</div>
}
