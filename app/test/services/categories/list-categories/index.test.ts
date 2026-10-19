import { describe, expect, it, vi } from "vitest"
import { CategoryType } from "~/services/categories/interfaces"
import { listCategories } from "~/services/categories/list-categories"
import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"

vi.mock("~/shared/http/client", () => ({
  request: vi.fn(),
}))

const requestMock = vi.mocked(request)

describe("listCategories service", () => {
  it("gets filtered categories and forwards the abort signal", async () => {
    const controller = new AbortController()
    const response = [
      {
        id: "category-id",
        businessId: "business-id",
        name: "Productos",
        type: CategoryType.Sale,
        isDefault: true,
        isActive: true,
      },
    ]

    requestMock.mockResolvedValue(response)

    await expect(
      listCategories(
        {
          businessId: "business-id",
          type: CategoryType.Sale,
          isActive: true,
        },
        "access-token",
        controller.signal,
      ),
    ).resolves.toEqual(response)

    expect(requestMock).toHaveBeenCalledWith(
      `${API_ROUTES.CATEGORIES("business-id")}?type=1&isActive=true`,
      {
        method: "GET",
        accessToken: "access-token",
        signal: controller.signal,
      },
    )
  })
})
