import { absoluteUrl } from "../utils";

export const uploadFileToServer = async (
  fileName: string,
  fileData: ArrayBuffer
) => {
  try {
    const reponse = await fetch(absoluteUrl("/api/upload"), {
      method: "POST",
      body: fileData,
      headers: {
        "Content-Type": "application/octet-stream", // Raw binary data
        filename: fileName, // Include filename in header
      },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};
