"use client";

import * as React from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { SingleImageDropzone } from "../utils/single-image-dropzone";
import { addUserImage } from "@/lib/actions/profile/actions";
import { useSession } from "next-auth/react";
import { toast } from "../ui/use-toast";

export default function UploadFile() {
  const [file, setFile] = React.useState<File>();
  const [progress, setProgress] = React.useState(0);
  const { edgestore } = useEdgeStore();
  const { data: session, update } = useSession();

  return (
    <div>
      <SingleImageDropzone
        width={200}
        height={200}
        value={file}
        onChange={(file) => {
          setFile(file);
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
              update({
                ...session,
                user: { ...session?.user, photo: res.url },
              });
            } else {
              toast({
                variant: "destructive",
                title: "Error",
                description: resAction?.status,
              });
            }
          }
        }}
      >
        Upload
      </button>
    </div>
  );
}
