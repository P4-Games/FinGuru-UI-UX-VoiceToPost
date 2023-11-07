'use client'
import React, {useState, useEffect} from "react";
import { Article } from "./Article";
import { getUserArticles } from "@/utils/articles";
import { getUsername } from "@/utils/login";
import Skeleton from "react-loading-skeleton";

export const Articles = ()=>{
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(()=>{
        getUserArticles(getUsername()).then((articles)=>{
            setArticles(articles);
            setIsLoading(false);
        })
    }, [])

    return (
        <section>
            {
                !isLoading ? articles.map((article, index) => (
                    <Article key={index} {...article} />
                )) : Array.from({length: 5}).map((_, index) => (
                    <Skeleton key={index} height={160} width={window.innerWidth - 60} className="mb-6" />
                ))
            }
        </section>
    )
}