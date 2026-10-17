import { type RouteConfig, index, route } from "@react-router/dev/routes"
import { APP_PAGES_ROUTES } from "./shared/constants/pages"

export default [
  index("features/home/screens/home/index.tsx"),
  route(APP_PAGES_ROUTES.LOGIN, "features/auth/screens/login/index.tsx"),
  route(APP_PAGES_ROUTES.REGISTER, "features/auth/screens/register/index.tsx"),
  route(
    APP_PAGES_ROUTES.DASHBOARD,
    "features/dashboard/screens/dashboard/index.tsx",
  ),
] satisfies RouteConfig
