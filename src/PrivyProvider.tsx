import React from 'react';
import { PrivyProvider } from '@privy-io/react-auth';

interface PrivyWrapperProps {
  children: React.ReactNode;
}

export const PrivyWrapper: React.FC<PrivyWrapperProps> = ({ children }) => {
  return (
    <PrivyProvider
  appId="cmc42e1xp00a1kz0msxw5ajwo"
  config={{
    loginMethods: ['farcaster'],
    appearance: {
      theme: 'light',
      accentColor: '#3182ce',
    },
  }}
>
  {children}
</PrivyProvider>


  );
};
