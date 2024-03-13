import { cn } from "@/lib/utils";
import {
  ReactEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import ReactCrop, {
  PercentCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useResizeDetector } from "react-resize-detector";
import { Modal } from "../modal";
import { Button } from "../ui/button";

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
        width: 100,
        height: 100,
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
  id,
  allowCrop = false,
  allowHotspot = false,
  maxOutputWidth,
  image,
  aspectRatio,
  onSubmit,
  onDismiss,
}: {
  id: string;
  image: File;
  allowCrop?: boolean;
  allowHotspot?: boolean;
  maxOutputWidth?: number;
  aspectRatio?: number;
  onSubmit: (image: File) => void;
  onDismiss?: () => void;
}) => {
  const [shouldClose, setShouldClose] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [percentCrop, setPercentCrop] = useState<PercentCrop>();
  const [size, setSize] = useState<{ width: number; height: number }>();
  const [loadedImage, setLoadedImage] = useState<
    HTMLImageElement | undefined
  >();
  const { ref, height: maxHeight, width: maxWidth } = useResizeDetector();

  const max = useMemo(
    () => ({
      height: maxHeight ?? 320,
      width: maxWidth ?? 448,
    }),
    [maxHeight, maxWidth]
  );

  const displayedSize = useMemo(() => {
    if (!size) return undefined;
    const biggest = size.width > size.height ? "width" : "height";
    const smallest = size.width < size.height ? "width" : "height";

    let containScale = 1;

    containScale = Math.min(
      max[biggest] / size[biggest],
      max[smallest] / size[smallest]
    );

    return {
      height: size?.height * containScale,
      width: size?.width * containScale,
    };
  }, [max, size]);

  useEffect(() => {
    if (!displayedSize) return;
    const newCrop = centerAspectCrop(
      displayedSize.width,
      displayedSize.height,
      aspectRatio ?? 1
    );
    setPercentCrop(newCrop);
  }, [displayedSize]);

  const cropImageNow = useCallback(() => {
    if (!percentCrop || !loadedImage) return;

    const canvas = document.createElement("canvas");
    // x and y positions in narutal pixels
    let x = (percentCrop.x / 100) * loadedImage.naturalWidth;
    let y = (percentCrop.y / 100) * loadedImage.naturalHeight;
    // width and height size crop in natural pixels
    let naturalWidth = (percentCrop.width / 100) * loadedImage.naturalWidth;
    let naturalHeight = (percentCrop.height / 100) * loadedImage.naturalHeight;
    let width = naturalWidth;
    let height = naturalHeight;

    const maxAllowedScale = maxOutputWidth ? maxOutputWidth / width : 1;
    if (maxAllowedScale < 1) {
      width *= maxAllowedScale;
      height *= maxAllowedScale;
    }

    console.log({ maxOutputWidth, maxAllowedScale, width, height });

    canvas.width = width;
    canvas.height = height;
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

    const pixelRatio = window.devicePixelRatio;
    canvas.width *= pixelRatio;
    canvas.height *= pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      loadedImage,
      x,
      y,
      naturalWidth,
      naturalHeight,
      0,
      0,
      width,
      height
    );

    // scale it down (or up) to 300px
    // const scale = 300 / width;
    // canvas.width *= scale;
    // canvas.height *= scale;

    // ctx.setTransform(scale, 0, 0, scale, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], "image.jpg", {
        type: "image/png",
      });
      onSubmit(file);
      setShouldClose(true);
    }, "image/png");
  }, [percentCrop, loadedImage]);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => setImageSrc(e.target?.result as string);
    if (image) reader.readAsDataURL(image);
  }, [image]);

  const onImageLoad: ReactEventHandler<HTMLImageElement> = (image) => {
    if (image.target) {
      const { height, width } = image.currentTarget;
      setLoadedImage(image.currentTarget);
      setSize({ width, height });
      const newCrop = centerAspectCrop(width, height, aspectRatio ?? 1);
      setPercentCrop(newCrop);
    }
  };

  const s = size ?? { width: 0, height: 0 };

  const wScale = s.width ? 100 / (percentCrop?.width ?? 100) : 1;
  const hScale = s.height ? 100 / (percentCrop?.height ?? 100) : 1;

  const left = -(percentCrop?.x ?? 0) * wScale;
  const top = -(percentCrop?.y ?? 0) * hScale;

  return (
    <Modal shouldClose={shouldClose} id={id} dismissable={false}>
      <div
        ref={ref}
        className="flex flex-col items-center h-80 w-full justify-center"
      >
        <ReactCrop
          className={cn("select-none max-w-full")}
          aspect={aspectRatio}
          crop={percentCrop}
          onChange={(c, p) => {
            if (p.height === 0) return;
            setPercentCrop(p);
          }}
          style={{
            height: displayedSize?.height,
            width: displayedSize?.width,
          }}
        >
          <img
            src={imageSrc}
            onLoad={onImageLoad}
            className="max-w-full"
            style={{
              height: displayedSize?.height,
              width: displayedSize?.width,
            }}
          />
        </ReactCrop>
      </div>
      <div className="mt-4 flex justify-center items-center">
        <Button
          className="mr-4"
          variant="secondary"
          onClick={() => setShouldClose(true)}
        >
          Cancel
        </Button>
        <div className="relative h-20 w-20 overflow-hidden rounded-lg">
          <img
            src={imageSrc}
            className="absolute"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              scale: wScale === Infinity ? 1 : wScale,
              transformOrigin: "0 0",
            }}
          />
        </div>
        <Button className="ml-4" onClick={cropImageNow}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
};
