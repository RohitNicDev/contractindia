import ThemeProvider from "../../theme/ThemeProvider";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Categories, ValueStrip } from "./category";
import { Companies } from "./Companies";
import HeroSection from "./HeroSection";
import HomePageLogocarasole from "./HomePageLogocarasole";
import { HowItWorks, Testimonials } from "./Section";
import Test from "./Test";

// Staggered reveal — each section fades up as it enters the viewport
const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

const HomePage = () => {
  return (
    <ThemeProvider>
      {/* Smooth scroll for the whole page */}
      <div style={{ scrollBehavior: "smooth" }}>

        {/* Hero — no reveal wrapper, it animates internally */}
        <HeroSection />

        {/* Value strip — overlaps hero bottom */}
        <motion.div {...reveal(0)}>
          <ValueStrip />
        </motion.div>

        {/* Service categories */}
        <motion.div {...reveal(0)}>
          <Categories />
        </motion.div>

        {/* Featured companies */}
        <motion.div {...reveal(0)}>
          <Companies />
        </motion.div>

        {/* Partner logo carousel */}
        <motion.div {...reveal(0)}>
          <HomePageLogocarasole />
        </motion.div>

        {/* How it works */}
        <motion.div {...reveal(0)}>
          <HowItWorks />
        </motion.div>

        {/* Testimonials */}
        <motion.div {...reveal(0)}>
          <Testimonials />
        </motion.div>

        {/* CTA banner */}
        <motion.div {...reveal(0)}>
          <Test />
        </motion.div>

      </div>
    </ThemeProvider>
  );
};

export default HomePage;
