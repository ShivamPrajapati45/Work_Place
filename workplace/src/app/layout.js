'use client'
import Footer from "@/components/Footer";
import "./globals.css";
import { StateProvider } from "@/context/StateContext";
import reducer,{initialState} from "@/context/StateReducers";
import Navbar from "@/components/Navbar";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";

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
      <head>
        <title>WorkPlace</title>
      </head>
        <body className="min-h-screen w-full overflow-x-hidden p-0 m-0 box-border">
        <StateProvider initialState={initialState} reducer={reducer} >
          <div className="flex flex-col flex-grow">
            <header>
              <Navbar/>
            </header>
            <main className={` ${pathName !== '/' ? 'mt-16':''}`}>
              {children}
            </main>
            <Footer/>
          </div>
        </StateProvider>
      </body>
    </html>
  );
}
