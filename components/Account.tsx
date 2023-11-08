import { useWallet } from "@txnlab/use-wallet";
import { useMemo } from "react";
import { ellipseAddress } from "@/utils/ellipseAddress";
import { getAlgodConfigEnvironment } from "../utils/network/getClientConfigs";

const Account = () => {
  const { activeAddress } = useWallet();
  const algoConfig = getAlgodConfigEnvironment();

  const dappFlowNetworkName = useMemo(() => {
    return algoConfig.network === ""
      ? "sandbox"
      : algoConfig.network.toLocaleLowerCase();
  }, [algoConfig.network]);

  return (
    <div>
      <a
        className="text-lg hover:underline-offset-2 hover:underline"
        target="_blank"
        href={`https://app.dappflow.org/setnetwork?name=${dappFlowNetworkName}&redirect=explorer/account/${activeAddress}/`}
      >
        Address: {ellipseAddress(activeAddress)}
      </a>
      <div className="text-md">
        Network: {algoConfig.network === "" ? "localnet" : algoConfig.network}
      </div>
    </div>
  );
};

export default Account;
