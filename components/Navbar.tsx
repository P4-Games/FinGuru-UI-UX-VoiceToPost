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

    const handleOpenArticles = () => router.push('/articles')
    const handleOpenNoteRecord = () => router.push('/note-record')

    useEffect(() => {
        if(isLoggedIn()){
            let token = getToken();
            if(token) {
                const user = getUsername();
                getUserDetails(token).then((user)=>{
                    console.log(user)
                })
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
    }, [router]);

    return (
        <nav className="w-full bg-[#eee] flex flex-row items-center justify-between px-6 py-4 mb-6">
            <h3 className='text-xl sm:text-3xl font-medium text-left sm:text-center' onClick={handleOpenNoteRecord} onKeyDown={e => console.log(e)}>
                {username?.split(" ")?.[0] ?? ""} 
            </h3>
            <section className="flex flex-row items-center gap-6">
                {
                    !showArticles ? (
                        <button className="flex flex-row items-center" onClick={handleOpenArticles}>
                            Mis artículos
                        </button>
                    ) : (
                        <button className="flex flex-row items-center" onClick={handleOpenNoteRecord}>
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