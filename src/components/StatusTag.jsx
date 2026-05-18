import { Tag } from "antd";

export const StatusTag = ({ status }) => {
  const config = {
    Success: "success",
    Active: "success",
    Failed: "error",
    Expired: "default",
    Inactive: "default",
  };

  return (
    <Tag
      color={config[status]}
      className="
        rounded-full px-3 py-[4px]
        text-[11px] font-bold
      "
    >
      {status}
    </Tag>
  );
}
