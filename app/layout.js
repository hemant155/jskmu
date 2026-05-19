import Script from 'next/script'
import './globals.css'

export const metadata = {
  title: 'JSKMU — Missing & Unidentified Database',
  description: 'India\'s first unified missing persons and unidentified bodies database',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}