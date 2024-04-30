import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Metadata } from "next";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  if (process.env.PRODUCTION_URL)
    return `https://${process.env.PRODUCTION_URL}${path}`;
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

export function constructMetadata({
  title = "Chirp - the grader for IELTS teachers",
  description = "Chirp is an open-source software to help grading IELTS essay easy.",
  image = "/thumbnail.png",
  icons = "/favicon.ico",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    icons,
    metadataBase: new URL("https://essay-grader-wheat.vercel.app/"),
    // themeColor: "#FFF",
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
