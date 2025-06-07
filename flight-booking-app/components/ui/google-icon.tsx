import type React from "react"
export function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M17.5 12c0-3-2.5-5.5-5.5-5.5-3 0-5.5 2.5-5.5 5.5 0 2.5 1.5 4.5 3.5 5.5h4c2-1 3.5-3 3.5-5.5z" />
      <path d="M12 7v10" />
      <path d="M7 12h10" />
    </svg>
  )
}
