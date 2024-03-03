import { useUserMeQuery } from "@/queries/userQueries";
import { useAppDispatch } from "@/redux/hooks";
import { ModalPropsMap, addModal } from "@/redux/slices/modalSlice";
import { useId } from "react";
import { AccountAvatar } from "../account-avatar";
import { Modal } from "../modal";
import { Input } from "../ui/input";

export const ManageAccountModal = ({
  handle,
}: ModalPropsMap["manage_account"]) => {
  const avatarInputId = useId();
  const dispatch = useAppDispatch();
  const { data } = useUserMeQuery();
  const account = data?.accounts.find((a) => a.handle === handle);

  const renderContent = ({ close }: { close: () => void }) => {
    return account ? (
      <div>
        <AccountAvatar account={account} />
        <Input
          id={avatarInputId}
          type="file"
          multiple={false}
          onChange={(e) => {
            const image = e.target.files?.[0];
            if (!image) return;
            dispatch(
              addModal({
                id: "edit_image",
                props: {
                  inputId: avatarInputId,
                  allowHotspot: false,
                  allowCrop: false,
                  aspectRatio: 1,
                },
              })
            );
          }}
        />
      </div>
    ) : (
      <div />
    );
  };

  return (
    <Modal
      id="manage_account"
      title={`Manage @${handle}`}
      renderContent={renderContent}
    />
  );
};
