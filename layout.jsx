import { Inter } from "next/font/google"
import "./app/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Rehan - Full Stack Developer",
  description: "Modern developer portfolio showcasing full-stack development skills",
  generator: "v0.dev",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
