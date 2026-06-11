import { Input as AntInput } from "antd";
import { motion } from "framer-motion";
/* -------------------------------------------------------------------------- */
/* CUSTOM INPUT */
/* -------------------------------------------------------------------------- */

export const CustomInput=({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) =>{
  return (
    <div className="space-y-2">
      {/* LABEL */}
      <label
        className="
          block text-[11px]
          font-bold uppercase
          tracking-wide text-slate-500
        "
      >
        {label}
      </label>

      {/* INPUT */}
      <AntInput
        type={type}
        value={value}
        size="small"
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
        style={{
          marginBottom:"5px"
        }}
        className="
          h-[40px] rounded-2xl
          border-slate-200
          bg-white/80 px-4
          text-sm font-medium
          mb-[5px]
          shadow-sm transition-all
          hover:border-violet-300
          focus:border-violet-500
        "
      />
    </div>
  );
}