import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/frame-sdk';
import { User } from '../types';

export const useFarcaster = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  const initializeFarcaster = async () => {
    try {
      const context = await sdk.context;

      if (context?.user) {
        setUser({
          fid: context.user.fid,
          username: context.user.username,
          displayName: context.user.displayName,
          pfpUrl: context.user.pfpUrl
        });
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Failed to initialize Farcaster SDK:', error);
    } finally {
      setIsLoading(false);
    }
  };

  initializeFarcaster();
}, []);

  const composeCast = async (text: string) => {
    try {
      await sdk.actions.composeCast({
        text,
        embeds: ['https://farflag.xyz'], // ✅ string, não objeto
      });
    } catch (error) {
      console.error('Failed to compose cast:', error);
      throw error;
    }
  };

  const addMiniApp = async () => {
    try {
      await sdk.actions.addMiniApp();
    } catch (error) {
      console.error('Failed to add mini app:', error);
      throw error;
    }
  };

  const close = () => {
    sdk.actions.close();
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    composeCast,
    addMiniApp,
    close
  };
};
