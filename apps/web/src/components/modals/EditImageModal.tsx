import { ModalPropsMap } from "@/redux/slices/modalSlice";
import { ReactEventHandler, useEffect, useState } from "react";
import ReactCrop, {
  Crop,
  PercentCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Modal } from "../modal";

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export const EditImageModal = ({
  allowCrop,
  allowHotspot,
  inputId,
  aspectRatio,
}: ModalPropsMap["edit_image"]) => {
  const [shouldClose, setShouldClose] = useState(false);
  const [image, setImage] = useState<File | undefined>(undefined);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [crop, setCrop] = useState<Crop>();
  const [percentCrop, setPercentCrop] = useState<PercentCrop>();
  const [size, setSize] = useState<{ width: number; height: number }>();

  useEffect(() => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (!input?.files?.[0]) setShouldClose(true);
    else setImage(input.files?.[0]);
  }, []);

  useEffect(() => {
    console.log("hey", image);
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log(e.target?.result);
      setImageSrc(e.target?.result as string);
    };
    if (image) reader.readAsDataURL(image);
  }, [image]);

  console.log(percentCrop);

  const onImageLoad: ReactEventHandler<HTMLImageElement> = (image) => {
    if (image.target) {
      const { naturalWidth, naturalHeight } = image.currentTarget;
      setSize({ width: naturalWidth, height: naturalHeight });
      setCrop(centerAspectCrop(naturalWidth, naturalHeight, aspectRatio ?? 1));
    }
  };

  const renderContent = ({ close }: { close: () => void }) => {
    const wScale = size?.width ? 100 / (percentCrop?.width ?? 100) : 1;
    const hScale = size?.height ? 100 / (percentCrop?.height ?? 100) : 1;
    const left = -(percentCrop?.x ?? 0) * wScale;
    const top = -(percentCrop?.y ?? 0) * hScale;

    return (
      <div>
        <div className="flex justify-center">
          <ReactCrop
            className="select-none"
            aspect={aspectRatio}
            crop={crop}
            onComplete={(c, p) => setPercentCrop(p)}
            onChange={(c) => setCrop(c)}
          >
            <img src={imageSrc} onLoad={onImageLoad} />
          </ReactCrop>
        </div>

        <div className="relative h-20 w-20 overflow-hidden">
          <img
            src={imageSrc}
            className="absolute"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              scale: wScale,
              transformOrigin: "0 0",
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <Modal
      id="edit_image"
      shouldClose={shouldClose}
      title={`Edit Image`}
      renderContent={renderContent}
      dismissable={false}
    />
  );
};
