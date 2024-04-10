"use client";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const Page = () => {
  const docs = [
    {
      uri: "https://essay-grader.s3.ap-southeast-1.amazonaws.com/Daniel_CV_2023.docx",
      fileType: "docx",
    },
  ];
  return (
    <div>
      <h1 className="text-gray-700">Test the AI model</h1>
      <DocViewer
        pluginRenderers={DocViewerRenderers}
        documents={docs}
        prefetchMethod="GET"
      />
      <img
        src="https://test-bucket-abcdr.s3.ap-southeast-1.amazonaws.com/54a5159838a2475a81c373609739a544.jpg"
        alt=""
        width={300}
        height={150}
      />
    </div>
  );
};

export default Page;
