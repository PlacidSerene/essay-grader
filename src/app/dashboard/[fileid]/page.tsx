"use client";
import { notFound } from "next/navigation";
import React from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { trpc } from "@/app/_trpc/client";

interface PageProps {
  params: {
    fileid: string;
  };
}

const Page = ({ params }: PageProps) => {
  //retrieve the file id
  const { fileid } = params;

  const { data, isError, error } = trpc.getFile.useQuery({
    id: fileid,
  });

  if (!data) notFound();

  const docs = [{ uri: data?.url, fileType: "docx" }];

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-1 flex-col justify-between">
      <div className="max-w-8xl mx-auto w-full grow lg:flex xl:px-2">
        <DocViewer
          pluginRenderers={DocViewerRenderers}
          documents={docs}
          prefetchMethod="GET"
        />
      </div>
    </div>
  );
};

export default Page;
