import ThemeProvider from "../../theme/ThemeProvider";
import { Categories, ValueStrip } from "./category";
import { Companies } from "./Companies";
import Footer from "./Footer";
import Header from "./Header";
import HeroSection from "./HeroSection";
import HomePageLogocarasole from "./HomePageLogocarasole";
import { Materials } from "./Material";
import { HowItWorks, Testimonials } from "./Section";
import { Tenders } from "./Tenders";
import Test from "./Test";

const HomePage = () => {
  return (
    <ThemeProvider>
      {/* <RouterProvider router={AppRoutes} /> */}
      <Header />
      <HeroSection />
      <ValueStrip />
      <Categories />
      {/* <Tenders /> */}
      <Companies />
      <Materials />
      <HowItWorks />
      <HomePageLogocarasole/>
      <Testimonials />
      <Test />
      <Footer />
    </ThemeProvider>
  );
};

export default HomePage;
