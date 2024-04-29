import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");
  const s3Client = new S3Client({ region: process.env.AWS_REGION });
  const fileName = req.headers.get("filename")!;
  const fileData = await req.arrayBuffer();
  const buffer = await Buffer.from(fileData);
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileName,
    Body: buffer,
    ContentType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    Metadata: {
      userId: userId,
    },
  });
  try {
    await s3Client.send(command);
  } catch (error) {
    console.log("There was an error", error);
  }
  return new Response(JSON.stringify({ message: "Success!", fileName }), {
    status: 200,
  });
}
