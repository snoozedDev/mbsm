"use client";
import { cn } from "@/lib/utils";
import { useUploadFileMutation, useUserMeQuery } from "@/queries/userQueries";
import { ExternalLink, Info, Upload } from "lucide-react";
import Image from "next/image";
import { forwardRef, useId, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AvatarPrimitive } from "../account-avatar";
import { Modal } from "../modal";
import { useModals } from "../modals-layer";
import { trpc } from "../query-layout";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { EditImageModal } from "./EditImageModal";

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
  const { data } = useUserMeQuery();
  const account = data?.accounts.find((a) => a.handle === handle);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [newAvatarFile, setNewAvatarFile] = useState<File | undefined>(
    undefined
  );
  const [shouldRemoveAvatar, setShouldRemoveAvatar] = useState(false);
  const { uploadFile } = useUploadFileMutation();
  const utils = trpc.useUtils();
  const isNewAvatarGif = useMemo(() => {
    return newAvatarFile?.type.includes("gif");
  }, [newAvatarFile]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    if (newAvatarFile && account) {
      try {
        await uploadFile({
          file: newAvatarFile,
          options: {
            type: "avatar",
            accountId: account.id,
            fileDetails: {
              type: newAvatarFile.type,
              sizeKB: newAvatarFile.size / 1024,
            },
          },
        });
        utils.user.me.refetch();
        utils.user.settings.refetch();
        setShouldClose(true);
      } catch (e) {
        console.error({ e });
      } finally {
        setIsLoading(false);
      }
    }
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
                <Image
                  unoptimized
                  alt="New avatar"
                  src={URL.createObjectURL(newAvatarFile)}
                  className="h-20 w-20 rounded-lg"
                  width={80}
                  height={80}
                />
              ) : (
                <AvatarPrimitive
                  src={shouldRemoveAvatar ? null : account.avatar?.url}
                  alt={`Avatar for @${account.handle}`}
                  fallback={account.handle.substring(0, 2)}
                  size="lg"
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
                    if (image.type.includes("gif")) {
                      setNewAvatarFile(image);
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
          {isNewAvatarGif && (
            <Alert className="mt-4">
              <Info className="h-4 w-4" />
              <AlertTitle>About gifs</AlertTitle>
              <AlertDescription>
                Gifs will be uploaded as-is and will not be cropped or resized.
                If you want to please use a tool like{" "}
                <OutsideLink
                  href="https://ezgif.com/crop"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline"
                >
                  ezgif
                </OutsideLink>
              </AlertDescription>
            </Alert>
          )}
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

const OutsideLink = forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(function OutsideLink({ children, ...props }, ref) {
  return (
    <a
      ref={ref}
      target="_blank"
      rel="noreferrer"
      className="text-primary underline"
      {...props}
    >
      <span>{children}</span>
      <ExternalLink className="w-[1em] h-[1em] align-text-top ml-[.25em] inline" />
    </a>
  );
});
