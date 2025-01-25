import { Outlet, redirect } from "react-router-dom"
import { Wrapper } from "../assets/styles/HomeLayout"
import { ScrollRestoration } from "react-router-dom"
import customFetch from "@/utils/customFetch"
import { Suspense, lazy } from "react"
import LoadingSpinner from "@/components/loaders/LoadingSpinner"

// Lazy load components
const Header = lazy(() => import("../components/shared/Header"))
const Footer = lazy(() => import("../components/shared/Footer"))

// Memoize logout action
const logoutAction = async () => {
  try {
    const response = await customFetch.get("/auth/logout")
    if (response.status === 200) {
      return redirect("/")
    }
  } catch (error) {
    console.error("Logout error:", error)
  }
}
const HomeLayout = () => {
  return (
    <Wrapper>
      <ScrollRestoration />
      <Suspense fallback={<LoadingSpinner />}>
        <Header />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <Outlet />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <Footer />
      </Suspense>
    </Wrapper>
  )
}

export { logoutAction }
export default HomeLayout