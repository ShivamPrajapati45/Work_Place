'use client'
import Footer from "@/components/Footer";
import "./globals.css";
import { StateProvider } from "@/context/StateContext";
import { initialState } from "@/context/StateReducers";
import Navbar from "@/components/Navbar";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Script from "next/script";

export default function RootLayout({ children }) {

  const pathName = usePathname();
  const token = Cookies.get('token');
  const router = useRouter();

    // useEffect(() => {
    //   if(!token && pathName !== '/'){
    //     router.push('/login');
    //   }
    // },[token])
  return (
    <html lang="en">
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/datepicker.min.js"
        />
        <body>
        <StateProvider initialState={initialState} >
          <div className="relative h-screen flex flex-col justify-between">
            <Navbar/>
            <div className={` ${pathName !== '/' ? 'mt-16':''} `}>
              {children}
            </div>
            <Footer/>
          </div>
        </StateProvider>
      </body>
    </html>
  );
}
