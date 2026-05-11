import { Outlet } from "react-router-dom";
import Header from "../Component/Public/Header";
import Footer from "../Component/Public/Footer";

export default function PublicLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
