import { createFileRoute } from "@tanstack/react-router";
import CompanyList from "../Component/Public/CompanyList";

export const Route = createFileRoute("/_public/company-list")({
  component: CompanyList,
  head: () => ({
    meta: [
      { title: "Company directory | ContractsIndia" },
      { name: "description", content: "Browse registered companies on ContractsIndia." },
    ],
  }),
});
