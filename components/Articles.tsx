'use client'
import React, {useState, useEffect} from "react";
import { Article } from "./Article";
import { getUserArticles } from "@/utils/articles";
import { getToken, getUsername, getUsernameFromToken } from "@/utils/login";
import Skeleton from "react-loading-skeleton";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { IconExternalLink } from "@tabler/icons-react";

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

    const [claiming, setIsClaiming] = useState(false);
    const [claimed, setClaimed] = useState(false);
    const [address, setAddress] = useState("");
    
    const handleClaim = async () => {
        setIsClaiming(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsClaiming(false);
        setClaimed(true);
    }

    return (
        <>
            <section className='border-violet-700 bg-violet-100 border-4 rounded-lg w-full p-6 flex flex-row justify-between items-start gap-6 my-4'>
            <div className='flex flex-col gap-2'>
                {
                    claimed ? (
                        <>
                            <h3 className='text-xl m-0 font-medium'>Reclamar tokens</h3>
                            <p>Pendiente: 1000 $FG</p>
                            <Input autoComplete="do-not-autocomplete" className='text-xl px-2 py-6' placeholder='Dirección de billetera' name="address" id="address" value={address} onChange={(e) => setAddress(e.target.value)}/>
                            <Button  className='bg-violet-700 mt-3' disabled={claimed} onClick={handleClaim}>{!claiming ? "Reclamar" : "Enviando tus tokens..."}</Button>
                        </>
                    ) : (
                        <>
                            <h3 className='text-xl m-0 font-medium'>Tus tokens han sido enviados!</h3>
                            <p>Ver transaccion en Algoexplorer <IconExternalLink/> </p>
                        </>
                    )
                }
            </div>
            <img src="finguru_token.png" alt='finguru token' className='w-[80px] h-[80px]'/>
            </section>
            <section>
                {
                    !isLoading ? articles.map((article, index) => (
                        <Article key={index} {...article} />
                    )) : Array.from({length: 5}).map((_, index) => (
                        <Skeleton key={index} height={160} width={loadingWidth} className="mb-6" />
                    ))
                }
            </section>
        </>
    )
}