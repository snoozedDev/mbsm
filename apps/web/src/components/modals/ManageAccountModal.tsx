import { cn } from "@/lib/utils";
import { useUserMeQuery } from "@/queries/userQueries";
import { Upload } from "lucide-react";
import { useId, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AccountAvatar } from "../account-avatar";
import { Modal } from "../modal";
import { useModals } from "../modals-layer";
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
  const [shouldClose, setShouldClose] = useState(false);
  const [fileInputActive, setFileInputActive] = useState(false);
  const avatarInputId = useId();
  const { data } = useUserMeQuery();
  const account = data?.accounts.find((a) => a.handle === handle);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [newAvatar, setNewAvatar] = useState<string | undefined>(undefined);

  const hasChanges = useMemo(() => {
    return !!newAvatar;
  }, [newAvatar]);

  return (
    <Modal dismissable={false} shouldClose={shouldClose} id={id}>
      {account ? (
        <div className="@container">
          <div className="flex flex-col @sm:flex-row mt-4">
            <div className="flex flex-col items-center">
              {newAvatar ? (
                <img src={newAvatar} className="h-20 w-20 rounded-lg" />
              ) : (
                <AccountAvatar
                  className="h-20 w-20 text-3xl"
                  account={account}
                />
              )}
              {newAvatar ? (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setNewAvatar(undefined)}
                >
                  Clear
                </Button>
              ) : account.avatar ? (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setNewAvatar(undefined)}
                >
                  Remove
                </Button>
              ) : null}
            </div>
            <div className="flex-1 mt-4 @sm:mt-0 @sm:ml-4 flex">
              <div
                className={cn(
                  "relative h-min-32 w-full rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer text-muted-foreground p-4 text-center",
                  fileInputActive ? "border-muted-foreground" : ""
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
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
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
                        allowCrop={false}
                        onSubmit={(img) => setNewAvatar(img)}
                        allowHotspot={false}
                        image={image}
                        aspectRatio={1}
                      />
                    ));
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <Button variant="secondary" onClick={() => setShouldClose(true)}>
              Cancel
            </Button>
            <Button disabled={!hasChanges}>Save Changes</Button>
          </div>
        </div>
      ) : (
        <div />
      )}
    </Modal>
  );
};
