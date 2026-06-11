import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      richColors
      closeButton
      position="top-center"
      toastOptions={{
        classNames: {
          toast: "auth-glass-card border-[var(--glass-border)]! shadow-[var(--shadow-glass)]!",
        },
      }}
    />
  );
}
