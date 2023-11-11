"use client";
import { getToken, getUsername, isLoggedIn, logout } from "@/utils/login";
import React, { useEffect } from "react";
import { IconLogout } from "./IconLogout";
import { useRouter } from "next/navigation";
import { useWallet } from "@txnlab/use-wallet";
import { useState } from "react";
import ConnectWallet from "@/components/ConnectWallet";
import { Button } from "@/components/ui/button";
import { ellipseAddress } from "@/utils/ellipseAddress";

export const Navbar = () => {
  const router = useRouter();
  const [username, setUsername] = React.useState<string>("");
  const [showArticles, setShowArticles] = React.useState<boolean>(false);
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false);
  const [openDemoModal, setOpenDemoModal] = useState<boolean>(false);
  const [appCallsDemoModal, setAppCallsDemoModal] = useState<boolean>(false);
  const { activeAddress } = useWallet();

  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal);
  };

  const toggleDemoModal = () => {
    setOpenDemoModal(!openDemoModal);
  };

  const toggleAppCallsModal = () => {
    setAppCallsDemoModal(!appCallsDemoModal);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleOpenArticles = () => router.push("/articles");
  const handleOpenNoteRecord = () => router.push("/note-record");

  useEffect(() => {
    if (isLoggedIn()) {
      let token = getToken();
      if (token) {
        const user = getUsername();
        if (user) {
          setUsername(user);
        } else {
          logout();
          router.push("/");
        }
      }
    } else {
      router.push("/");
    }

    if (typeof window !== "undefined") {
      if (window.location.pathname === "/note-record") {
        setShowArticles(false);
      } else {
        setShowArticles(true);
      }
    }
  }, [router]);

  return (
    <nav className="w-full bg-[#eee] flex flex-row items-center justify-between px-6 py-4 mb-6">
      <h3
        className="text-xl sm:text-3xl font-medium text-left sm:text-center"
        onClick={handleOpenNoteRecord}
        onKeyDown={(e) => console.log(e)}
      >
        {username?.split(" ")?.[0] ?? ""}
      </h3>
      <section className="flex flex-row items-center gap-6">
        {!showArticles ? (
          <button
            className="flex flex-row items-center"
            onClick={handleOpenArticles}
          >
            Mis artículos
          </button>
        ) : (
          <button
            className="flex flex-row items-center"
            onClick={handleOpenNoteRecord}
          >
            Grabar nota
          </button>
        )}
        <div>
          {/*<Button
            className="bg-violet-700"
            data-test-id="connect-wallet"
            onClick={toggleWalletModal}
          >
            {activeAddress
              ? ellipseAddress(activeAddress, 4)
              : "Connect Wallet"}
          </Button>*/}

          {/* {activeAddress && (
            <button
              data-test-id="transactions-demo"
              className="btn m-2"
              onClick={toggleDemoModal}
            >
              Transact
            </button>
          )}

          {activeAddress && (
            <button
              data-test-id="appcalls-demo"
              className="btn m-2"
              onClick={toggleAppCallsModal}
            >
              Contract Interaction
            </button>
          )} */}
        </div>

        <div onClick={handleLogout} onKeyDown={(e) => e.preventDefault()}>
          <IconLogout />
        </div>
      </section>
      {/*<ConnectWallet
        openModal={openWalletModal}
        closeModal={toggleWalletModal}
      />*/}
      {/* <Transact openModal={openDemoModal} setModalState={setOpenDemoModal} />
              <AppCalls
                openModal={appCallsDemoModal}
                setModalState={setAppCallsDemoModal}
              /> */}
    </nav>
  );
};
