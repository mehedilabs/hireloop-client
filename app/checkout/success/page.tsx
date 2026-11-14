import { checkoutVerify } from "@/lib/actions/payments"
import { stripe } from "@/lib/stripe"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  if (!session_id) {
    throw new Error("Please provide a valid session_id (`cs_test_...`)")
  }
  const { status, payment_status, customer_email, metadata, payment_intent } =
    await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    })

  if (status === "open") {
    return redirect("/")
  }

  if (status === "complete" && payment_status === "paid") {
    const result = await checkoutVerify(session_id)
    console.log(result)
    return (
      <section
        id="success"
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b0b16] px-4"
      >
        {/* Background glow */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#5a4ff5]/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-[#6c63ff]/20 blur-3xl" />

        <div className="relative w-full max-w-md rounded-3xl border border-[#2a2a3d] bg-[#171726]/80 p-8 text-center shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-10">
          {/* Success icon */}
          <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/20" />
            <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-400/30 to-[#5a4ff5]/30 blur-md" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-400 shadow-lg shadow-emerald-500/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-10 w-10"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <p className="text-sm text-slate-400">Hireloop Premium</p>
          <h1 className="mt-1 bg-gradient-to-r from-white via-indigo-100 to-[#a5a0ff] bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
            Payment Successful!
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
            We appreciate your business! You can now apply for unlimited jobs
            and continue your job search without interruption.
          </p>

          {/* Info box */}
          <div className="mt-8 rounded-2xl border border-[#2a2a3d] bg-[#0b0b16]/60 p-4 text-left">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Plan</span>
              <span className="text-slate-200">Unlimited Applications</span>
            </div>
            <div className="my-3 h-px bg-[#2a2a3d]" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Status</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Paid
              </span>
            </div>
            {customer_email && (
              <>
                <div className="my-3 h-px bg-[#2a2a3d]" />
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-slate-400">Receipt sent to</span>
                  <span className="truncate text-slate-200">
                    {customer_email}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard/seeker"
              className="flex-1 rounded-xl bg-[#5a4ff5] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#5a4ff5]/30 transition hover:scale-[1.02] hover:bg-[#6c63ff] hover:shadow-[#5a4ff5]/50"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/"
              className="flex-1 rounded-xl border border-[#2a2a3d] bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              Back to Home
            </Link>
          </div>

          <p className="mt-6 text-xs text-slate-500">
            Secure payment powered by Stripe
          </p>
        </div>
      </section>
    )
  }
}
