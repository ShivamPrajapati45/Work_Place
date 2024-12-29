'use client'
import AuthWrapper from "@/components/AuthWrapper";
import Business from "@/components/Landing/Business";
import Companies from "@/components/Landing/Companies";
import Everything from "@/components/Landing/Everything";
import HeroBanner from "@/components/Landing/HeroBanner";
import JoinWorkplace from "@/components/Landing/JoinWorkplace";
import PopularServices from "@/components/Landing/PopularServices";
import Services from "@/components/Landing/Services";
import { useStateProvider } from "@/context/StateContext";


export default function Home() {

  const [{ showLogInModel, showSignUpModel }] = useStateProvider();
  // console.log(showLogInModel, showSignUpModel);

  return (
    <div>
      <HeroBanner/>
      <Companies/>
      <PopularServices/>
      <Everything/>
      <Services/>
      <Business/>
      <JoinWorkplace/>
      {
        (showLogInModel || showSignUpModel) && (
          <AuthWrapper type = {showLogInModel ? 'login' : 'signup'} />
        )
      }
    </div>
  );
}
