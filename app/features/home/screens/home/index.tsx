import { HomeFooter } from "../../components/home-footer"
import { HomeHeader } from "../../components/home-header"
import { BenefitsSection } from "./components/benefits-section"
import { HeroSection } from "./components/hero-section"
import { HomeCta } from "./components/home-cta"
import { HowItWorksSection } from "./components/how-it-works-section"
import { SecuritySection } from "./components/security-section"

export function meta() {
  return [
    { title: "Mype | Control financiero para tu negocio" },
    {
      name: "description",
      content:
        "Registra ventas y gastos, consulta tu flujo de caja y toma decisiones con información clara.",
    },
  ]
}

export default function HomeScreen() {
  return (
    <div className="min-h-screen min-w-80 bg-[#f9fbff] font-[Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] text-[#172033] [&_*]:box-border [&_*::before]:box-border [&_*::after]:box-border">
      <HomeHeader />
      <HeroSection />
      <BenefitsSection />
      <HowItWorksSection />
      <SecuritySection />
      <HomeCta />
      <HomeFooter />
    </div>
  )
}
