import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { z } from "zod";

const uploadSchema = z.object({
  filename: z.string(),
  contentType: z.string(),
});

export async function POST(req: Request) {
  const s3Client = new S3Client({ region: process.env.AWS_REGION });
  const fileName = req.headers.get("filename")!;
  const fileData = await req.arrayBuffer();
  const buffer = await Buffer.from(fileData);
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileName,
    Body: buffer,
  });
  try {
    const response = await s3Client.send(command);
    console.log(response);
  } catch (error) {
    console.log("There was an error", error);
  }
  return Response.json({});
}
