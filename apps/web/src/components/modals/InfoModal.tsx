import { Info } from "lucide-react";
import { useState } from "react";
import { Modal } from "../modal";
import { Button } from "../ui/button";

export const InfoModal = ({
  id,
  title,
  children,
}: {
  id: string;
  title?: string;
  children: React.ReactNode;
}) => {
  const [shouldClose, setShouldClose] = useState(false);

  return (
    <Modal id={id} dismissable shouldClose={shouldClose}>
      {title && (
        <h2 className="text-2xl font-bold mb-4">
          <Info className="inline mr-2" />
          <span className="align-middle">{title}</span>
        </h2>
      )}
      {children}
      <div className="flex justify-end mt-4">
        <Button variant="secondary" onClick={() => setShouldClose(true)}>
          👍
        </Button>
      </div>
    </Modal>
  );
};
