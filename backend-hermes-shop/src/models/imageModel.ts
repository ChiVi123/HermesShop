export interface Image {
  publicId: string;
  url: string;
  width: number;
  height: number;
  bytes: number;
  thumbnail?: boolean;
  createdAt: number;
}
