import { PaymentPlanCard } from "./_components/PaymentPlanCard"

const PaymentPage = () => {
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

        <PaymentPlanCard />
      </div>
    </main>
  )
}

export default PaymentPage
