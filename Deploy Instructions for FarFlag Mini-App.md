# Deploy Instructions for FarFlag Mini-App

## 🚀 Production Deployment Guide

### Prerequisites
- Domain: farflag.xyz
- SSL Certificate (HTTPS required)
- Farcaster account for manifest signing
- BASE network access for USDC transactions

### Step 1: Build the Application
```bash
cd farflag
npm install
npm run build
```

### Step 2: Deploy Static Files
Upload the `dist/` folder contents to your web server at farflag.xyz

### Step 3: Configure Farcaster Manifest
1. Generate account association signature:
```javascript
// Use Farcaster protocol tools to sign domain ownership
const signature = await signDomainOwnership({
  domain: 'farflag.xyz',
  fid: YOUR_FID,
  privateKey: YOUR_PRIVATE_KEY
});
```

2. Update `public/.well-known/farcaster.json` with real signature values

### Step 4: Verify Deployment
- [ ] https://farflag.xyz loads correctly
- [ ] https://farflag.xyz/.well-known/farcaster.json is accessible
- [ ] Meta tags are present in HTML source
- [ ] Application works in mobile viewport (424x695px)

### Step 5: Test in Farcaster
1. Create a cast with the farflag.xyz URL
2. Verify the embed appears correctly
3. Test the "🚩 Start" button launches the Mini-App
4. Test wallet connection and USDC transactions
5. Test cast composition and sharing

### Environment Variables (if needed)
```env
VITE_APP_URL=https://farflag.xyz
VITE_USDC_CONTRACT=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
VITE_RECIPIENT_ADDRESS=0x8eD01cfedAF6516A783815d67b3fd5Dedc31E18a
VITE_BASE_RPC=https://mainnet.base.org
```

### Troubleshooting
- **Embed not showing**: Check meta tags and manifest file
- **Mini-App not launching**: Verify HTTPS and domain configuration
- **Wallet issues**: Ensure BASE network is properly configured
- **USDC transactions failing**: Check contract address and user balance

### Performance Optimization
- Enable gzip compression
- Set proper cache headers for static assets
- Use CDN for flag images if needed
- Monitor Core Web Vitals

### Security Checklist
- [ ] HTTPS enabled
- [ ] Content Security Policy configured
- [ ] No sensitive data in client-side code
- [ ] Proper error handling for failed transactions
- [ ] Rate limiting for API endpoints (if any)

---

**Ready for Production**: The application is fully functional and ready for deployment to farflag.xyz

