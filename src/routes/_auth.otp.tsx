import { createFileRoute } from "@tanstack/react-router";
import { OtpVerification } from "../components/auth/OtpVerification";

export const Route = createFileRoute("/_auth/otp")({
  component: OtpVerification,
  head: () => ({
    meta: [
      { title: "Verify OTP | ContractsIndia" },
      { name: "description", content: "Enter your one-time password to complete sign-in." },
      { property: "og:title", content: "OTP verification | ContractsIndia" },
      { property: "og:description", content: "Secure verification for your account." },
      { property: "og:type", content: "website" },
    ],
  }),
});
