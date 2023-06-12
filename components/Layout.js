import { useRouter } from "next/router";
import NavigationCard from "./NavigationCard";

export default function Layout({ children, hideNavigation, back }) {
  const router =  useRouter()
  let rightColumnClasses = '';
  if (hideNavigation) {
    rightColumnClasses += 'w-full';
  } else {
    rightColumnClasses += 'mx-4 md:mx-0 md:w-9/12';
  }
  return (
    <>
      <div className="md:flex mt-4 max-w-4xl mx-auto gap-6 mb-24 md:mb-0">
        {!hideNavigation && 
          <div className="fixed md:static w-full bottom-0 md:w-3/12 -mb-5 z-50">
            <NavigationCard />
          </div>
         } 
         {back && (
            <div onClick={()=> router.back()} className=' w-[60px] h-[60px] rounded-full  shadow-md cursor-pointer flex items-center justify-center text-lg bg-white'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>

          </div>
          )
        }
        <div className={rightColumnClasses}>
          {children}
        </div>
      </div>
    </>
  );
}