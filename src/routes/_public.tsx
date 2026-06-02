import { Outlet } from "react-router-dom";
import Header from "../Component/Public/Header";
import Footer from "../Component/Public/Footer";
import ScrollToTop from "../utilitis/ScrollToTop";

export default function PublicLayout() {
  return (
    <>
      <Header />
      <ScrollToTop/>
      <Outlet />
      <Footer />
    </>
  );
}
