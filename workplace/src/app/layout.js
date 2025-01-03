'use client'
import Footer from "@/components/Footer";
import "./globals.css";
import { StateProvider } from "@/context/StateContext";
import { initialState } from "@/context/StateReducers";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathName = usePathname();
  return (
    <html lang="en">
      <body>
        <StateProvider initialState={initialState} >
          <div className="relative h-screen flex flex-col justify-between">
            <Navbar/>
            <div className={`mb-auto w-full m-auto ${pathName !== '/' ? 'mt-16':''} `}>
              {children}
            </div>
            <Footer/>
          </div>
        </StateProvider>
      </body>
    </html>
  );
}
