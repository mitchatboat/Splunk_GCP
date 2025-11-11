// app/layout.js
import './globals.css'

export const metadata = {
  title: 'Splunk to GCP Analytics Dashboard',
  description: 'Real-time security analytics with BigQuery ML',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}
