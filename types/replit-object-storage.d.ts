declare module "@replit/object-storage" {
  export class Client {
    uploadFromBytes(key: string, data: Buffer | Uint8Array): Promise<void>;
    downloadAsBytes(key: string): Promise<{ ok: boolean; value: Buffer }>;
  }
}
