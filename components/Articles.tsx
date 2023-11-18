'use client'
import React, {useState, useEffect} from "react";
import { Article } from "./Article";
import { getUserArticles } from "@/utils/articles";
import { getToken, getUsername, getUsernameFromToken } from "@/utils/login";
import Skeleton from "react-loading-skeleton";
import { Button } from "./ui/button";
import Image from "next/image";

export const Articles = ()=>{
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [loadingWidth, setLoadingWidth] = useState<number>(0);
    const [tokens, setTokens] = useState<number>(0);

    useEffect(()=>{
        getUserArticles(getUsername()).then((articles)=>{
            setArticles(articles);
            setIsLoading(false);
        })

        if(typeof window !== 'undefined'){
            setLoadingWidth(window.innerWidth - 60)
        }
    }, [])

    useEffect(() => {
        if(articles.length > 0){
            setTokens(articles.reduce((acc, article) => acc + parseInt(article.visits + ""), 0))
        }
    }, [articles])

    return (
        <>
            <section className='border-violet-700 bg-violet-100 border-4 rounded-lg w-full p-6 flex flex-row justify-between items-center my-4'>
            <div className='flex flex-col gap-2'>
                <h3 className='text-xl m-0 font-medium'>Reclamar tokens</h3>
                <p>Pendiente: {tokens} $NEWS</p>
                <Button  className='bg-violet-700 mt-3' disabled={tokens < 300}>{tokens < 300 ? "Min. 300 NEWS" : "Reclamar"}</Button>
            </div>
            <Image src="/finguru_token.png" alt='finguru token' width={80} height={80}/>
            </section>
            <section className="flex flex-col gap-6 w-full">
                {
                    !isLoading ? articles.map((article, index) => (
                        <Article key={index} {...article} />
                    )) : Array.from({length: 5}).map((_, index) => (
                        <Skeleton key={index} height={160} width={""} className="mb-6" />
                    ))
                }
            </section>
        </>
    )
}