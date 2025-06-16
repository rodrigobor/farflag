import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ethers } from 'ethers';

const USDC_ADDRESS     = '0xD9AA2b31bF8e1183D6B90524a11e8C0F16c4B348';
const TO_ADDRESS       = '0x8eD01cfedAF6516A783815d67b3fd5Dedc31E18a';
const ABI              = ['function transfer(address to, uint256 amount) returns (bool)'];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(400).end();

  const body = req.body as any;

  // Etapa 1: solicitar calldata
  if (body?.requestContext && body.txHash == null) {
    const iface  = new ethers.Interface(ABI);
    const amount = ethers.parseUnits('0.10', 6);
    const data   = iface.encodeFunctionData('transfer', [TO_ADDRESS, amount]);

    return res.status(200).json({
      chainId: 8453,
      to:      USDC_ADDRESS,
      data
    });
  }

  // Etapa 2: txHash da tx assinado no Frame
  if (typeof body?.txHash === 'string') {
    console.log('Transação confirmada; hash:', body.txHash);
    return res.status(200).end();
  }

  return res.status(400).end();
}
