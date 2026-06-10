import { useState } from "react";

export default function useActionModal() {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [row, setRow] = useState(null);

  const handleAction = (type, data) => {
    setAction(type);
    setRow(data);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setAction("");
    setRow(null);
  };

  return {
    open,
    action,
    row,
    close,
    handleAction,
  };
}