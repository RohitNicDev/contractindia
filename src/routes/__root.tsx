import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import { AppToaster } from "../components/ui/sonner";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <>
      <HeadContent />
      <Outlet />
      <AppToaster />
    </>
  );
}
