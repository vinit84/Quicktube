import React, { useEffect, useRef, useState } from "react";
import { PhotoIcon, FilmIcon } from "@heroicons/react/24/solid";
import { get, getDatabase, push, ref, set } from "firebase/database";
import { getAuth } from "@firebase/auth";
import { app } from "../../firebase/firebaseconfig";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const notifySuccess = () =>
  toast.success("Video uploaded successfully!", {
    position: "bottom-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  });

const notifyError = (errorMessage) =>
  toast.error(errorMessage, {
    position: "bottom-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  });

const UploadForm = () => {
  const [tags, setTags] = useState([]);
  const [input, setInput] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoVisibility, setVideoVisibility] = useState("public"); // Add this line for video visibility
  // Existing useRef calls
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const storage = getStorage(app);
  const db = getDatabase(app);
  const { channelId } = useParams(); // Retrieve channelId from URL
  const auth = getAuth();
  const user = auth.currentUser;
  const editorEmail = user ? user.email : null;

  const handleKeyDown = (e) => {
    // Check if backspace was pressed and input is empty
    if (e.key === "Backspace" && input === "") {
      e.preventDefault(); // Prevent the default action to avoid any unwanted behavior
      setTags(tags.slice(0, -1)); // Remove the last tag
    } else if (e.key === "Enter" && input) {
      // Check if enter was pressed and there is some input
      e.preventDefault(); // Prevent the form from being submitted
      setTags([...tags, input]); // Add the new tag
      setInput(""); // Clear the input field
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };
  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file); // Store the file object
    }
  };

  const handleThumbnailChangeClick = () => {
    // Trigger click on hidden file input
    fileInputRef.current.click();
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file); // Store the file object
    }
  };

  const handleVideoChangeClick = () => {
    // Trigger click on hidden video file input
    videoInputRef.current.click();
  };

  const uploadFileToStorage = (file, filePath) => {
    return new Promise((resolve, reject) => {
      const fileRef = storageRef(storage, filePath); // Changed variable name to fileRef
      uploadBytes(fileRef, file)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref)
            .then((downloadURL) => {
              resolve(downloadURL);
            })
            .catch(reject);
        })
        .catch(reject);
    });
  };

  const uploadVideoMetadata = (metadata, channelId) => {
    const db = getDatabase();
    // Add approvalStatus to the metadata before uploading
    const updatedMetadata = {
      ...metadata,
      approvalStatus: "Pending", // Set approvalStatus to pending
    };
    const videoRef = push(ref(db, `channels/${channelId}/videos`));
    return set(videoRef, updatedMetadata);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editorEmail || !channelId) {
      console.error("Missing editor email or channelId");
      return;
    }

    try {
      // Use the original file names directly without adding a timestamp
      const thumbnailPath = `thumbnails/${channelId}/${thumbnail.name}`;
      const videoPath = `videos/${channelId}/${video.name}`;

      const thumbnailUrl = await uploadFileToStorage(thumbnail, thumbnailPath);
      const videoUrl = await uploadFileToStorage(video, videoPath);

      const videoMetadata = {
        title,
        description,
        tags,
        videoVisibility,
        thumbnailUrl,
        videoUrl,
        editorEmail, // Include editorEmail in the metadata
        channelId, // Include channelId in the metadata
      };

      // Pass the original file names of the thumbnail and video
      await uploadVideoMetadata(
        videoMetadata,
        channelId,
        thumbnail.name,
        video.name
      );
      notifySuccess();
    } catch (error) {
      console.error("Upload failed:", error);
      notifyError("Upload failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col">
      <ToastContainer />
      <form onSubmit={handleSubmit} method="post" enctype="multipart/form-data">
        <div className="flex flex-row">
          <div>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-xl font-bold leading-7 text-white w-[35rem]">
                  Video Details
                </h2>
                {/* <p className="mt-1 text-sm leading-6 text-gray-600">
      This information will be displayed publicly so be careful what you share.
    </p> */}

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="col-span-full w-[35rem]">
                    <div className=" grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="sm:col-span-3 md:col-span-6">
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium leading-6 text-white"
                        >
                          Title (Required)
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="title"
                            id="title"
                            autoComplete="given-name"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="block w-full bg-black rounded-md border border-gray-700 hover:border-white tranisition duration-100 ease-in-out p-2 text-white shadow-sm  placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-[#5E17EB] sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-4 md:col-span-full">
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium leading-6 text-white"
                        >
                          Description
                        </label>
                        <div className="mt-2">
                          <textarea
                            id="about"
                            name="about"
                            rows={5}
                            className="block w-full bg-black rounded-md border border-gray-700 hover:border-white tranisition duration-100 ease-in-out p-2 text-white shadow-sm  placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-[#5E17EB] sm:text-sm sm:leading-6"
                            defaultValue={""}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="col-span-full">
                        <label
                          htmlFor="cover-photo"
                          className="block text-sm font-medium leading-6 text-white"
                        >
                          Thumbnail
                        </label>
                        <p className="mt-1 text-sm leading-2 text-gray-600">
                          Select or upload a picture that shows what's in your
                          video. A good thumbnail stands out and draws viewers'
                          attention.
                        </p>
                        {thumbnail ? (
                          <div className="mt-2 flex justify-center items-center relative group">
                            <img
                              src={URL.createObjectURL(thumbnail)}
                              alt="Thumbnail preview"
                              className="max-w-full h-auto rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={handleThumbnailChangeClick} // Use the new handler here
                              className="absolute m-auto w-full inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 text-white font-bold py-2 px-4 rounded"
                            >
                              <button
                                type="button"
                                onClick={handleThumbnailChangeClick}
                                className="bg-[#00000046] rounded-lg p-2"
                              >
                                Replace
                              </button>
                            </button>
                            {/* Hidden file input for changing the thumbnail */}
                            <input
                              ref={fileInputRef}
                              type="file"
                              name="thumbnail"
                              className="hidden"
                              onChange={handleThumbnailUpload}
                            />
                          </div>
                        ) : (
                          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-700 hover:border-white transition duration-300 ease-in-out px-6 py-10 cursor-pointer">
                            <div className="text-center">
                              <PhotoIcon
                                className="mx-auto h-12 w-12 text-gray-300"
                                aria-hidden="true"
                              />
                              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                <label
                                  htmlFor="thumbnail"
                                  className="relative cursor-pointer rounded-lg p-1 bg-[#5E17EB] hover:bg-indigo-700 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-[#5E17EB] focus-within:ring-offset-2 hover:text-gray-300"
                                >
                                  <span>Upload a file</span>
                                  <input
                                    id="thumbnail"
                                    name="thumbnail"
                                    type="file"
                                    className="sr-only"
                                    onChange={handleThumbnailUpload}
                                  />
                                </label>
                                <p className="pl-1.5">or drag and drop</p>
                              </div>
                              <p className="text-xs leading-5 mt-1 text-gray-600">
                                PNG, JPG, GIF up to 10MB
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="sm:col-span-3 md:col-span-6">
                        <label
                          htmlFor="tags"
                          className="block text-sm font-medium leading-6 text-white"
                        >
                          Tags
                        </label>
                        <p className="mt-1 text-sm leading-2 text-gray-600">
                          Tags can be useful if content in your video is
                          commonly misspelt. Otherwise, tags play a minimal role
                          in helping viewers to find your video.
                        </p>
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-2 p-2 bg-black rounded-md border border-gray-700 hover:border-white transition duration-100 ease-in-out">
                            {tags.map((tag, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 bg-gray-700 text-white rounded-full px-2"
                              >
                                {tag}
                                <div>
                                  <button
                                    onClick={() => removeTag(index)}
                                    className="ml-1 h-4 w-4 flex justify-center items-center text-gray-300 hover:text-white border border-gray-300 rounded-full cursor-pointer "
                                  >
                                    &times;
                                  </button>
                                </div>
                              </div>
                            ))}
                            <input
                              type="text"
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              onKeyDown={handleKeyDown}
                              className="flex-1 bg-transparent p-1 text-white placeholder:text-gray-400 outline-none"
                              placeholder={
                                tags.length === 0
                                  ? "Add a tag and press Enter"
                                  : ""
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" mx-7 w-[29rem]">
            <div className="mt-[6.2rem]">
              {video ? (
                <div className="mt-2 flex flex-row justify-end items-end relative group">
                  <video
                    src={URL.createObjectURL(video)}
                    controls
                    className="max-w-full h-auto rounded-lg"
                  />

                  <div className="absolute top-0 right-0">
                    <button
                      type="button"
                      onClick={handleVideoChangeClick}
                      className="bg-[#00000046] opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-opacity-50 text-white font-bold py-2 px-4 rounded"
                    >
                      Replace
                    </button>
                  </div>

                  {/* Hidden file input for changing the video */}

                  <input
                    ref={videoInputRef}
                    type="file"
                    name="videoFile"
                    accept="video/*"
                    className="hidden"
                    onChange={handleVideoUpload}
                  />
                </div>
              ) : (
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-700 hover:border-white transition duration-300 ease-in-out px-6 py-14 cursor-pointer">
                  <div className="text-center">
                    <FilmIcon
                      className="mx-auto h-12 w-12 text-gray-300"
                      aria-hidden="true"
                    />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="videoFile"
                        className="relative cursor-pointer rounded-lg p-1 bg-[#5E17EB] hover:bg-indigo-700 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-[#5E17EB] focus-within:ring-offset-2 hover:text-gray-300"
                      >
                        <span>Upload a video</span>
                        <input
                          id="videoFile"
                          name="videoFile"
                          type="file"
                          accept="video/*"
                          className="sr-only"
                          onChange={handleVideoUpload}
                        />
                      </label>
                      <p className="pl-1.5">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 mt-1 text-gray-600">
                      MP4, MOV, AVI up to 10GB
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4">
              <div className="">
                <label
                  htmlFor="video-visibility"
                  className="block text-sm  font-medium leading-6 text-white"
                >
                  Video Visibility
                </label>
                <div className="mt-2">
                  <select
                    id="video-visibility"
                    name="video-visibility"
                    value={videoVisibility}
                    onChange={(e) => setVideoVisibility(e.target.value)}
                    className="block w-full bg-black rounded-md border border-gray-700 hover:border-white transition duration-100 ease-in-out p-2 text-white shadow-sm placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-[#5E17EB] sm:text-sm sm:leading-6"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="unlisted">Unlisted</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Upload
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadForm;
