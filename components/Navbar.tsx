import { getToken, getUserDetails, isLoggedIn, logout } from "@/utils/login";
import React, { useEffect } from "react";
import { IconLogout } from "./IconLogout";
import { useRouter } from "next/navigation";

export const Navbar = () => {
    const router = useRouter();
    const [userDetails, setUserDetails] = React.useState<any>({})
    
    const handleLogout = ()=>{
        logout();
        router.push('/')
    }

    useEffect(() => {
        if(isLoggedIn()){
            let token = getToken();
            if(token) {
                //getUserDetails(token).then(data => setUserDetails(data))
            }
        }else{
            router.push('/')
        }
    }, []);

    return (
        <nav className="w-full bg-[#eee] flex flex-row items-center justify-between px-6 py-4 mb-6">
            <h3 className='text-4xl sm:text-6xl font-bold text-left sm:text-center'>
                
            </h3>

            <div onClick={handleLogout} onKeyDown={e => e.preventDefault()}>
                <IconLogout />
            </div>
        </nav>
    )
}