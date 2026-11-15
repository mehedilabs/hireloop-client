import { checkoutVerify } from "@/lib/actions/payments"
import { stripe } from "@/lib/stripe"
import { redirect } from "next/navigation"
import Link from "next/link"

function Row({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 text-xs">
      <span className="shrink-0 text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-200">{children}</span>
    </div>
  )
}

function CopyBox({
  label,
  mono,
  children,
}: {
  label: string
  mono?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="py-2 text-xs">
      <span className="text-slate-500">{label}</span>
      <p
        className={`mt-1.5 rounded-lg border border-[#2a2a3d] bg-white/5 px-2.5 py-2 leading-snug break-all text-slate-300 ${
          mono ? "font-mono text-[11px]" : "text-xs"
        }`}
      >
        {children}
      </p>
    </div>
  )
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  if (!session_id) {
    throw new Error("Please provide a valid session_id (`cs_test_...`)")
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  })

  const {
    status,
    payment_status,
    metadata,
    payment_intent,
    amount_total,
    currency,
  } = session

  const email = session.customer_email || session.customer_details?.email

  if (status === "open") {
    return redirect("/")
  }

  const isRecruiter = metadata?.plan === "recruiter"

  const transactionId =
    typeof payment_intent === "string"
      ? payment_intent
      : payment_intent?.id || "N/A"

  const amountPaid = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency?.toUpperCase() || "USD",
  }).format((amount_total || 0) / 100)

  if (status === "complete" && payment_status === "paid") {
    await checkoutVerify(session_id)

    const planName = isRecruiter ? "Recruiter Premium" : "Seeker Premium"

    return (
      <section
        id="success"
        className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#0b0b16] px-4 py-6"
      >
        {/* Background glow */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-[#5a4ff5]/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-[#6c63ff]/15 blur-3xl" />

        <div className="relative w-full max-w-sm rounded-2xl border border-[#2a2a3d] bg-[#171726]/80 p-5 shadow-xl shadow-black/40 backdrop-blur-xl">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 ring-4 ring-emerald-500/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-emerald-400"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-xl font-bold tracking-tight text-white">
              Payment Successful
            </h1>

            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
              {isRecruiter
                ? "Your Recruiter Premium plan is active. Enjoy unlimited job posts."
                : "Your Seeker Premium plan is active. Enjoy unlimited applications."}
            </p>

            <p className="mt-3 text-2xl font-bold text-emerald-400">
              {amountPaid}
            </p>
          </div>

          {/* Details */}
          <div className="mt-4 divide-y divide-[#2a2a3d] rounded-xl border border-[#2a2a3d] bg-[#0b0b16]/60 px-3">
            <Row label="Plan">Hireloop {planName}</Row>

            <Row label="Benefits">
              {isRecruiter ? "Unlimited Job Posts" : "Unlimited Applications"}
            </Row>

            <Row label="Status">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                <span className="h-1 w-1 rounded-full bg-emerald-400" />
                Paid
              </span>
            </Row>

            <CopyBox label="Transaction ID" mono>
              {transactionId}
            </CopyBox>

            {email && <CopyBox label="Receipt sent to">{email}</CopyBox>}
          </div>

          {/* Buttons */}
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <Link
              href={isRecruiter ? "/dashboard/recruiter" : "/dashboard/seeker"}
              className="rounded-lg bg-[#5a4ff5] px-3 py-2.5 text-center text-xs font-semibold text-white shadow-md shadow-[#5a4ff5]/30 transition hover:bg-[#6c63ff] active:scale-[0.98]"
            >
              Dashboard
            </Link>

            <Link
              href="/"
              className="rounded-lg border border-[#2a2a3d] bg-white/5 px-3 py-2.5 text-center text-xs font-semibold text-slate-200 transition hover:bg-white/10 active:scale-[0.98]"
            >
              Back to Home
            </Link>
          </div>

          <p className="mt-4 text-center text-[10px] text-slate-500">
            Secure payment powered by Stripe
          </p>
        </div>
      </section>
    )
  }

  return redirect("/")
}
