"use client";

import * as React from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { SingleImageDropzone } from "../utils/single-image-dropzone";
import { addUserImage } from "@/lib/actions/profile/actions";
import { useSession } from "next-auth/react";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

export default function UploadFile() {
  const [file, setFile] = React.useState<File>();
  const [progress, setProgress] = React.useState(0);
  const { edgestore } = useEdgeStore();
  const { data: session, update } = useSession();
  const router = useRouter();
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif"];

  return (
    <div>
      <SingleImageDropzone
        width={200}
        height={200}
        value={file}
        onChange={(file) => {
          if (file) {
            if (file.size > MAX_FILE_SIZE) {
              toast({
                variant: "destructive",
                title: "File is too large",
                description: "Please upload a file smaller than 5MB.",
              });
              return;
            }
            if (!ALLOWED_FILE_TYPES.includes(file.type)) {
              toast({
                variant: "destructive",
                title: "Invalid file type",
                description: "Please upload a JPEG, PNG, or GIF image.",
              });
              return;
            }
            setFile(file);
          }
        }}
      />
      <div className="h-[6px] w-44 overflow-hidden rounded border">
        <div
          className="h-full bg-black transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>
      <button
        onClick={async () => {
          if (file) {
            const res = await edgestore.protectedFiles.upload({
              file,
              onProgressChange: (progress) => {
                setProgress(progress);
              },
              options: {
                replaceTargetUrl: session?.user?.image as string | undefined,
              },
            });
            const resAction = await addUserImage(res.url, session?.user.id);
            if (resAction?.status == 201) {
              toast({
                title: "Avatar dodany",
                variant: "default",
              });
              await update({
                ...session,
                user: { ...session?.user, image: res.url },
              });
              router.refresh();
            } else {
              toast({
                variant: "destructive",
                title: "Error",
                description: resAction?.message,
              });
            }
          }
        }}
      >
        Wyślij plik
      </button>
    </div>
  );
}
