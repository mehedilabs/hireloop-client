import Link from "next/link"
import { ArrowLeft, Home, ShieldAlert } from "lucide-react"

const UnauthorizedPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border bg-card p-8 text-center shadow-xl">
        <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-red-500/20 blur-3xl" />

        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 ring-1 ring-red-500/30">
          <ShieldAlert size={32} />
        </div>

        <p className="relative mt-6 text-sm font-semibold tracking-widest text-red-500">
          ERROR 403
        </p>

        <h1 className="relative mt-2 text-3xl font-bold tracking-tight">
          Access Denied
        </h1>

        <p className="relative mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
          You don&apos;t have permission to access this page. If you think this
          is a mistake, please contact support or try a different account.
        </p>

        <div className="relative mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-5 text-sm font-semibold transition-colors hover:bg-muted"
          >
            <Home size={16} />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default UnauthorizedPage
