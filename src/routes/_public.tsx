import { createFileRoute, Outlet } from "@tanstack/react-router";
import Header from "../Component/Public/Header";
import Footer from "../Component/Public/Footer";

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
