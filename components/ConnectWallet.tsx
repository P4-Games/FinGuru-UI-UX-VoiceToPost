import { Provider, useWallet } from "@txnlab/use-wallet";
import Account from "./Account";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ConnectWalletInterface {
  openModal: boolean;
  closeModal: () => void;
}

const ConnectWallet = ({ openModal, closeModal }: ConnectWalletInterface) => {
  const { providers, activeAddress } = useWallet();
  const isKmd = (provider: Provider) =>
    provider.metadata.name.toLowerCase() === "kmd";

  return (
    <dialog
      id="connect_wallet_modal"
      className={`bg-slate-200 absolute z-20 top-20 modal p-6 rounded-lg ${
        openModal ? "modal-open" : ""
      }`}
      style={{ display: openModal ? "block" : "none" }}
    >
      {!activeAddress && (
        <h3 className="font-semibold text-2xl mb-4">Select wallet provider</h3>
      )}
      <div className="flex flex-col gap-2 mb-4">
        {activeAddress && <Account />}

        {!activeAddress &&
          providers?.map((provider) => (
            <div
              data-test-id={`${provider.metadata.id}-connect`}
              className="flex gap-4 cursor-pointer font-medium p-1 hover:bg-slate-100 rounded-md"
              key={`provider-${provider.metadata.id}`}
              onClick={() => {
                return provider.connect();
              }}
            >
              {!isKmd(provider) && (
                <Image
                  alt={`wallet_icon_${provider.metadata.id}`}
                  src={provider.metadata.icon}
                  objectFit="contain"
                  width={30}
                  height={30}
                />
              )}
              <p className="text-center">
                {isKmd(provider) ? "LocalNet Wallet" : provider.metadata.name}
              </p>
            </div>
          ))}
      </div>

      <div className="flex flex-col gap-3">
        <Button
          data-test-id="close-wallet-modal"
          className=""
          onClick={() => {
            closeModal();
          }}
        >
          Close
        </Button>
        {activeAddress && (
          <Button
            className="bg-slate-600"
            data-test-id="logout"
            onClick={() => {
              if (providers) {
                const activeProvider = providers.find((p) => p.isActive);
                if (activeProvider) {
                  activeProvider.disconnect();
                } else {
                  // Required for logout/cleanup of inactive providers
                  // For instance, when you login to localnet wallet and switch network
                  // to testnet/mainnet or vice verse.
                  localStorage.removeItem("txnlab-use-wallet");
                  window.location.reload();
                }
              }
            }}
          >
            Disconnect
          </Button>
        )}
      </div>
    </dialog>
  );
};
export default ConnectWallet;
