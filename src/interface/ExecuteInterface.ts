
import { ethers } from 'ethers';

export interface CrossChainSwapTxs 
{
    provider: ethers.Provider;
    txs: ethers.Transaction[]
}