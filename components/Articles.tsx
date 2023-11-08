'use client'
import React, {useState, useEffect} from "react";
import { Article } from "./Article";
import { getUserArticles } from "@/utils/articles";
import { getUsername } from "@/utils/login";
import Skeleton from "react-loading-skeleton";

export const Articles = ()=>{
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [loadingWidth, setLoadingWidth] = useState<number>(0);
    useEffect(()=>{
        getUserArticles(getUsername()).then((articles)=>{
            setArticles(articles);
            setIsLoading(false);
        })

        if(typeof window !== 'undefined'){
            setLoadingWidth(window.innerWidth - 60)
        }
    }, [])

    return (
        <section>
            {
                !isLoading ? articles.map((article, index) => (
                    <Article key={index} {...article} />
                )) : Array.from({length: 5}).map((_, index) => (
                    <Skeleton key={index} height={160} width={loadingWidth} className="mb-6" />
                ))
            }
        </section>
    )
}