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
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { navItems } from "@/constants/navigation";
import useDocumentScroll from "@/hooks/useDocumentScroll";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const Navbar = () => {
  const router = useRouter();
  const [username, setUsername] = React.useState<string>("");
  const [showArticles, setShowArticles] = React.useState<boolean>(false);
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false);
  const [openDemoModal, setOpenDemoModal] = useState<boolean>(false);
  const [appCallsDemoModal, setAppCallsDemoModal] = useState<boolean>(false);
  const { activeAddress } = useWallet();
  const { currentScrollTop, previousScrollTop } = useDocumentScroll();
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    if (currentScrollTop > previousScrollTop) {
      setShowNav(false);
    } else {
      setShowNav(true);
    }
  }, [currentScrollTop, previousScrollTop]);

  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal);
  };

  // const toggleDemoModal = () => {
  //   setOpenDemoModal(!openDemoModal);
  // };

  // const toggleAppCallsModal = () => {
  //   setAppCallsDemoModal(!appCallsDemoModal);
  // };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // const handleOpenArticles = () => router.push("/articles");
  // const handleOpenNoteRecord = () => router.push("/note-record");

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
    <>
      <Disclosure
        as="nav"
        className={`bg-white shadow sticky flex transition-all duration-300 ease-in-out z-20 justify-center ${
          showNav ? "top-0" : "top-[-92px]"
        }`}
      >
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
              <div className="flex h-16 justify-between">
                <div className="flex">
                  <div className="-ml-2 mr-2 flex items-center md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                  <div className="flex flex-shrink-0 items-center">
                    <Image
                      className="h-8 w-auto"
                      src="/logo_fin.png"
                      alt="Your Company"
                      width={50}
                      height={50}
                    />
                  </div>
                  <div className="hidden md:ml-6 md:flex md:space-x-8">
                    {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                    {navItems.map((item, id) => (
                      <a
                        key={id}
                        href={item.href}
                        className={`inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 ${item.current}`}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Button
                      className="bg-violet-700"
                      data-test-id="connect-wallet"
                      onClick={toggleWalletModal}
                    >
                      {activeAddress
                        ? ellipseAddress(activeAddress, 4)
                        : "Connect Wallet"}
                    </Button>
                  </div>
                  <div className="hidden md:ml-4 md:flex md:flex-shrink-0 md:items-center">
                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          <UserCircleIcon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Your Profile
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Settings
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                // href="#"
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                                onClick={handleLogout}
                                onKeyDown={(e) => e.preventDefault()}
                              >
                                Sign out
                              </a>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
              </div>
            </div>
            <Disclosure.Panel className="md:hidden absolute top-[65px] left-0 bg-background w-full h-[100vh]">
              <div className="space-y-1 pb-3 pt-2">
                {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
                {navItems.map((item, id) => (
                  <Disclosure.Button
                    key={id}
                    as="a"
                    href={item.href}
                    className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6"
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
              <div className="border-t border-gray-200 pb-3 pt-4">
                <div className="flex items-center px-4 sm:px-6">
                  <div className="flex-shrink-0">
                    <UserCircleIcon
                      className="block h-6 w-6"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {username?.split(" ")?.[0] ?? ""}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      email@example.com
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Disclosure.Button
                    as="a"
                    href="#"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 sm:px-6"
                  >
                    Your Profile
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="a"
                    href="#"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 sm:px-6"
                  >
                    Settings
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="a"
                    // href="#"
                    onClick={handleLogout}
                    onKeyDown={(e) => e.preventDefault()}
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 sm:px-6"
                  >
                    Sign out
                  </Disclosure.Button>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <ConnectWallet
        openModal={openWalletModal}
        closeModal={toggleWalletModal}
      />
    </>
  );
};
