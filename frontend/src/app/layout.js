import './globals.css'

export const metadata = {
  title: 'ProjectHub - Project Management Platform',
  description: 'Project Management Portal',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
