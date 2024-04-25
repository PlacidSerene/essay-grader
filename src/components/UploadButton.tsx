"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Dropzone, DropzoneProps, MS_WORD_MIME_TYPE } from "@mantine/dropzone";
import { File, FileX, FileCheck, Loader2, Check } from "lucide-react";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "./ui/use-toast";
import { Progress } from "./ui/progress";
import { uploadFileToServer } from "@/lib/aws/uploadFileToServer";
import mammoth from "mammoth";
import { absoluteUrl, extractParagraphs } from "@/lib/utils";
import type { FileWithPath } from "@mantine/dropzone";

interface onDialogCloseHandlerProps {
  onDialogCloseHandler: () => void;
}
const UploadDropzone = (
  props: Partial<DropzoneProps> & onDialogCloseHandlerProps
) => {
  const utils = trpc.useUtils();
  const closeDialog = props.onDialogCloseHandler;
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [allFileUploaded, setAllFileUploaded] = useState(false);
  const [currentFileUpload, setCurrentFileUpload] =
    useState<null | FileWithPath>(null);
  const { mutate: createFile } = trpc.createFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate();
    },
  });
  // const { mutate: readFile } = trpc.readDocxFile.useMutation();
  const { toast } = useToast();
  const startSimulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 3;
      });
    }, 500);
    return interval;
  };
  return (
    <Dropzone
      disabled={isUploading}
      multiple={true}
      onDrop={async (files) => {
        setIsUploading(true);
        try {
          for (const file of files) {
            setCurrentFileUpload(file);
            const reader = new FileReader();
            const progressInterval = startSimulateProgress();

            await new Promise<void>((resolve, reject) => {
              reader.onload = async (event) => {
                try {
                  const binaryString = event.target?.result as ArrayBuffer;
                  const { value: data } = await mammoth.extractRawText({
                    arrayBuffer: binaryString,
                  });

                  const { topic, essay } = extractParagraphs(data);

                  const response = await fetch(absoluteUrl("/api/file"), {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      essay: essay,
                      topic: topic,
                    }),
                  });

                  if (!response.ok) {
                    throw new Error("Failed to upload file");
                  }

                  const { fileId } = await response.json();
                  await createFile({
                    key: fileId,
                    name: file.name,
                  });

                  console.log("File created!");
                  clearInterval(progressInterval);
                  resolve();
                } catch (error) {
                  console.error("Error processing file:", error);
                  clearInterval(progressInterval);
                  reject(error); // Reject the Promise to propagate the error
                }
              };
              reader.onerror = (error) => {
                console.error("Error reading file:", error);
                clearInterval(progressInterval);
                reject(error); // Reject the Promise in case of FileReader error
              };

              reader.readAsArrayBuffer(file);
            });
          }
        } catch (error) {
          console.error("Error processing files:", error);
          toast({
            title: "Something went wrong",
            description: "Please try again later",
            variant: "destructive",
          });
        }
        // setUploadProgress(100);
        // clearInterval(progressInterval);
        setIsUploading(false);
        closeDialog();
      }}
      onReject={(files) => {
        return toast({
          title: "Files are rejected",
          description: "Please try again later",
          variant: "destructive",
        });
      }}
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
                <div className="h-full truncate px-3 py-2 text-sm">
                  {uploadProgress === 100
                    ? "Upload complete!"
                    : `Uploading ${currentFileUpload?.name}`}
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

          {/* {allFileUploaded ? <h1>All files are uploaded</h1> : ""} */}
        </div>
      </div>
    </Dropzone>
  );
};

const UploadButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onDialogCloseHandler = () => setIsOpen(false);
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
        <UploadDropzone onDialogCloseHandler={onDialogCloseHandler} />
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;
