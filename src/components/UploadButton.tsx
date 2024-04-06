"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Dropzone, DropzoneProps, MS_WORD_MIME_TYPE } from "@mantine/dropzone";
import { File, FileX, FileCheck } from "lucide-react";
import { absoluteUrl, getFileUrl } from "@/lib/utils";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "./ui/use-toast";
import type { FileWithPath } from "@mantine/dropzone";
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
      multiple={false}
      onDrop={async (file) => {
        setAcceptedFiles(file);
        const response = await fetch(absoluteUrl("/api/upload"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filename: file[0].name,
            contentType: file[0].type,
          }),
        });
        if (response.ok) {
          const { url, fields, key } = await response.json();

          const formData = new FormData();
          Object.entries(fields).forEach(([key, value]) => {
            formData.append(key, value as string);
          });
          formData.append("file", file[0]);
          const uploadResponse = await fetch(url, {
            method: "POST",
            body: formData,
          });

          if (uploadResponse.ok) {
            alert("Upload successful!");
            try {
              await createFile({
                key: key,
                name: file[0].name,
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
        <label
          htmlFor="dropzone-file"
          className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100"
        >
          <Dropzone.Accept>
            <FileCheck className="h-8 w-8" />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <FileX className="h-8 w-8" />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <File className="h-8 w-8" />
          </Dropzone.Idle>
          <h3 className="font-medium text-zinc-800">
            Drag images here or click to select files
          </h3>
          <p className="text-sm text-zinc-500">
            (You can attach multiple files, each up to 1MB)
          </p>
        </label>
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
