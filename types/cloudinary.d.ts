declare module 'cloudinary' {
  export const v2: any;
}

export interface UploadApiResponse {
  asset_id: string;
  public_id: string;
  version: number;
  secure_url: string;
  // Add other common fields as needed
  [key: string]: any;
}
