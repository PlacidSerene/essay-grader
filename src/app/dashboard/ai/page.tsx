"use client";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";

const Page = () => {
  const {
    data: responseData,
    isLoading,
    isSuccess,
  } = trpc.getAiResponse.useQuery();

  if (isLoading) {
    console.log("loading");
  }
  if (isSuccess && responseData) {
    console.log(responseData);
  }
  return (
    <div>
      <h1 className="text-gray-700">Test the AI model</h1>
      <h3></h3>
    </div>
  );
};

export default Page;
