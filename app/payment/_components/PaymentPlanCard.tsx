import { CheckCircle2, CreditCard, ShieldCheck, Zap } from "lucide-react"

export function PaymentPlanCard() {
  const features = [
    "Continue applying after your 10 free applications",
    "Access more job opportunities",
    "Apply without interruption",
    "A smoother job application experience",
  ]

  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#1a1a2e] to-[#151523] shadow-xl shadow-black/30">
      <div className="relative border-b border-white/10 p-5">
        <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-[#5c53fe]/20 blur-3xl" />

        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-widest text-[#8b84ff]">
              HIRELOOP PREMIUM
            </p>

            <h2 className="mt-1 text-lg font-bold text-white">
              Unlimited Applications
            </h2>
          </div>

          <div className="rounded-lg bg-[#5c53fe]/15 p-2 text-[#8b84ff] ring-1 ring-[#5c53fe]/30">
            <Zap size={20} />
          </div>
        </div>

        <div className="relative mt-4 flex items-end gap-1.5">
          <span className="text-3xl font-bold text-white">$9.99</span>
          <span className="pb-0.5 text-xs text-gray-400">
            / one-time payment
          </span>
        </div>

        <p className="relative mt-1 text-xs text-gray-400">
          Unlock more opportunities with Hireloop Premium.
        </p>
      </div>

      <div className="p-5">
        <h3 className="mb-3 text-sm font-semibold text-white">
          What&apos;s included
        </h3>

        <ul className="space-y-2.5">
          {features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2.5 text-xs text-gray-300"
            >
              <CheckCircle2
                size={16}
                className="mt-0.5 shrink-0 text-emerald-400"
              />
              {feature}
            </li>
          ))}
        </ul>

        <div className="my-4 border-t border-white/10" />

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Total amount</span>
          <span className="text-xl font-bold text-white">$9.99</span>
        </div>

        <button
          type="button"
          disabled
          className="mt-4 flex h-10 w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#5c53fe] to-[#7a72ff] text-sm font-semibold text-white opacity-80 transition-colors"
        >
          <CreditCard size={16} />
          Pay Now
        </button>

        <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
          <ShieldCheck size={13} />
          Secure payment powered by Stripe (coming soon)
        </div>
      </div>
    </div>
  )
}
