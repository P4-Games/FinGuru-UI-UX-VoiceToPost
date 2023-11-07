'use client'
import { getToken, getUserDetails, getUsername, isLoggedIn, logout } from "@/utils/login";
import React, { useEffect } from "react";
import { IconLogout } from "./IconLogout";
import { useRouter } from "next/navigation";

export const Navbar = () => {
    const router = useRouter();
    const [username, setUsername] = React.useState<string>('')
    const [showArticles, setShowArticles] = React.useState<boolean>(false);

    const handleLogout = ()=>{
        logout();
        router.push('/')
    }

    useEffect(() => {
        if(isLoggedIn()){
            let token = getToken();
            if(token) {
                const user = getUsername();
                if(user){
                    setUsername(user)
                }else{
                    logout();
                    router.push('/')
                }
            }
        }else{
            router.push('/')
        }

        if(typeof window !== 'undefined'){
            if(window.location.pathname === '/note-record'){
                setShowArticles(false)
            }else{
                setShowArticles(true)
            }
        }
    }, []);

    return (
        <nav className="w-full bg-[#eee] flex flex-row items-center justify-between px-6 py-4 mb-6">
            <h3 className='text-xl sm:text-3xl font-medium text-left sm:text-center' onClick={()=>{
                router.push('/note-record')
            }}>
                {username?.split(" ")?.[0] ?? ""} 
            </h3>
            <section className="flex flex-row items-center gap-6">
                {
                    !showArticles ? (
                        <button className="flex flex-row items-center" onClick={()=>{
                            router.push('/articles')
                        }}>
                            Mis artículos
                        </button>
                    ) : (
                        <button className="flex flex-row items-center" onClick={()=>{
                            router.push('/note-record')
                        }}>
                            Grabar nota
                        </button>
                    )
                }
                <div onClick={handleLogout} onKeyDown={e => e.preventDefault()}>
                    <IconLogout />
                </div>
            </section>
        </nav>
    )
}