import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue, update } from "firebase/database";
import ReactPlayer from "react-player";
import { app } from "../firebase/firebaseconfig";

const VideoDetails = () => {
  const { channelId, videoId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [video, setVideo] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploaded, setIsUploaded] = useState(sessionStorage.getItem(`uploadStatus-${videoId}`) === "true");

  // Determine userRole based on the URL
  const userRole = location.pathname.includes("/youtuber/")
    ? "youtuber"
    : "editor";



    useEffect(() => {
      const db = getDatabase(app);
      const videoRef = ref(db, `channels/${channelId}/videos/${videoId}`);
  
      onValue(videoRef, (snapshot) => {
        const data = snapshot.val();
        setVideo(data);
      });
    }, [channelId, videoId]);

  const handleApproval = () => {
    if (!isUploaded) {
      // Check if the video has not been uploaded yet
      setIsApproving(true); // Disable the button
      window.location.href = `http://quicktube-b2aa2.firebaseapp.com/login?channelId=${channelId}&videoId=${videoId}`;
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const authSuccess = searchParams.get("authSuccess");
    const uploadInitiated = sessionStorage.getItem(`uploadInitiated-${videoId}`);
  
    if (authSuccess && !isUploaded && !uploadInitiated) {
      sessionStorage.setItem(`uploadInitiated-${videoId}`, "true");
      handleVideoUpload().then(() => {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('authSuccess');
        window.history.pushState({}, '', newUrl);
      });
    }
  }, [location.search, isUploaded, videoId]);

  const handleVideoUpload = async () => {
    console.log("handleVideoUpload called", { isUploaded, isApproving });


    if (!isUploaded && !isApproving) {
      console.log("Initiating upload...");
      setIsApproving(true);
      setUploadStatus("Uploading...");
      try {
        const response = await fetch("http://localhost:5000/youtubeUpload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            channelId: channelId,
            videoId: videoId,
            videoUrl: video?.videoUrl,
            title: video?.title,
            description: video?.description,
            tags: video?.tags,
            
          }),
        });
        const responseData = await response.json();
        if (responseData.message === "Upload successful") {
          console.log("Upload successful:", responseData);
          setUploadStatus("Upload successful!");
          setIsUploaded(true);
          sessionStorage.setItem(`uploadStatus-${videoId}`, "true");
  
          // Update approvalStatus to "Approved" in Firebase Realtime Database
          const db = getDatabase(app);
          const videoRef = ref(db, `channels/${channelId}/videos/${videoId}`);
          update(videoRef, { approvalStatus: "Approved" });

          
  
        } else {
          throw new Error("Upload not successful");
        }
      } catch (error) {
        console.error("Upload failed:", error);
        setUploadStatus("Upload failed. Please try again.");
      } finally {
        setIsApproving(false); // Clear flag regardless of success or failure
      }
    }
  };

  if (!video) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center flex-row h-[calc(100%-56px)] bg-black font-['Gilroy']">
      <div className="w-full max-w-[1280px] flex flex-col lg:flex-row">
        <div className="flex  flex-col lg:w-[calc(100%-350px)] xl:w-[calc(100%-400px)] px-4 py-3 lg:py-6 overflow-y-auto">
          <div className="h-[200px] md:h-[400px] lg:h-[200px] xl:h-[550px] ml-[-16px] lg:ml-0 mr-[-16px] lg:mr-0">
            <ReactPlayer
              url={video?.videoUrl} // Use your video URL here
              controls
              width="100%"
              height="100%"
              playing={true}
              className="rounded-2xl bg-[#09090b]"
            />
          </div>
          <div className="text-white font-bold text-sm md:text-xl mt-4 line-clamp-2">
            {video?.title}
          </div>
          <div className="flex justify-end items-end flex-row">
            {userRole === "youtuber" && video?.approvalStatus === "Pending" ? (
              <button
                className="inline-flex items-center px-3 py-2 rounded-full text-xs font-semibold bg-indigo-700 hover:bg-green-500 text-white border-[0.3px] border-white transition-colors duration-200"
                onClick={handleApproval}
              >
                <svg
                  className="-ml-0.5 mr-1.5 h-2 w-2 text-white hover:text-white fill-current"
                  viewBox="0 0 8 8"
                >
                  <circle cx="4" cy="5" r="3" />
                </svg>
                Approve
              </button>
            ) : video?.approvalStatus === "Approved" ? (
              // Adjusted styles for the "Approved" state
              <button
                className="inline-flex items-center px-3 py-2 rounded-full text-xs font-semibold bg-green-500 text-white border-[0.3px] border-white transition-colors duration-150"
                disabled
              >
                <svg
                  className="-ml-0.5 mr-1.5 h-2 w-2 text-white fill-current"
                  viewBox="0 0 8 8"
                >
                  <circle cx="4" cy="5" r="3" />
                </svg>
                Approved
              </button>
            ) : (
              <span className="inline-flex items-center px-3 py-2 rounded-full text-xs font-medium bg-[#09090b] text-orange-500 border-[0.3px] border-orange-500">
                <svg
                  className="-ml-0.5 mr-1.5 h-2 w-2 text-orange-500"
                  fill="currentColor"
                  viewBox="0 0 8 8"
                >
                  <circle cx="4" cy="4" r="3" />
                </svg>
                {video?.approvalStatus}
              </span>
            )}
          </div>
          <div className="text-white/[0.7] text-md mt-3 bg-[#09090b] p-3 rounded-lg">
            <span className="font-semibold text-white">Description : </span>{" "}
            {video?.description} {/* Displaying the description */}
          </div>
          <div className="text-white/[0.7] text-md mt-2 bg-[#09090b] p-3 rounded-lg">
            <span className="font-semibold text-white">Tags : </span>
            {Array.isArray(video?.tags)
              ? video.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-[#5E17EB] rounded-full px-2 py-1 font-medium ml-1"
                  >
                    {tag.trim()}
                  </span>
                ))
              : typeof video?.tags === "string" &&
                video.tags.split(",").map((tag, index) => (
                  <span
                    key={index}
                    className="bg-[#5E17EB] rounded-full px-2 py-1 font-medium ml-1"
                  >
                    {tag.trim()}
                  </span>
                ))}
          </div>
        </div>
        {/* Assuming you want to keep the related videos section */}
        <div className="flex flex-col py-6 px-4 overflow-y-auto lg:w-[350px] xl:w-[400px]">
          {/* Related videos mapping */}
        </div>
      </div>
    </div>
  );
};

export default VideoDetails;
