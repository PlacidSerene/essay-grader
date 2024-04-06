import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { S3Client } from "@aws-sdk/client-s3";

import { z } from "zod";

const uploadSchema = z.object({
  filename: z.string(),
  contentType: z.string(),
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validatedData = uploadSchema.safeParse(data);
    if (!validatedData.success) {
      return Response.json({ error: validatedData.error.issues[0].message });
    }
    const { filename, contentType } = data;

    const client = new S3Client({ region: process.env.AWS_REGION });
    const key = crypto.randomUUID();
    const { url, fields } = await createPresignedPost(client, {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Conditions: [
        ["content-length-range", 0, 10485760], // up to 10 MB
        ["starts-with", "$Content-Type", contentType],
      ],
      Fields: {
        acl: "public-read",
        "Content-Type": contentType,
      },
      Expires: 600, // Seconds before the presigned post expires. 3600 by default.
    });

    return Response.json({ url, fields, key });
  } catch (error) {
    console.log(error);
    return Response.json({ error });
  }
}
