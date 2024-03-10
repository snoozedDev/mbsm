"use client";
import { cn } from "@/lib/utils";
import { useUserMeQuery } from "@/queries/userQueries";
import { UploadClientPayload } from "@/utils/uploadUtils";
import { BlobError } from "@vercel/blob";
import { upload } from "@vercel/blob/client";
import axios from "axios";
import { Upload } from "lucide-react";
import { useId, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AccountAvatar } from "../account-avatar";
import { Modal } from "../modal";
import { useModals } from "../modals-layer";
import { trpc } from "../query-layout";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { EditImageModal } from "./EditImageModal";

const uploadFile = async ({
  file,
  payload,
  contentType,
}: {
  file: File;
  payload: UploadClientPayload;
  contentType?: string;
}) => {
  const blobUpload = () =>
    upload(file.name, file, {
      access: "public",
      handleUploadUrl: "/api/upload",
      clientPayload: JSON.stringify(payload),
      contentType,
    });

  try {
    const blob = await blobUpload();
    return blob;
  } catch (e) {
    if (e instanceof BlobError) {
      const refresh = await axios.get("/api/auth/refresh", {
        withCredentials: true,
        validateStatus: () => true,
      });

      if (refresh.status !== 200) {
        toast.error("Failed to authenticate user, are you logged in?");
        return undefined;
      }

      try {
        const blob = await blobUpload();
        return blob;
      } catch (e) {
        toast.error("Failed to upload file");
      }
    }
  }
  return undefined;
};

export const ManageAccountModal = ({
  handle,
  id,
}: {
  handle: string;
  id: string;
}) => {
  const { push } = useModals();
  const [isLoading, setIsLoading] = useState(false);
  const [shouldClose, setShouldClose] = useState(false);
  const [fileInputActive, setFileInputActive] = useState(false);
  const avatarInputId = useId();
  const { data, refetch } = useUserMeQuery();
  const account = data?.accounts.find((a) => a.handle === handle);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [newAvatarFile, setNewAvatarFile] = useState<File | undefined>(
    undefined
  );
  const [shouldRemoveAvatar, setShouldRemoveAvatar] = useState(false);
  const utils = trpc.useUtils();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    if (newAvatarFile && account) {
      try {
        const newBlob = await uploadFile({
          file: newAvatarFile,
          payload: {
            type: "avatar",
            accountId: account.id,
            fileDetails: {
              sizeKB: newAvatarFile.size / 1024,
            },
          },
        });
        if (newBlob) {
          utils.user.me.setData(undefined, (data) =>
            data
              ? {
                  ...data,
                  accounts: data.accounts.map((a) =>
                    a.handle === handle
                      ? {
                          ...a,
                          avatar: {
                            sizeKB: newAvatarFile.size / 1024,
                            url: newBlob.url,
                            createdAt: new Date().toISOString(),
                            id: newBlob.url,
                            metadata: null,
                          },
                        }
                      : a
                  ),
                }
              : data
          );
        }
      } catch (e) {
        console.error({ e });
      }
    }
    setIsLoading(false);
    setShouldClose(true);
  };

  const hasChanges = useMemo(() => {
    return !!newAvatarFile || shouldRemoveAvatar;
  }, [newAvatarFile, shouldRemoveAvatar]);

  return (
    <Modal
      dismissable={!hasChanges && !isLoading}
      shouldClose={shouldClose}
      id={id}
    >
      {account ? (
        <form onSubmit={onSubmit} className="@container">
          <div className="flex flex-col @sm:flex-row">
            <div className="flex w-20 self-center flex-col items-center">
              {newAvatarFile ? (
                <img
                  src={URL.createObjectURL(newAvatarFile)}
                  className="h-20 w-20 rounded-lg"
                />
              ) : (
                <AccountAvatar
                  className="h-20 w-20 text-3xl"
                  account={
                    shouldRemoveAvatar
                      ? {
                          ...account,
                          avatar: null,
                        }
                      : account
                  }
                />
              )}
              {newAvatarFile ? (
                <Button
                  variant="outline"
                  className="mt-4"
                  type="button"
                  disabled={isLoading}
                  onClick={() => setNewAvatarFile(undefined)}
                >
                  Clear
                </Button>
              ) : account.avatar && !shouldRemoveAvatar ? (
                <Button
                  variant="outline"
                  className="mt-4"
                  type="button"
                  disabled={isLoading}
                  onClick={() => setShouldRemoveAvatar(true)}
                >
                  Remove
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="mt-4"
                  type="button"
                  disabled={isLoading}
                  onClick={() => setShouldRemoveAvatar(false)}
                >
                  Reset
                </Button>
              )}
            </div>
            <div className="flex-1 mt-4 @sm:mt-0 @sm:ml-4 flex relative">
              <div
                className={cn(
                  "relative h-min-32 w-full rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer text-muted-foreground p-4 text-center",
                  fileInputActive ? "border-muted-foreground" : "",
                  isLoading ? "pointer-events-none select-none" : ""
                )}
              >
                <Upload />
                <label className="my-2 text-sm " htmlFor={avatarInputId}>
                  <p>
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs">SVG, PNG, JPG or GIF</p>
                </label>
                <Input
                  id={avatarInputId}
                  ref={avatarInputRef}
                  type="file"
                  disabled={isLoading}
                  className="absolute top-0 left-0 w-full h-full opacity-0 disabled:opacity-0 cursor-pointer"
                  onDragEnter={() => setFileInputActive(true)}
                  onFocus={() => setFileInputActive(true)}
                  onClick={() => setFileInputActive(true)}
                  onBlur={() => setFileInputActive(false)}
                  onDragLeave={() => setFileInputActive(false)}
                  onDrop={() => setFileInputActive(false)}
                  // multiple={false}
                  onChange={(e) => {
                    const image = e.target.files?.[0];
                    if (!image) {
                      toast.error("No image selected");
                      return;
                    }
                    if (image.type.split("/")[0] !== "image") {
                      toast.error("Invalid file type");
                      return;
                    }
                    e.target.value = "";
                    push(({ id }) => (
                      <EditImageModal
                        id={id}
                        allowCrop={true}
                        onSubmit={(img) => setNewAvatarFile(img)}
                        maxOutputWidth={300}
                        image={image}
                        onDismiss={() => {
                          setNewAvatarFile(undefined);
                        }}
                        aspectRatio={1}
                      />
                    ));
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <Button
              variant="secondary"
              disabled={isLoading}
              type="button"
              onClick={() => setShouldClose(true)}
            >
              Cancel
            </Button>
            <Button disabled={!hasChanges || isLoading} type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      ) : (
        <div />
      )}
    </Modal>
  );
};
