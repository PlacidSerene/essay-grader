import { absoluteUrl } from "../utils";

export const uploadFileToServer = async (
  fileName: string,
  fileData: ArrayBuffer
) => {
  try {
    await fetch(absoluteUrl("/api/upload"), {
      method: "POST",
      body: fileData,
      headers: {
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
