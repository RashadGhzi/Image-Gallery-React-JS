import React, { useState, useRef } from "react";
import images from "./images";
import "./imageGallery.css";

export default function ImageGallery() {
  const [imageData, setImageData] = useState(images);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [checkedImageIndex, setCheckedImageIndex] = useState([]);
  const dragStartIndex = useRef(null);
  const dragEnterIndex = useRef(null);

  /**
   * The handleChange function takes an event object, retrieves the selected file, creates a URL for
   * the file, and sets the file URL as the value of the imageFileUrl variable.
   */
  const handleChange = (e) => {
    const file = e.target.files;
    const file_url = URL.createObjectURL(file[0]);
    setImageFileUrl(file_url);
  };

  /**
   * The handleUpload function adds a new image to the imageData array and resets the imageFileUrl.
   */
  const handleUpload = async (e) => {
    e.preventDefault();
    setImageData([
      ...imageData,
      { id: imageData.length + 1, image: imageFileUrl },
    ]);
    setImageFileUrl(null);
  };

  /**
   * The `handleSort` function takes an array called `imageData`, removes an item from a specific
   * index, and inserts it at another index.
   */
  const handleSort = () => {
    const temp = [...imageData];
    const dragItem = temp.splice(dragStartIndex.current, 1)[0];
    // console.log("darg item ", dragItem);
    // console.log("temp ", temp);
    temp.splice(dragEnterIndex.current, 0, dragItem);
    setImageData(temp);
  };

  /**
   * The function `handleChecked` logs the index and checked status of an element and updates an array
   * of checked image indexes based on the checked status.
   */
  const handleChecked = (e, index) => {
    console.log(`index ${index} checked ${e.target.checked}`);
    if (e.target.checked) {
      setCheckedImageIndex([...checkedImageIndex, index]);
    } else {
      setCheckedImageIndex(
        checkedImageIndex.filter((check_num) => check_num !== index)
      );
    }
  };

  // handle deleting selected files
  const handleDelete = () => {
    setImageData(
      imageData.filter((img, index) => !checkedImageIndex.includes(index))
    );
    setCheckedImageIndex([]);
  };

  return (
    <div className="box">
      <div className="img-container-header">
        {checkedImageIndex.length ? (
          <>
            <div className="checkbox-count">
              <input
                type="checkbox"
                checked={checkedImageIndex.length ? true : false}
              />
              <div className="count">
                {checkedImageIndex.length} Files Selected
              </div>
            </div>
            <button
              type="button"
              onClick={handleDelete}
              className="delete-button"
            >
              Delete Files
            </button>
          </>
        ) : (
          <div className="count">Gallery</div>
        )}
      </div>
      <hr />
      <div className="container">
        {imageData.map((img, index) => (
          <div className="img-item" key={img.id}>
            <img
              style={checkedImageIndex.includes(index) ? { opacity: 0.5 } : {}}
              src={img.image}
              alt="nothing"
              draggable="true"
              onDragStart={() => (dragStartIndex.current = index)}
              onDragEnter={(e) => {
                dragEnterIndex.current = index;
              }}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDragEnd={handleSort}
            />
            <input
              style={
                checkedImageIndex.includes(index) ? { display: "block" } : {}
              }
              type="checkbox"
              name="img-checked"
              onChange={(e) => {
                handleChecked(e, index);
              }}
              className="img-check-box"
            />
          </div>
        ))}

        <form onSubmit={handleUpload}>
          {!imageFileUrl ? (
            <label className="image-add-label">
              <i class="fa-regular fa-image"></i>
              <span>Add Image</span>
              <input
                type="file"
                name="images"
                id="images"
                onChange={handleChange}
                accept="image/*"
              />
            </label>
          ) : (
            <button type="submit">Upload</button>
          )}
        </form>
      </div>
    </div>
  );
}
