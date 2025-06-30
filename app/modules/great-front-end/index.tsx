import { Outlet } from "react-router";
import type { Route } from "./+types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "anhpt.dev - GreatFrontEnd Projects" },
    { name: "description", content: "Welcome to anhpt.dev!" },
  ];
}

const GreatFrontendLayout = () => {
  return <Outlet />;
};

export default GreatFrontendLayout;
