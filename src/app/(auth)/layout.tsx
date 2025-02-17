
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    console.log("In layout of (auth)")
  return (
      <main>{children}</main>

  )
}
