import Jimp from "jimp";
import React, { useState } from "react";
import { ReactSortable, Sortable } from "react-sortablejs";
import css from "./ImageForm.module.scss";

interface Vector {
  x: number;
  y: number;
}

interface ImageUI {
  id: number;
  url: string;
  mode: "fit" | "fill";
  size: Vector;
  maxSize: Vector;
  offset: Vector;
  scale: number;
}

interface Row {
  id: string;
  disabled: boolean;
  images: ImageUI[];
}

export const ImageForm = () => {
  const [rows, setRows] = useState<Row[]>([]);
  let rowIndex = 0;

  const onImage = async (evt) => {
    const files = evt.target.files;

    if (files && files.length) {
      [...files].forEach((file) => {
        const fr = new FileReader();
        fr.onload = async () => {
          const image = await Jimp.read(fr.result as string);
          const imageView: ImageUI = {
            id: [...rows.map((row) => row.images.length), 0, 0].reduce(
              (total, num) => total + num
            ),
            size: {
              x: image.getWidth(),
              y: image.getHeight(),
            },
            maxSize: {
              x: 200,
              y: 200,
            },
            mode: "fill",
            offset: {
              x: 0,
              y: 0,
            },
            scale: 1,
            url: await image.getBase64Async(Jimp.MIME_PNG),
          };
          setRows(addToRows(imageView));
        };
        fr.readAsDataURL(file);
      });
    }
  };

  const addToRows = (newImage: ImageUI) => (currentRows: Row[]): Row[] => {
    const newImageId = [
      ...currentRows.map((row) => row.images.length),
      0,
      0,
    ].reduce((total, num) => total + num);
    const pureRows = currentRows.filter((row) => row.images.length);
    const lastPureRow = pureRows[pureRows.length - 1];
    if (currentRows.length && lastPureRow.images.length < 3) {
      currentRows[currentRows.indexOf(lastPureRow)].images.push({
        ...newImage,
        id: newImageId,
      });
      return [...currentRows];
    }
    if (currentRows.length === 0) {
      currentRows.push({
        id: `row-${rowIndex++}`,
        disabled: true,
        images: [],
      });
    }
    currentRows.push(
      {
        id: `row-${rowIndex++}`,
        disabled: false,
        images: [{ ...newImage, id: newImageId }],
      },
      {
        id: `row-${rowIndex++}`,
        disabled: false,
        images: [],
      }
    );
    rowIndex = 0;
    currentRows = currentRows.map((row) => ({
      ...row,
      id: `row-${rowIndex++}`,
    }));
    return [...currentRows];
  };

  const updateRows = (newImages: ImageUI[], rowId: string) => (
    currentRows: Row[]
  ) => {
    console.log(newImages, rowId);
    console.log("currentRows", currentRows);
    rowIndex = 0;
    const newPureRows = currentRows
      .map((singleRow) => {
        if (singleRow.id === rowId)
          return {
            ...singleRow,
            disabled: newImages.length > 2,
            images: newImages,
            id: `row-${rowIndex++}`,
          };
        return { ...singleRow, id: `row-${rowIndex++}` };
      })
      .filter((singleRow) => singleRow.images.length);
    console.log("newPureRows", newPureRows);

    const newPaddedRows = [];
    newPureRows.forEach((pureRow: Row, i: number) => {
      if (i === 0) {
        newPaddedRows.push({
          id: `row-${rowIndex++}`,
          disabled: false,
          images: [],
        });
      }
      newPaddedRows.push(pureRow);
      newPaddedRows.push({
        id: `row-${rowIndex++}`,
        disabled: false,
        images: [],
      });
    });
    console.log("newPaddedRows", newPaddedRows);
    return newPaddedRows;
  };

  const shouldPut = (
    to: Sortable,
    from: Sortable,
    dragEl: HTMLElement,
    event: Sortable.SortableEvent
  ) => {
    return to.el.children.length < 3;
  };

  return (
    <div className={css.image_form_container}>
      {rows.map((row) => (
        <>
          <ReactSortable
            className={css.row}
            style={{
              width: "100%",
              display: "grid",
              gridAutoFlow: "column",
              gap: 10,
            }}
            list={row.images}
            setList={(images) => setRows(updateRows(images, row.id))}
            animation={150}
            group={{
              name: "rows-group",
              put: shouldPut,
            }}
          >
            {row.images.map((image, index) => (
              <div
                key={image.id}
                style={{
                  height: 200,
                  backgroundImage: `url(${image.url})`,
                }}
              />
            ))}
          </ReactSortable>
        </>
      ))}
      <label htmlFor="files" className={css.add_images}>
        <input
          style={{ display: "none" }}
          type="file"
          name="files"
          id="files"
          multiple={true}
          onChange={onImage}
          onDrop={onImage}
        />
        <img src="/svgs/plus.svg" />
        <span>drag images or click to add</span>
      </label>
    </div>
  );
};
