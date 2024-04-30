import ChatWrapper from "@/components/ChatWrapper";
import PdfRenderer from "@/components/PdfRenderer";
import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import React from "react";

interface PageProps {
  params: {
    fileid: string;
  };
}

const Page = async ({ params }: PageProps) => {
  //retrieve the file id
  const { fileid } = params;
  // make db call
  const { userId } = auth();

  if (!userId) redirect(`/auth-callback?origin=dashboard/${fileid}`);

  const file = await db.file.findFirst({
    where: {
      id: fileid,
      userId,
    },
  });

  if (!file) notFound();

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-1 flex-col justify-between">
      <div className="max-w-8xl mx-auto w-full grow lg:flex xl:px-2">
        {/* left side  */}
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-8">
            <PdfRenderer />
          </div>
        </div>

        {/* Right side */}
        <div className="flex-[0.75] shrink-0 border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          <ChatWrapper />
        </div>
      </div>
    </div>
  );
};

export default Page;
