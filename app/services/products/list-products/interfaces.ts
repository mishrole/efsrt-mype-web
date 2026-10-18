export interface ListProductsRequest {
  businessId: string
  search?: string
  categoryId?: string
  isActive?: boolean
  availableForSale?: boolean
}

export interface ProductListItemResponse {
  id: string
  businessId: string
  categoryId: string
  categoryName: string
  name: string
  salePrice: number
  unitCost: number
  isActive: boolean
}
