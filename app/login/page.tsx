'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isLoggedIn, login, saveToken } from "@/utils/login";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Page (){
    const router = useRouter();
    const [user, setUser] = React.useState<string>('')
    const [password, setPassword] = React.useState<string>('')
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [message, setMessage] = React.useState<string>('');

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const data = await login(user, password, setMessage, setIsLoading)
        if(data.jwt_token){
            saveToken(data.jwt_token, user)
            router.push('/note-record')
        }
    }

    const handleOnChangeUser = (e: any) => setUser(e.target.value);
    const handleOnChangePass = (e: any) => setPassword(e.target.value);

    useEffect(() => {
        if(isLoggedIn()) router.push('/note-record')
    }, [router])

    return (
        <main className="flex flex-col items-center">
            <section className="flex flex-col items-left sm:items-center justify-center h-[100vh] p-6 sm:p-24 gap-12 w-full sm:w-1/2">
                <h1 className='text-4xl sm:text-6xl font-bold text-left sm:text-center'>
                    Ingresar o crear cuenta
                </h1>
                <p className='sm:w-[50%] w-[100%] text-left sm:text-center text-xl'>
                    Ingrese su nombre y contraseña de <a href="https://www.fin.guru/">fin.guru</a>
                </p>
                <form onSubmit={(e) => handleSubmit(e)} method="POST" encType="multipart/form-data" className="flex flex-col items-center justify-center w-full gap-6">
                    <Input className='text-xl px-12 py-6' autoComplete="do-not-autocomplete" placeholder='Nombre' name="username" id="username" value={user} onChange={handleOnChangeUser}/>
                    <Input className='text-xl px-12 py-6' placeholder='Contraseña' name="password" type="password" id="password" value={password} onChange={handleOnChangePass}/>
                    <p className='text-xl text-red-500'>{message ?? ""}</p>
                    <Button className='text-xl px-12 py-6 w-full' type="submit" disabled={isLoading}>{
                        isLoading ? 'Cargando...' : 'Ingresar'
                    }</Button>
                </form>
            </section>
        </main>
    );
}