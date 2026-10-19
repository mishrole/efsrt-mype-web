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
  route(
    APP_PAGES_ROUTES.PRODUCT_CATEGORY_CREATE,
    "features/product-categories/screens/product-category-create/index.tsx",
  ),
  route(
    APP_PAGES_ROUTES.PRODUCT_CATEGORY_DETAIL,
    "features/product-categories/screens/product-category-detail/index.tsx",
  ),
  route(
    APP_PAGES_ROUTES.PRODUCT_CATEGORIES,
    "features/product-categories/screens/product-category-list/index.tsx",
  ),
  route(
    APP_PAGES_ROUTES.PRODUCT_CREATE,
    "features/products/screens/product-create/index.tsx",
  ),
  route(
    APP_PAGES_ROUTES.PRODUCTS,
    "features/products/screens/product-list/index.tsx",
  ),
] satisfies RouteConfig
