'use client'
import Footer from "@/components/Footer";
import "./globals.css";
import { StateProvider } from "@/context/StateContext";
import { initialState } from "@/context/StateReducers";
import Navbar from "@/components/Navbar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function RootLayout({ children }) {

  const pathName = usePathname();
  const token = Cookies.get('token');
  const router = useRouter();

    useEffect(() => {
      if(!token && pathName !== '/'){
        router.push('/login');
      }
      router.push('/');
    },[token])
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
