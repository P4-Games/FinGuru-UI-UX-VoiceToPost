'use client';
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface LinkButtonProps {
    link: string,
    type?: "default" | "external",
    className?: string,
    children: React.ReactNode
}
export const LinkButton = ({link, type = "default", className, children}: LinkButtonProps) =>{
    const router = useRouter();
    const handleClick = (e: any) => type === "default" ? router.push(link) : window.open(link, "_blank"); 
    return (
        <Button className={'text-xl px-12 gap-6 py-8 ' + (className ?? "")} onClick={handleClick}>{children}</Button>
    )
}