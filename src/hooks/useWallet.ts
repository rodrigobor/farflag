import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { sdk } from '@farcaster/frame-sdk';
import { MINT_CONFIG } from '../logic/gameLogic';

// USDC contract ABI (simplified for transfer)
const USDC_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

// USDC contract address on BASE
const USDC_CONTRACT_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

export const useWallet = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMinting, setIsMinting] = useState(false);

  const getProvider = useCallback(async () => {
    const rawProvider = await sdk.wallet.getEthereumProvider();
    if (!rawProvider) throw new Error('Ethereum provider not available');
    return new ethers.BrowserProvider(rawProvider);
  }, []);

  const getUSDCContract = useCallback(async (signer: ethers.Signer) => {
    return new ethers.Contract(USDC_CONTRACT_ADDRESS, USDC_ABI, signer);
  }, []);

  const checkUSDCBalance = useCallback(async (address: string): Promise<number> => {
    try {
      const provider = await getProvider();
      const contract = new ethers.Contract(USDC_CONTRACT_ADDRESS, USDC_ABI, provider);
      
      const balance = await contract.balanceOf(address);
      const decimals = await contract.decimals();
      
      return parseFloat(ethers.formatUnits(balance, decimals));
    } catch (error) {
      console.error('Failed to check USDC balance:', error);
      return 0;
    }
  }, [getProvider]);

  const mintScore = useCallback(async (score: number): Promise<string> => {
    setIsMinting(true);
    
    try {
      const provider = await getProvider();
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      
      const balance = await checkUSDCBalance(userAddress);
      if (balance < MINT_CONFIG.cost) {
        throw new Error(`Insufficient USDC balance. Required: ${MINT_CONFIG.cost} USDC, Available: ${balance.toFixed(2)} USDC`);
      }
      
      const usdcContract = await getUSDCContract(signer);
      const amount = ethers.parseUnits(MINT_CONFIG.cost.toString(), 6); // USDC has 6 decimals
      
      const transaction = await usdcContract.transfer(
        MINT_CONFIG.recipientAddress,
        amount
      );
      
      const receipt = await transaction.wait();
      
      if (receipt.status !== 1) {
        throw new Error('Transaction failed');
      }
      
      console.log('Mint successful:', {
        score,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber
      });
      
      return receipt.hash;
    } catch (error) {
      console.error('Mint failed:', error);
      throw error;
    } finally {
      setIsMinting(false);
    }
  }, [getProvider, getUSDCContract, checkUSDCBalance]);

  const connectWallet = useCallback(async (): Promise<string> => {
    setIsConnecting(true);
    
    try {
      const provider = await getProvider();
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      return address;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, [getProvider]);

  const switchToBase = useCallback(async () => {
  try {
    const provider = await getProvider();

    await provider.send('wallet_switchEthereumChain', [
      { chainId: '0x2105' }
    ]);
  } catch (error: any) {
    if (error.code === 4902) {
      const provider = await getProvider(); // chama de novo aqui no catch
      await provider.send('wallet_addEthereumChain', [
        {
          chainId: '0x2105',
          chainName: 'Base',
          nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18
          },
          rpcUrls: ['https://mainnet.base.org'],
          blockExplorerUrls: ['https://basescan.org']
        }
      ]);
    } else {
      throw error;
    }
  }
}, [getProvider]);


  return {
    isConnecting,
    isMinting,
    connectWallet,
    mintScore,
    checkUSDCBalance,
    switchToBase
  };
};
