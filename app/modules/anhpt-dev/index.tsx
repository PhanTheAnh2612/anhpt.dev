import type { Route } from "./+types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "anhpt.dev - Frontend dễ lắm" },
    { name: "description", content: "Welcome to anhpt.dev!" },
  ];
}

const AnhPtLayout = () => {
  return (
    <div>
      This is the layout for anhpt.dev. Please contact me via
      phantheanh2612@gmail.com
    </div>
  );
};

export default AnhPtLayout;
