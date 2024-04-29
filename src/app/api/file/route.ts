import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { essay, topic } = await req.json();
  console.log(essay, topic);
  const res = await fetch(
    "https://iqi2bf7vv6xy3dqdkkecg6sodq0dyrxk.lambda-url.ap-southeast-1.on.aws/",
    {
      method: "POST",
      body: JSON.stringify({
        essay: essay,
        topic: topic,
      }),
    }
  );
  const resData = await res.json();
  if (res.status === 200) {
    return NextResponse.json({ fileId: resData.file }, { status: 201 });
  }
  return NextResponse.json({ error: "Something is wrong" }, { status: 400 });
}
