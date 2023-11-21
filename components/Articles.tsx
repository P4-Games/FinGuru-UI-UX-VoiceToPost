"use client";
import React, { useState, useEffect } from "react";
import { Article } from "./Article";
import { getUserArticles } from "@/utils/articles";
import { getToken, getUsername, getUsernameFromToken } from "@/utils/login";
import Skeleton from "react-loading-skeleton";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { IconExternalLink } from "@tabler/icons-react";
import Image from "next/image";
import algosdk from "algosdk";
import * as algokit from "@algorandfoundation/algokit-utils";
import { useWallet } from "@txnlab/use-wallet";
import { getAlgodConfigEnvironment } from "../utils/network/getClientConfigs";
import { useSnackbar } from "notistack";

const URL = "https://finguru-back-voicetopost-qj44in647a-uc.a.run.app";

export const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingWidth, setLoadingWidth] = useState<number>(0);
  const [tokens, setTokens] = useState<number>(0);
  const { signer, activeAddress, signTransactions, sendTransactions } =
    useWallet();
  const algodConfig = getAlgodConfigEnvironment();
  const algodClient = algokit.getAlgoClient({
    server: algodConfig.server,
    port: algodConfig.port,
    token: algodConfig.token,
  });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getUserArticles(getUsername()).then((articles) => {
      setArticles(articles);
      setIsLoading(false);
    });

    if (typeof window !== "undefined") {
      setLoadingWidth(window.innerWidth - 60);
    }
  }, []);

  useEffect(() => {
    if (articles.length > 0) {
      setTokens(
        articles.reduce(
          (acc, article) => acc + parseInt(article.visits + ""),
          0
        )
      );
    }
  }, [articles]);

  const checkAssetOptIn = async (address: string | undefined) => {
    if (address) {
      const accountInfo = await algodClient.accountInformation(address).do();
      if (accountInfo) {
        const asset = accountInfo.assets.find(
          (asset: any) => (asset["asset-id"] == 481109569 || asset["asset-id"] == "481109569")
        );
        if (asset) return true;
      }
    }
    return false;
  };

  const optInAsset = async () => {
    // account needs a min amount of Algo to opt-in the asset successfully
    // opt-in is simply a 0 amount transfer of the asset to oneself
    if (activeAddress) {
      const suggestedParams = await algodClient.getTransactionParams().do();

      // has to be of type asset transfer also for future transactions you can just change the amount
      const optInTxn =
        algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: activeAddress,
          to: activeAddress,
          suggestedParams,
          assetIndex: 481109569,
          amount: 0,
        });

      const encodedTransaction = algosdk.encodeUnsignedTransaction(optInTxn);

      const signedTransactions = await signTransactions([encodedTransaction]);

      const waitRoundsToConfirm = 4;

      try {
        enqueueSnackbar("Sending transaction...", { variant: "info" });
        const { id } = await sendTransactions(
          signedTransactions,
          waitRoundsToConfirm
        );
        enqueueSnackbar(`Transaction sent: ${id}`, { variant: "success" });
        // setReceiverAddress("");
      } catch (e) {
        enqueueSnackbar("Failed to send transaction", { variant: "error" });
      }
    } else {
      console.log("Pls connect wallet...");
    }
  };

  const claimTokens = async () => {
    try {
      enqueueSnackbar("Sending transaction...", { variant: "info" });

      // test body
      const body = {
        id: 21, // finguru user id
        address: activeAddress, // algo address
        viewsAmount: 800000, // token claim amount
      };

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Accept": "*/*",
        },
        body: JSON.stringify(body),
      };

      const response = await fetch(URL + "/views", options);
      const data = await response.json();
      console.log(data);
      //   enqueueSnackbar(`Transaction sent: ${id}`, { variant: "success" });
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Failed to claim tokens", { variant: "error" });
    }
  };

  const handleClaim = async () => {
    const hastOptedInAsset = await checkAssetOptIn(activeAddress);
    if (!hastOptedInAsset) {
      await optInAsset();
      await claimTokens();
    } else {
      await claimTokens();
    }
  };

  return (
    <>
      <section className="border-violet-700 bg-violet-100 border-4 rounded-lg w-full p-6 flex flex-row justify-between items-center my-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl m-0 font-medium">Reclamar tokens</h3>
          <p>Pendiente: {tokens} $NEWS</p>
          <Button
            className="bg-violet-700 mt-3"
            onClick={handleClaim}
            disabled={
              // tokens < 300
              false
            }
          >
            {
              // tokens < 300
              false
                ? "Min. 300 NEWS"
                : activeAddress
                ? "Reclamar"
                : "Conecta tu billetera"
            }
          </Button>
        </div>
        <Image
          src="/finguru_token.png"
          alt="finguru token"
          width={80}
          height={80}
        />
      </section>
      <section className="flex flex-col w-full gap-6">
        {!isLoading
          ? articles.map((article, index) => (
              <Article key={index} {...article} />
            ))
          : Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                height={160}
                width={loadingWidth}
                className="mb-6"
              />
            ))}
      </section>
    </>
  );
};
