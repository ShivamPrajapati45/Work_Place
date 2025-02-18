'use client'
import Footer from "@/components/Footer";
import "./globals.css";
import { StateProvider } from "@/context/StateContext";
import reducer,{initialState} from "@/context/StateReducers";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";

export default function RootLayout({ children }) {

  const pathName = usePathname();
  // const token = Cookies.get('token');

    // useEffect(() => {
    //   if(!token && pathName !== '/'){
    //     router.push('/login');
    //   }
    // },[token])


  return (
    <html lang="en">
      <head>
        <title>WorkPlace</title>
      </head>
        <body className="flex flex-col min-h-screen">
        <StateProvider initialState={initialState} reducer={reducer}>
            <header>
              <Navbar/>
            </header>
            <main className={`flex-grow ${pathName !== '/' ? 'mt-16':''} min-h-screen`}>
              {children}
            </main>
            {/* <Footer/> */}
        </StateProvider>
      </body>
    </html>
  );
}
