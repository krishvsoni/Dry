import { useState } from 'react';
import Web3 from 'web3';

interface PolygonWalletProps {
  address: string;
  privateKey: string;
}

function PolygonWallet({ address, privateKey }: PolygonWalletProps) {
  const [balance, setBalance] = useState<string | null>(null);
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [transactionHash, setTransactionHash] = useState<string>('');

  const web3 = new Web3(new Web3.providers.HttpProvider('https://rpc-mainnet.maticvigil.com'));

  const getBalance = async () => {
    try {
      const bal = await web3.eth.getBalance(address);
      setBalance(web3.utils.fromWei(bal, 'ether'));
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const sendTransaction = async () => {
    try {
      const tx = await web3.eth.accounts.signTransaction(
        {
          to: recipientAddress,
          value: web3.utils.toWei(amount, 'ether'),
          gas: '21000', 
        },
        privateKey
      );

      const receipt = await web3.eth.sendSignedTransaction(tx.rawTransaction);
      setTransactionHash(receipt.transactionHash.toString()); 
      getBalance();
    } catch (error) {
      console.error('Error sending transaction:', error);
    }
  };

  return (
    <div>
      <h2>Polygon Wallet</h2>
      <p>Address: {address}</p>
      <p>Balance: {balance} MATIC</p>
      <input type="text" placeholder="Recipient Address" value={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)} />
      <input type="text" placeholder="Amount (MATIC)" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button onClick={sendTransaction}>Send Transaction</button>
      {transactionHash && <p>Transaction Hash: {transactionHash}</p>}
    </div>
  );
}

export default PolygonWallet;
