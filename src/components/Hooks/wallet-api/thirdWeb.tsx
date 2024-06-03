import { createThirdwebClient } from "thirdweb";
import { useConnect } from "thirdweb/react";
import { createWallet, injectedProvider } from "thirdweb/wallets";
 
const client = createThirdwebClient({ clientId });
 
function Example() {
  const { connect, isConnecting, error } = useConnect();
  return (
    <button
      onClick={() =>
        connect(async () => {
          const metamask = createWallet("io.metamask"); // pass the wallet id
 
          // if user has metamask installed, connect to it
          if (injectedProvider("io.metamask")) {
            await metamask.connect({ client });
          }
 
          // open wallet connect modal so user can scan the QR code and connect
          else {
            await metamask.connect({
              client,
              walletConnect: { showQrModal: true },
            });
          }
 
          // return the wallet
          return metamask;
        })
      }
    >
      Connect
    </button>
  );
}