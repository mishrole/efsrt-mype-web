import type { CreateBusinessResponse } from "../../../../../../services/businesses/create-business/interfaces"
export interface FirstBusinessOnboardingProps {
  accessToken: string
  onCreated: (business: CreateBusinessResponse) => Promise<void>
}
