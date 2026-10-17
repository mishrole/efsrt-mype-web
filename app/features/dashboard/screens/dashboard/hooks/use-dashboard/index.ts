import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useAuthSessionStore } from "~/features/auth/stores/session"
import { useBusinessContextStore } from "~/features/business/stores/business-context"
import { logout } from "~/services/auth/logout"
import { getBusinessContext } from "~/services/businesses/get-business-context"
import { listUserBusinesses } from "~/services/businesses/list-user-businesses"
import { getFinancialDashboard } from "~/services/financial-dashboard/get-financial-dashboard"
import { FinancialDashboardGranularity } from "~/services/financial-dashboard/get-financial-dashboard/interfaces"
import { APP_PATHS } from "~/shared/constants/pages"
import { useAbortableRequest } from "~/shared/hooks/use-abortable-request"
import { isApiError } from "~/shared/http/errors"
import type { DashboardFilters, UseDashboardResult } from "./interfaces"

const INITIAL_FILTERS: DashboardFilters = {
  dateFrom: "",
  dateTo: "",
  granularity: FinancialDashboardGranularity.Auto,
}

export function useDashboard(): UseDashboardResult {
  const navigate = useNavigate()

  const accessToken = useAuthSessionStore((state) => state.accessToken)
  const clearSession = useAuthSessionStore((state) => state.clearSession)

  const businesses = useBusinessContextStore((state) => state.businesses)
  const currentBusinessId = useBusinessContextStore(
    (state) => state.currentBusinessId,
  )
  const setBusinesses = useBusinessContextStore((state) => state.setBusinesses)
  const selectBusiness = useBusinessContextStore(
    (state) => state.selectBusiness,
  )
  const setContext = useBusinessContextStore((state) => state.setContext)
  const clearBusinessContext = useBusinessContextStore(
    (state) => state.clearBusinessContext,
  )

  const {
    createSignal: createBusinessesSignal,
    abort: cancelBusinessesRequest,
  } = useAbortableRequest()
  const { createSignal: createDashboardSignal, abort: cancelDashboardRequest } =
    useAbortableRequest()

  const [dashboard, setDashboard] =
    useState<UseDashboardResult["dashboard"]>(null)
  const [filters, setFilters] = useState<DashboardFilters>(INITIAL_FILTERS)
  const [businessesLoaded, setBusinessesLoaded] = useState(false)
  const [isBusinessesLoading, setIsBusinessesLoading] = useState(true)
  const [isDashboardLoading, setIsDashboardLoading] = useState(false)
  const [error, setError] = useState("")

  const redirectToLogin = useCallback(async (): Promise<void> => {
    cancelBusinessesRequest()
    cancelDashboardRequest()
    clearSession()
    clearBusinessContext()
    setDashboard(null)

    await navigate(APP_PATHS.LOGIN)
  }, [
    cancelBusinessesRequest,
    cancelDashboardRequest,
    clearBusinessContext,
    clearSession,
    navigate,
  ])

  const handleRequestError = useCallback(
    async (exception: unknown, fallbackMessage: string): Promise<void> => {
      if (isApiError(exception) && exception.status === 401) {
        await redirectToLogin()
        return
      }

      setError(isApiError(exception) ? exception.message : fallbackMessage)
    },
    [redirectToLogin],
  )

  const loadBusinesses = useCallback(
    async (preferredBusinessId?: string): Promise<void> => {
      if (!accessToken) {
        await redirectToLogin()
        return
      }

      const signal = createBusinessesSignal()

      try {
        const loadedBusinesses = await listUserBusinesses(accessToken, signal)

        if (signal.aborted) {
          return
        }

        const storedBusinessId =
          useBusinessContextStore.getState().currentBusinessId
        const selectedBusinessId =
          loadedBusinesses.find(
            (business) => business.businessId === preferredBusinessId,
          )?.businessId ??
          loadedBusinesses.find(
            (business) => business.businessId === storedBusinessId,
          )?.businessId ??
          loadedBusinesses[0]?.businessId ??
          ""

        setBusinesses(loadedBusinesses)
        setBusinessesLoaded(true)
        setIsBusinessesLoading(false)

        if (!selectedBusinessId) {
          selectBusiness("")
          setContext(null)
          setDashboard(null)
          return
        }

        if (selectedBusinessId !== storedBusinessId) {
          selectBusiness(selectedBusinessId)
        }
      } catch (exception) {
        if (signal.aborted) {
          return
        }

        setBusinessesLoaded(true)
        setIsBusinessesLoading(false)
        await handleRequestError(
          exception,
          "No fue posible cargar los negocios.",
        )
      }
    },
    [
      accessToken,
      createBusinessesSignal,
      handleRequestError,
      redirectToLogin,
      selectBusiness,
      setBusinesses,
      setContext,
    ],
  )

  const loadDashboard = useCallback(async (): Promise<void> => {
    if (!accessToken || !businessesLoaded || !currentBusinessId) {
      return
    }

    const signal = createDashboardSignal()

    try {
      const [loadedContext, loadedDashboard] = await Promise.all([
        getBusinessContext(currentBusinessId, accessToken, signal),
        getFinancialDashboard(
          {
            businessId: currentBusinessId,
            dateFrom: filters.dateFrom || undefined,
            dateTo: filters.dateTo || undefined,
            granularity: filters.granularity,
          },
          accessToken,
          signal,
        ),
      ])

      if (signal.aborted) {
        return
      }

      setContext(loadedContext)
      setDashboard(loadedDashboard)
      setIsDashboardLoading(false)
    } catch (exception) {
      if (signal.aborted) {
        return
      }

      setIsDashboardLoading(false)
      await handleRequestError(exception, "No fue posible cargar el dashboard.")
    }
  }, [
    accessToken,
    businessesLoaded,
    createDashboardSignal,
    currentBusinessId,
    filters,
    handleRequestError,
    setContext,
  ])

  useEffect(() => {
    async function initializeBusinesses(): Promise<void> {
      await loadBusinesses()
    }

    void initializeBusinesses()

    return cancelBusinessesRequest
  }, [cancelBusinessesRequest, loadBusinesses])

  useEffect(() => {
    async function synchronizeDashboard(): Promise<void> {
      await loadDashboard()
    }

    void synchronizeDashboard()

    return cancelDashboardRequest
  }, [cancelDashboardRequest, loadDashboard])

  function handleBusinessChange(businessId: string): void {
    if (businessId === currentBusinessId) {
      return
    }

    cancelDashboardRequest()
    setError("")
    setDashboard(null)
    setIsDashboardLoading(true)
    selectBusiness(businessId)
  }

  function handleFiltersChange(nextFilters: DashboardFilters): void {
    cancelDashboardRequest()
    setError("")
    setIsDashboardLoading(true)
    setFilters(nextFilters)
  }

  async function reloadAfterCreation(businessId: string): Promise<void> {
    setError("")
    setIsBusinessesLoading(true)
    setIsDashboardLoading(true)

    await loadBusinesses(businessId)
  }

  async function logoutCurrentSession(): Promise<void> {
    cancelBusinessesRequest()
    cancelDashboardRequest()

    try {
      await logout()
    } finally {
      await redirectToLogin()
    }
  }

  const isLoading = isBusinessesLoading || isDashboardLoading

  return {
    businesses,
    currentBusinessId: currentBusinessId ?? "",
    dashboard,
    filters,
    isLoading,
    error,
    needsOnboarding: businessesLoaded && businesses.length === 0,
    selectBusiness: handleBusinessChange,
    setFilters: handleFiltersChange,
    reloadAfterCreation,
    logoutCurrentSession,
  }
}
