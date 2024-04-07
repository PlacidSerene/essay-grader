"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Dropzone, DropzoneProps, MS_WORD_MIME_TYPE } from "@mantine/dropzone";
import { File, FileX, FileCheck, Loader2 } from "lucide-react";
import { absoluteUrl, getFileUrl } from "@/lib/utils";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "./ui/use-toast";
import type { FileWithPath } from "@mantine/dropzone";
import { Progress } from "./ui/progress";
const UploadDropzone = (props: Partial<DropzoneProps>) => {
  const [acceptedFiles, setAcceptedFiles] = useState<FileWithPath[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { mutate: createFile } = trpc.createFile.useMutation();
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
  };
  return (
    <Dropzone
      multiple={true}
      onDrop={async (files) => {
        setAcceptedFiles(files);
        setIsUploading(true);
        const progressInterval = startSimulateProgress();
        const response = await fetch(absoluteUrl("/api/upload"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filename: files[0].name,
            contentType: files[0].type,
          }),
        });
        if (response.ok) {
          const { url, fields, key } = await response.json();
          console.log(fields);
          const formData = new FormData();
          Object.entries(fields).forEach(([key, value]) => {
            formData.append(key, value as string);
          });

          files.forEach((file) => formData.append("file", file));
          console.log("after", formData);

          const uploadResponse = await fetch(url, {
            method: "POST",
            body: formData,
          });

          if (uploadResponse.ok) {
            alert("Upload successful!");
            try {
              await createFile({
                key: key,
                name: files[0].name,
              });
            } catch (error) {
              console.log(error);
            }
          } else {
            console.error("S3 Upload Error:", uploadResponse);
            alert("Upload failed.");
          }
        } else {
          alert("Failed to get pre-signed URL.");
        }
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
              Drag images here or click to select files
            </h3>
            <p className="text-sm text-zinc-500">
              (You can attach multiple files, each up to 1MB)
            </p>
          </div>
          {acceptedFiles.length > 0 ? (
            <div className="flex max-w-xs items-center divide-x divide-zinc-200 overflow-hidden rounded-md bg-white outline outline-[1px] outline-zinc-200">
              <div className="grid h-full place-items-center px-3 py-2">
                <File className="h-4 w-4 text-blue-500" />
              </div>
              <div className="h-full truncate px-3 py-2 text-sm">
                {acceptedFiles[0].name}
              </div>
            </div>
          ) : null}

          {isUploading ? (
            <div className="mx-auto mt-4 w-full max-w-xs">
              <Progress
                value={uploadProgress}
                className="h-1 w-full bg-zinc-200"
                indicatorColor={uploadProgress === 100 ? "bg-green-500" : ""}
              />
              {uploadProgress === 100 ? (
                <div className="flex items-center justify-center gap-1 pt-2 text-center text-sm text-zinc-700">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Redirecting...
                </div>
              ) : null}
            </div>
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
