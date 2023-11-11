"use client";
import React from "react";
import { SnackbarProvider } from "notistack";
import {
  PROVIDER_ID,
  ProvidersArray,
  WalletProvider,
  useInitializeProviders,
  useWallet,
} from "@txnlab/use-wallet";
import { DeflyWalletConnect } from "@blockshake/defly-connect";
import { DaffiWalletConnect } from "@daffiwallet/connect";
import { PeraWalletConnect } from "@perawallet/connect";
//import { WalletConnectModalSign } from "@walletconnect/modal-sign-html";
//import algosdk from "algosdk";
import { getAlgodConfigEnvironment } from "@/utils/network/getClientConfigs";

let providersArray: ProvidersArray;
if (process.env.NEXT_PUBLIC_ALGOD_NETWORK === "") {
  providersArray = [{ id: PROVIDER_ID.KMD }];
} else {
  providersArray = [
    { id: PROVIDER_ID.DEFLY, clientStatic: DeflyWalletConnect },
    { id: PROVIDER_ID.PERA, clientStatic: PeraWalletConnect },
    { id: PROVIDER_ID.DAFFI, clientStatic: DaffiWalletConnect },
    /*
    {
      id: PROVIDER_ID.WALLETCONNECT,
      //clientStatic: WalletConnectModalSign,
      clientStatic: "",
      clientOptions: {
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID || "",
        metadata: {
          name: "Example Dapp",
          description: "Example Dapp",
          url: "#",
          icons: ["https://walletconnect.com/walletconnect-logo.png"],
        },
      },
    },*/
    // { id: PROVIDER_ID.MYALGO, clientStatic: DaffiWalletConnect },
    // If you are interested in WalletConnect v2 provider
    // refer to https://github.com/TxnLab/use-wallet for detailed integration instructions
  ];
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const algodConfig = getAlgodConfigEnvironment();

  /*const walletProviders = useInitializeProviders({
    providers: providersArray,
    nodeConfig: {
      network: algodConfig.network,
      nodeServer: algodConfig.server,
      nodePort: String(algodConfig.port),
      nodeToken: String(algodConfig.token),
    },
    //algosdkStatic: algosdk,
    algosdkStatic: algosdk,
  });*/

  return (
    <SnackbarProvider maxSnack={3}>
      {children}
      {/*<WalletProvider value={walletProviders}>{children}</WalletProvider>*/}
    </SnackbarProvider>
  );
}
