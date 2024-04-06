import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  if (process.env.NEXT_PUBLIC_BASE_URL)
    return `https://${process.env.NEXT_PUBLIC_BASE_URL}${path}`;
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}

export function getFileUrl(key: string) {
  const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  return url;
}
