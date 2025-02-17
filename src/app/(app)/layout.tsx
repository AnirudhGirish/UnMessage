import Navbar from "@/components/Navbar";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("In layout of (app)")
  return (
          <main>
            <Navbar/>
            {children}
          </main>
  );
}
