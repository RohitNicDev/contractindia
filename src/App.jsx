import HomePage from "./Component/Public/HomePage";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import RegisterCompany from "./Component/Public/RegisterCompany";
import CompanyList from "./Component/Public/CompanyList";
import ContactUs from "./Component/Public/ContactUs";
import Header from "./Component/Public/Header";
import Footer from "./Component/Public/Footer";
import AboutUs from "./Component/Public/AboutUs";
import Projects from "./Component/Public/Projects";
import ConsultingService from "./Component/Public/Services/ConsultingService";
import ContractorService from "./Component/Public/Services/ContractorService";
import LoginPage from "./Component/Auth/LoginPage";
import RegistrationPage from "./Component/Auth/RegistrationPage";




function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

const App = () => {
  return (
     <BrowserRouter>
      <Routes>

        
        <Route path="/register" element={<RegisterCompany />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registration" element={<RegistrationPage />} />

        
        <Route element={<Layout />}>
         
          <Route path="/company-list" element={<CompanyList />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/services/consulting" element={<ConsultingService />} />
          <Route path="/services/contractor" element={<ContractorService />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
export default App;
