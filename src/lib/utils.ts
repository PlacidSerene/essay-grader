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
  const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}.docx`;
  return url;
}

export function extractParagraphs(text: string) {
  const paragraphs = text.split("\n");
  const topic = paragraphs[0];
  const topicIndex = topic.indexOf("Topic: ");
  let essayParagraph = "";
  let topicParagraph = "";
  for (let i = 1; i < paragraphs.length; i++) {
    essayParagraph += paragraphs[i] + "\n";
  }
  if (topicIndex !== -1) {
    topicParagraph = topic.slice(topicIndex + 7);
  } else {
    topicParagraph = topic;
  }
  return {
    topic: topicParagraph,
    essay: essayParagraph,
  };
}
