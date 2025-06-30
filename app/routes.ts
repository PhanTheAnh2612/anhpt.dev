import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("./modules/anhpt-dev/index.tsx"),
  ...prefix("great_front_end", [
    layout("./modules/great-front-end/index.tsx", [
      route("blog_card", "./modules/great-front-end/blog-card/index.tsx"),
    ]),
  ]),
  // Catch-all route for unmatched URLs (including DevTools requests)
  route("*", "./routes/catch-all.tsx"),
] satisfies RouteConfig;
