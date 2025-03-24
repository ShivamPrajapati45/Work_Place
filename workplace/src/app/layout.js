'use client'
import Footer from "@/components/Footer";
import "./globals.css";
import { StateProvider } from "@/context/StateContext";
import reducer,{initialState} from "@/context/StateReducers";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { Toaster } from "react-hot-toast";
import { Ubuntu } from "next/font/google"

const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['300', '400'],
})

export default function RootLayout({ children }) {

  const pathName = usePathname();
  // const token = Cookies.get('token');

    // useEffect(() => {
    //   if(!token && pathName !== '/'){
    //     router.push('/login');
    //   }
    // },[token])


  return (
    <html lang="en" suppressHydrationWarning>
        <body className={`flex flex-col min-h-screen ${ubuntu.className}`}>
        <StateProvider initialState={initialState} reducer={reducer}>
            <header>
              <Navbar/>
            </header>
            <main className={`flex-grow ${pathName !== '/' ? 'mt-16':''} min-h-screen`}>
              {children}
            </main>
        </StateProvider>
        <Toaster/>
      </body>
    </html>
  );
}
