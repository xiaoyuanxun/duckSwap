#!/usr/bin/env ts-node

import { ethers } from 'ethers';
import { CrossChainSwapTxs } from '../interface/ExecuteInterface';
// 创建一个新的钱包
function createNewWallet(): ethers.Wallet {
  const randomBytes = ethers.randomBytes(32);
  const wallet = new ethers.Wallet(randomBytes.toString());
  //console.log('New Wallet Address:', wallet.address);
  //console.log('New Wallet Private Key:', wallet.privateKey);
  return wallet;
}

// 通过私钥获取一个钱包对象
function getWalletFromPrivateKey(privateKey: string): ethers.Wallet {
  const wallet = new ethers.Wallet(privateKey);
  console.log('Wallet Address:', wallet.address);
  return wallet;
}

// 批量发送签名交易
async function sendCrossChainSwapTransactions(
  wallet: ethers.Wallet,
  executeTxs: CrossChainSwapTxs,
  isBounce?: boolean
): Promise<void> {
  for (const tx of executeTxs.txs) {
    const transaction = {
      to: tx.to,
      value: ethers.parseEther(tx.value.toString()),
      gasLimit: "21000", // 设置Gas Limit
      gasPrice: await provider.gasPrice(), // 获取当前Gas Price
    };

    const signedTx = await wallet.signTransaction(transaction);
    const txResponse = await provider.sendTransaction(signedTx);
    console.log('Transaction Hash:', txResponse.hash);
    await txResponse.wait();
    console.log('Transaction Confirmed:', txResponse.hash);
  }
}

