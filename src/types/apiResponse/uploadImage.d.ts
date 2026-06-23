export type uploadImageResponse = {
  signature: string;
  expire: number;
  token: string;
  folder: string;
  fileName: string;
  publicKey: string;
  urlEndpoint: string;
};
