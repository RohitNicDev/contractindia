import ThemeProvider from "../../theme/ThemeProvider";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Categories, ValueStrip } from "./category";
import { Companies } from "./Companies";
import HeroSection from "./HeroSection";
import HomePageLogocarasole from "./HomePageLogocarasole";
import { HowItWorks, Testimonials } from "./Section";
import Test from "./Test";

const sectionMotion = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: "easeOut" },
};

function AuthCtaStrip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="border-b border-[var(--auth-input-border)]"
      style={{ background: "var(--glass-bg)" }}
    >
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-center gap-3 px-4 py-3 sm:flex-row sm:justify-between sm:px-6">
        <p className="text-center text-sm font-semibold text-[var(--auth-text-primary)] sm:text-left">
          Secure sign-in, registration, and OTP — built for teams across India.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Link
            to="/login"
            className="rounded-xl border border-[var(--auth-input-border)] bg-[var(--auth-input-bg)] px-4 py-2 text-sm font-bold text-[var(--auth-text-primary)] no-underline transition hover:shadow-[var(--shadow-glass)]"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="rounded-xl px-4 py-2 text-sm font-bold text-[var(--auth-chip-active-fg)] no-underline transition hover:opacity-95"
            style={{ background: "var(--gradient-primary)" }}
          >
            Create account
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

const HomePage = () => {
  return (
    <ThemeProvider>
      {/* <AuthCtaStrip /> */}
      <HeroSection />
      <motion.div {...sectionMotion}>
        <ValueStrip />
      </motion.div>
      <motion.div {...sectionMotion}>
        <Categories />
      </motion.div>
      <motion.div {...sectionMotion}>
        <Companies />
      </motion.div>
      <motion.div {...sectionMotion}>
        <HomePageLogocarasole />
      </motion.div>
      <motion.div {...sectionMotion}>
        <HowItWorks />
      </motion.div>
      <motion.div {...sectionMotion}>
        <Testimonials />
      </motion.div>
      <motion.div {...sectionMotion}>
        <Test />
      </motion.div>
    </ThemeProvider>
  );
};

export default HomePage;
