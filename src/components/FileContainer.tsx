import React from "react";
import type { File } from "@/types/file";
import Link from "next/link";
import { Loader2, MessageSquare, Plus, Trash } from "lucide-react";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { trpc } from "@/app/_trpc/client";

interface FileContainerProps {
  file: File;
}
const FileContainer = ({ file }: FileContainerProps) => {
  const utils = trpc.useUtils();
  const { mutate: deleteFile, isPending } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate();
    },
  });
  return (
    <li
      key={file.id}
      className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
    >
      <Link href={`/dashboard/${file.id}`} className="flex flex-col gap-2">
        <div className="flex w-full items-center justify-between space-x-6 px-6 pt-6">
          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"></div>
          <div className="flex-1 truncate">
            <div className="flex items-center space-x-3">
              <h3 className="truncate text-lg font-medium text-zinc-900">
                {file.name}
              </h3>
            </div>
          </div>
        </div>
      </Link>
      <div className="mt-4 grid grid-cols-3 place-items-center gap-6 px-6 py-2 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {format(new Date(file.createdAt), "MMM yyyy")}
        </div>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          mocked
        </div>
        <Button
          size="sm"
          className="w-full"
          variant="destructive"
          onClick={() => deleteFile({ id: file.id })}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin text-red-500" />
          ) : (
            <Trash className="h-4 w-4 text-red-500" />
          )}
        </Button>
      </div>
    </li>
  );
};

export default FileContainer;
