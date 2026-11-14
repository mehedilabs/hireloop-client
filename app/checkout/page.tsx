const CheckoutPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>
}) => {
  const { canceled } = await searchParams

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b0b16] px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Upgrade Your Plan
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-400">
            You have reached your free application limit. Upgrade your plan to
            continue applying for jobs.
          </p>
        </div>

        {canceled && (
          <p className="mb-4 rounded-lg bg-red-500/10 p-3 text-center text-sm text-red-400">
            Your payment was canceled. You can try again whenever you&apos;re
            ready.
          </p>
        )}

        <div className="rounded-2xl border border-white/10 bg-[#151525] p-6 shadow-xl sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-400">
              Hireloop Premium
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Unlimited Applications
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Continue applying for jobs without the free application limit.
            </p>
          </div>

          <div className="space-y-3 border-y border-white/10 py-5 text-sm text-gray-300">
            <p>✓ Apply to unlimited jobs</p>
            <p>✓ Access more career opportunities</p>
            <p>✓ Continue your job search without interruption</p>
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-400">One-time payment</p>
            <p className="mt-1 text-4xl font-bold text-white">$20.00</p>
          </div>

          <form action="/api/checkout_sessions" method="POST">
            <button
              type="submit"
              className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-[#5c53fe] font-semibold text-white transition-colors hover:bg-[#4940e8]"
            >
              Pay Now
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-gray-500">
            Secure payment powered by Stripe
          </p>
        </div>
      </div>
    </main>
  )
}

export default CheckoutPage
