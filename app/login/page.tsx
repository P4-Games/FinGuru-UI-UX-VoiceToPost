'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

export default function Page (){
    const [user, setUser] = React.useState<string>('')
    const [password, setPassword] = React.useState<string>('')

    const handleSubmit = ()=>{
        //TBC
    }

    const handleOnChangeUser = (e: any) => setUser(e.target.value);
    const handleOnChangePass = (e: any) => setPassword(e.target.value);

    return (
        <main className="flex flex-col items-center">
            <section className="flex flex-col items-center justify-between p-24 gap-12 w-1/2">
                <h1 className='text-6xl font-bold text-center'>
                    Ingresar o crear cuenta
                </h1>
                <p className='sm:w-[50%] w-[90%] text-center text-xl'>
                    Ingrese su usuario y contraseña de <a href="https://www.fin.guru/">fin.guru</a>
                </p>
                <Input className='text-xl px-12 py-6' placeholder='Usuario' value={user} onChange={handleOnChangeUser}/>
                <Input className='text-xl px-12 py-6' placeholder='Contraseña' value={password} onChange={handleOnChangePass}/>
                <Button className='text-xl px-12 py-6'>Comenzar</Button>
            </section>
        </main>
    );
}