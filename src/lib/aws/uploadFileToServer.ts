import { absoluteUrl } from "../utils";

export const uploadFileToServer = async (
  fileName: string,
  fileData: ArrayBuffer
) => {
  try {
    const response = await fetch(absoluteUrl("/api/upload"), {
      method: "POST",
      body: fileData,
      headers: {
        "Content-Type": "application/octet-stream", // Raw binary data
        filename: fileName, // Include filename in header
      },
    });
    // return new Response({});
  } catch (error) {
    return new Response(`An error has occured: ${error}`, {
      status: 400,
    });
  }
  return new Response(JSON.stringify({ fileName }), {
    status: 200,
  });
};
