import { 
  defineMiddlewares,
  validateAndTransformBody,
} from "@medusajs/framework/http"
import { PostAdminCreateBrand } from "./admin/brands/validators"
import { z } from "zod"
import { 
  validateAndTransformQuery,
} from "@medusajs/framework/http"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"
// other imports...

export const GetBrandsSchema = createFindParams()
export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/brands",
      method: "POST",
      middlewares: [
        validateAndTransformBody(PostAdminCreateBrand),
      ],
    },
    {
      matcher: "/admin/products",
      method: ["POST"],
      additionalDataValidator: {
        brand_id: z.string().optional()
      },
   },
   {
      matcher: "/admin/brands",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(
          GetBrandsSchema,
          {
            defaults: [
              "id",
              "name",
              "products.*",
            ],
            isList: true,
          }
        ),
      ],
    },

   ]
})