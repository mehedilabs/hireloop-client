import Link from "next/link"
import Image from "next/image"

import logo from "@/app/images/logo.png"

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Job discovery", href: "/jobs" },
      { label: "Worker AI", href: "/worker-ai" },
      { label: "Companies", href: "/company" },
      { label: "Salary data", href: "/salary" },
    ],
  },
  {
    title: "Navigations",
    links: [
      { label: "Help center", href: "/help" },
      { label: "Career library", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Brand Guideline", href: "/brand" },
      { label: "Newsroom", href: "/news" },
    ],
  },
]

const SOCIALS = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    path: "M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z",
  },
  {
    name: "Pinterest",
    href: "https://pinterest.com",
    path: "M12 2a10 10 0 0 0-3.64 19.31c-.09-.82-.17-2.08.03-2.98.19-.81 1.22-5.17 1.22-5.17s-.31-.62-.31-1.54c0-1.44.84-2.52 1.88-2.52.89 0 1.32.67 1.32 1.47 0 .9-.57 2.24-.86 3.48-.25 1.04.52 1.89 1.54 1.89 1.85 0 3.27-1.95 3.27-4.77 0-2.49-1.79-4.23-4.35-4.23-2.96 0-4.7 2.22-4.7 4.52 0 .9.34 1.86.78 2.38.09.1.1.19.07.3-.08.33-.26 1.04-.29 1.19-.05.19-.15.23-.35.14-1.3-.6-2.11-2.5-2.11-4.03 0-3.28 2.38-6.3 6.88-6.3 3.61 0 6.42 2.57 6.42 6.01 0 3.59-2.26 6.47-5.4 6.47-1.05 0-2.04-.55-2.38-1.19l-.65 2.47c-.23.9-.87 2.02-1.3 2.7A10 10 0 1 0 12 2Z",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    path: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z",
  },
]

export default function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-black px-4 pt-10 pb-6 text-white sm:px-6 md:pt-14">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-3 gap-x-4 gap-y-8 md:grid-cols-[2fr_1fr_1fr_1fr] md:gap-x-8">
          {/* Brand */}
          <div className="col-span-3 text-center md:col-span-1 md:text-left">
            <Link href="/" aria-label="hireloop home" className="inline-block">
              <Image
                src={logo}
                alt="hireloop"
                className="h-5 w-auto opacity-70 transition-opacity hover:opacity-100 md:h-7"
              />
            </Link>
            <p className="mx-auto mt-3 max-w-[260px] text-xs leading-relaxed text-white/50 sm:text-[13px] md:mx-0">
              The AI-native career platform. Built for people who take their
              work seriously.
            </p>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <nav
              key={col.title}
              aria-label={col.title}
              className="text-center md:text-left"
            >
              <h3 className="text-[13px] font-medium text-[#7c6cf5] sm:text-sm">
                {col.title}
              </h3>
              <ul className="mt-3 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-white/55 transition-colors hover:text-white sm:text-[13px]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center gap-4 border-t border-white/10 pt-5 text-center md:mt-12 md:flex-row md:justify-between md:text-left">
          <div className="flex items-center justify-center gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className="flex size-8 items-center justify-center rounded-lg bg-white/5 text-white/60 transition-colors hover:bg-[#5b4fe9] hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-4"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>

          <div className="flex flex-col items-center gap-1 text-[11px] text-white/40 sm:text-xs md:flex-row md:gap-x-4">
            <span>© {year} HireLoop. All rights reserved.</span>
            <span className="flex items-center gap-2">
              <Link href="/terms" className="hover:text-white">
                Terms &amp; Policy
              </Link>
              <span aria-hidden="true">·</span>
              <Link href="/privacy" className="hover:text-white">
                Privacy Guideline
              </Link>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
