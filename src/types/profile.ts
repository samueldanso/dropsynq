export interface ZoraProfile {
  address: `0x${string}`;
  handle?: string;
  displayName?: string;
  bio?: string;
  avatar?: {
    small: string;
    medium: string;
    blurhash?: string;
  };
  publicWallet: {
    address: `0x${string}`;
  };
}
