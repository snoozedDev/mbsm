import cn from "classname";
import Jimp from "jimp";
import * as R from "ramda";
import React, { useState } from "react";
import { ReactSortable, Sortable } from "react-sortablejs";
import { generateId } from "../../utils/utils";
import css from "./ImageForm.module.scss";

interface Vector {
  x: number;
  y: number;
}

interface ImageUI {
  id: string;
  url: string;
  mode: "fit" | "fill";
  size: Vector;
  offset: Vector;
  scale: number;
}

interface Row {
  id: string;
  images: ImageUI[];
}

export const ImageForm = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [fakeRow, setFakeRow] = useState<Row>({
    id: "fake-row",
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [showFakeRows, setShowFakeRows] = useState(false);

  const currentImageAmount = [
    ...rows.map((row) => row.images.length),
    0,
  ].reduce((total, num) => total + num);

  const getRowId = () => `row-${generateId(4)}`;
  const getImageId = () => `image-${generateId(4)}`;

  const onImage = async (evt) => {
    setLoading(true);
    const files = evt.target.files;
    if (files && files.length) {
      await Promise.all(
        [...files].slice(0, 9 - currentImageAmount).map((file) => {
          return new Promise((resolve) => {
            const fr = new FileReader();
            fr.onload = async () => {
              const image = await Jimp.read(fr.result as string);
              const imageView: ImageUI = {
                id: getImageId(),
                size: {
                  x: image.getWidth(),
                  y: image.getHeight(),
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
              resolve();
            };
            fr.readAsDataURL(file);
          });
        })
      );
      setLoading(false);
    }
  };

  const addToRows = (newImage: ImageUI) => (currentRows: Row[]): Row[] => {
    if (currentRows.length < 3) {
      return [
        {
          id: getRowId(),
          images: [],
        },
        {
          id: getRowId(),
          images: [newImage],
        },
        {
          id: getRowId(),
          images: [],
        },
      ];
    }

    const lastRowWithImages = currentRows
      .filter((row) => row.images.length)
      .pop();

    if (lastRowWithImages.images.length < 3) {
      currentRows[currentRows.indexOf(lastRowWithImages)].images.push(newImage);
      return currentRows;
    }

    return R.insert(
      currentRows.length - 1,
      { id: getRowId(), images: [newImage] },
      currentRows
    );
  };

  const updateRows = (newImages: ImageUI[], rowId: string | number) => (
    currentRows: Row[]
  ) => {
    if (typeof rowId === "number") {
      if (rowId === 0 && newImages.length) {
        rowId = currentRows[0].id;
        currentRows.unshift({ id: getRowId(), images: [] });
      } else if (newImages.length) {
        rowId = currentRows[currentRows.length - 1].id;
        currentRows.push({ id: getRowId(), images: [] });
      } else {
        return currentRows;
      }
    }

    let newRows = currentRows
      .map((row) => {
        if (row.id === rowId) {
          if (newImages.length) {
            return {
              ...row,
              images: newImages,
            };
          } else {
            return null;
          }
        }
        return row;
      })
      .filter((row) => row);

    newRows = [
      newRows[0],
      ...newRows.slice(1, -1).filter((row) => row.images.length),
      newRows[newRows.length - 1],
    ];

    return newRows;
  };

  const shouldPut = (
    to: Sortable,
    _from: Sortable,
    _dragEl: HTMLElement,
    _event: Sortable.SortableEvent
  ) => {
    return to.el.children.length < 3;
  };

  const onDragEnd = () => {
    setShowFakeRows(false);
  };

  return (
    <div className={css.image_form_container}>
      {!loading && (
        <>
          {rows.map((row, i) =>
            [rows.length - 1, 0].includes(i) ? (
              <ReactSortable
                key={row.id}
                className={cn(css.row, css.fake, showFakeRows && css.show)}
                list={[]}
                setList={(images) => setRows(updateRows(images, i))}
                animation={150}
                group={"rows-group"}
                onStart={() => setShowFakeRows(true)}
                onEnd={onDragEnd}
              />
            ) : (
              <>
                <ReactSortable
                  key={row.id}
                  className={css.row}
                  list={row.images}
                  setList={(images) => setRows(updateRows(images, row.id))}
                  animation={150}
                  group={{
                    name: "rows-group",
                    put: shouldPut,
                  }}
                  onStart={() => setShowFakeRows(true)}
                  onEnd={onDragEnd}
                >
                  {row.images.map((image, index) => (
                    <div className={css.image_container} key={image.id}>
                      <div className={css.overlay} />
                      <div
                        className={css.image}
                        style={{
                          height: 200,
                          backgroundSize: "cover",
                          backgroundImage: `url(${image.url})`,
                        }}
                      />
                    </div>
                  ))}
                </ReactSortable>
              </>
            )
          )}
        </>
      )}
      {currentImageAmount < 9 && (
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
      )}
    </div>
  );
};
