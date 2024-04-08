"use client";
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button, buttonVariants } from "./ui/button";
import { Dropzone, DropzoneProps, MS_WORD_MIME_TYPE } from "@mantine/dropzone";
import { File, FileX, FileCheck, Loader2, Check } from "lucide-react";
import { absoluteUrl, getFileUrl } from "@/lib/utils";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "./ui/use-toast";
import type { FileWithPath } from "@mantine/dropzone";
import { Progress } from "./ui/progress";
import { uploadFileToServer } from "@/lib/aws/uploadFileToServer";
import { useRouter } from "next/navigation";
import Link from "next/link";

const UploadDropzone = (props: Partial<DropzoneProps>) => {
  const router = useRouter();
  const utils = trpc.useUtils();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { mutate: createFile } = trpc.createFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate();
    },
  });
  const { toast } = useToast();
  const startSimulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 5;
      });
    }, 500);
    return interval;
  };

  return (
    <Dropzone
      activateOnClick={uploadProgress !== 100}
      disabled={isUploading}
      multiple={true}
      onDrop={async (files) => {
        setIsUploading(true);
        const progressInterval = startSimulateProgress();
        for (const file of files) {
          const reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.onload = async (event) => {
            const fileData = event.target?.result as ArrayBuffer;
            // uploadPromises.push(uploadFileToServer(file.name, fileData));
            await uploadFileToServer(file.name, fileData);
            await createFile({
              key: file.name,
              name: file.name,
            });
          };
          reader.onerror = (error) => {
            console.log("Error reading file:", error);
          };
        }
        clearInterval(progressInterval);
        setUploadProgress(100);
        const fileNames = files.map((file) => file.name);

        console.log("after polling");
        // upload each file one by one
      }}
      onReject={(files) => console.log("rejected files", files)}
      maxSize={1 * 1024 ** 2}
      accept={MS_WORD_MIME_TYPE}
      {...props}
    >
      <div className="m-4 h-64 rounded-lg border border-dashed border-gray-300">
        <div className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pb-6 pt-5">
            <Dropzone.Accept>
              <FileCheck className="h-6 w-6" />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <FileX className="h-6 w-6" />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <File className="h-6 w-6" />
            </Dropzone.Idle>
            <h3 className="font-medium text-zinc-800">
              Drag files here or click to select files
            </h3>
            <p className="text-sm text-zinc-500">
              (You can attach multiple files, each up to 1MB)
            </p>
          </div>

          {isUploading ? (
            <>
              <div className="flex max-w-xs items-center divide-x divide-zinc-200 overflow-hidden rounded-md bg-white outline outline-[1px] outline-zinc-200">
                <div className="grid h-full place-items-center px-3 py-2">
                  <Check className="h-4 w-4 text-blue-500" />
                </div>
                <div className="h-full truncate px-3 py-2 text-sm">
                  {uploadProgress === 100
                    ? "Upload complete!"
                    : "Uploading your files ..."}
                </div>
              </div>
              <div className="mx-auto mt-4 w-full max-w-xs">
                <Progress
                  value={uploadProgress}
                  className="h-1 w-full bg-zinc-200"
                  indicatorColor={uploadProgress === 100 ? "bg-green-500" : ""}
                />
              </div>
            </>
          ) : null}
        </div>
      </div>
    </Dropzone>
  );
};

const UploadButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button>Upload PDF</Button>
      </DialogTrigger>

      {/* <DialogContent></DialogContent> */}
      <DialogContent>
        <UploadDropzone />
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;
