import React from "react";
import { Button } from "./ui/button";
import { IconNewspaper } from "./IconNewspaper";
import { IconRocket } from "./IconRocket";

export type Article = {
    title: string;
    visits: number | string;
    link: string;
    author?: string;
}

interface ArticleProps extends Article {
}

export const ButtonClassName = "bg-slate-700 text-slate-100 mt-3 flex flex-row items-center gap-2";
export const ButtonAltClassName = "bg-slate-500 text-slate-100 mt-3 flex flex-row items-center gap-2";

export const Article = ({title, visits, link}: ArticleProps) => {
    return (
        <section className='bg-gray-100 rounded-lg w-full p-6 flex flex-col'>
            <h3 className='text-xl m-0 font-medium'>{title}</h3>
            <p>Visitas: {visits}</p>
            <div className='flex flex-row gap-2 w-full'>
                <Button className={ButtonClassName}>Ver Articulo <IconNewspaper /></Button>
                <Button className={ButtonAltClassName}>Promocionar <IconRocket /></Button>
            </div>
        </section>
    )
}