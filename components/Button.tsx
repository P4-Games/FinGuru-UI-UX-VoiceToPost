'use client';
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface LinkButtonProps {
    link: string,
    type: "default" | "external",
}
export const LinkButton = ({link, type}: LinkButtonProps) =>{
    const router = useRouter();
    const handleClick = (e: any) => type === "default" ? router.push(link) : window.open(link, "_blank"); 
    return (
        <Button className='text-xl px-12 py-6' onClick={handleClick}>Comenzar</Button>
    )
}