import { S3Client } from "@aws-sdk/client-s3";

const region = process.env.AWS_REGION!; // Replace with your region
const accessKeyId = process.env.AWS_ACCESS_KEY_ID!; // Replace with your key
const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!; // Replace with your secret

const s3Client = new S3Client({ region: process.env.AWS_REGION });

export default s3Client;
