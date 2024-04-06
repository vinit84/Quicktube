import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase/firebaseconfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { v5 as uuidv5 } from "uuid";

const NAMESPACE = "ad81847c-8134-4167-bb63-ec2178e4cb69";

function Editor() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
    file: null,
    thumbnail: null,
  });
  const [videoPreview, setVideoPreview] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  useEffect(() => {
    // Cleanup URLs to avoid memory leaks
    return () => {
      videoPreview && URL.revokeObjectURL(videoPreview);
      thumbnailPreview && URL.revokeObjectURL(thumbnailPreview);
    };
  }, [videoPreview, thumbnailPreview]);

  const handleChange = (event) => {
    const { name, type, value, files } = event.target;
    if (type === "file") {
      setForm({
        ...form,
        [name]: files[0],
      });
      // Generate preview URLs
      if (name === "file") {
        const videoURL = URL.createObjectURL(files[0]);
        setVideoPreview(videoURL);
      } else if (name === "thumbnail") {
        const thumbnailURL = URL.createObjectURL(files[0]);
        setThumbnailPreview(thumbnailURL);
      }
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Generate unique names for the video and thumbnail
    const videoName = uuidv5(form.file.name, NAMESPACE) + "-" + form.file.name;
    const thumbnailName =
      uuidv5(form.thumbnail.name, NAMESPACE) + "-" + form.thumbnail.name;

    // References to the storage locations
    const videoRef = ref(storage, `videos/${videoName}`);
    const thumbnailRef = ref(storage, `thumbnails/${thumbnailName}`);

    try {
      // Upload video
      const videoUploadResult = await uploadBytes(videoRef, form.file);
      const videoUrl = await getDownloadURL(videoUploadResult.ref);

      // Upload thumbnail
      const thumbnailUploadResult = await uploadBytes(
        thumbnailRef,
        form.thumbnail
      );
      const thumbnailUrl = await getDownloadURL(thumbnailUploadResult.ref);

      // Store video metadata in Firestore
      console.log("Storing video metadata", {
        title: form.title,
        description: form.description,
        tags: form.tags,
        videoUrl,
        thumbnailUrl,
      });

      await addDoc(collection(db, "videos"), {
        title: form.title,
        description: form.description,
        tags: form.tags.split(",").map((tag) => tag.trim()),
        videoUrl,
        thumbnailUrl,
      });

      console.log("Video metadata stored successfully!");
    } catch (error) {
      console.error("Error uploading files and storing metadata:", error);
    }
  };

  return (
    <section className="bg-[#383838] w-screen h-screen">
      <div className="editor-container max-w-4xl mx-auto rounded-lg bg-neutral-900 top-10">
        <div className="shadow-lg rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6 text-white">
            <div>
              <label htmlFor="title" className="block text-sm font-medium">
                Title:
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={form.title}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border text-black rounded-md border-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium"
              >
                Description:
              </label>
              <input
                type="text"
                name="description"
                id="description"
                value={form.description}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border  text-black rounded-md border-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium ">
                Tags (comma-separated):
              </label>
              <input
                type="text"
                name="tags"
                id="tags"
                value={form.tags}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border text-black  rounded-md border-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="file" className="block text-sm font-medium ">
                Video File:
              </label>
              <input
                type="file"
                name="file"
                id="file"
                accept="video/*"
                onChange={handleChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
            <div className="w-[30rem] rounded-lg ">
              {videoPreview && (
                <video src={videoPreview} controls className="w-full h-auto">
                  Your browser does not support the video tag.
                </video>
              )}
            </div>

            <div>
              <label htmlFor="thumbnail" className="block text-sm font-medium ">
                Thumbnail Image:
              </label>
              <input
                type="file"
                name="thumbnail"
                id="thumbnail"
                accept="image/*"
                onChange={handleChange}
                className="mt-1 block w-full text-sm  file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>

            <div className="w-[20rem] rounded-lg">
              {thumbnailPreview && (
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-full h-auto mt-4"
                />
              )}
            </div>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Upload Video
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Editor;


// import React from "react";
// import axios from "axios";

// function Editor() {
//   const [form, setForm] = React.useState({
//     title: "",
//     description: "",
//     file: null,
//     thumbnail: null,
//     tags: "",
//   });

//   function handleChange(event) {
//     const { name, type, value, files } = event.target;
//     let inputValue;

//     if (type === "file") {
//       inputValue = files[0];
//     } else {
//       inputValue = value;
//     }

//     setForm({
//       ...form,
//       [name]: inputValue,
//     });
//   }

//   function handleSubmit(event) {
//     event.preventDefault();

//     const videoData = new FormData();
//     videoData.append("videoFile", form.file);
//     videoData.append("thumbnail", form.thumbnail);
//     videoData.append("title", form.title);
//     videoData.append("description", form.description);
//     const tagsArray = form.tags.split(",").map((tag) => tag.trim());
//     videoData.append("tags", JSON.stringify(tagsArray));

//     axios
//       .post("http://localhost:5000/upload", videoData)
//       .then((response) => {
//         console.log(response.data);
//       })
//       .catch((error) => {
//         console.error("Upload failed:", error);
//       });
//   }

//   return (
//     <div className="App mx-auto max-w-screen-md mt-10 p-4">
//       <div className="bg-white shadow-md rounded p-8">
//         <form onSubmit={handleSubmit}>
//           <h1 className="text-2xl font-bold mb-4 text-center">Editor</h1>
//           <div className="mb-4">
//             <input
//               onChange={handleChange}
//               type="text"
//               name="title"
//               autoComplete="off"
//               placeholder="Title"
//               className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
//             />
//           </div>
//           <div className="mb-4">
//             <input
//               onChange={handleChange}
//               type="text"
//               name="description"
//               autoComplete="off"
//               placeholder="Description"
//               className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
//             />
//           </div>
//           <div className="mb-4">
//             <input
//               onChange={handleChange}
//               type="text"
//               name="tags"
//               autoComplete="off"
//               placeholder="Tags (comma-separated)"
//               className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
//             />
//           </div>
//           <div className="mb-4">
//             <input
//               onChange={handleChange}
//               accept="video/mp4"
//               type="file"
//               name="file"
//               className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
//             />
//           </div>
//           <div className="mb-4">
//             <input
//               onChange={handleChange}
//               accept="image/*"
//               type="file"
//               name="thumbnail"
//               className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
//             />
//           </div>
//           <button
//             type="submit"
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//           >
//             Upload Video
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Editor;

