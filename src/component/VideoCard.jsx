import React, { useRef, useState } from "react"; // Import useRef and useState
import { Link } from "react-router-dom";

const VideoCard = ({ video,channelId, basePath,userRole }) => {
  const videoRef = useRef(null); // Create a ref for the video element
  const [isHovering, setIsHovering] = useState(false); // State to track hover status

  

  // Function to play video muted on hover
  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play();
    }
  };

  // Function to pause video and show thumbnail on mouse leave
  const handleMouseLeave = () => {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  // Function to determine the status label and styling based on approvalStatus
  const renderApprovalStatus = () => {
    switch (video?.approvalStatus) {
      case "Approved":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-green-500 text-white">
            <svg
              className="-ml-0.5 mr-1.5 h-2 w-2 text-white"
              fill="currentColor"
              viewBox="0 0 8 8"
            >
              <circle cx={4} cy={4} r={3} />
            </svg>
            Approved
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-[#111828] text-orange-500">
            <svg
              className="-ml-0.5 mr-1.5 h-2 w-2 text-orange-500"
              fill="currentColor"
              viewBox="0 0 8 8"
            >
              <circle cx={4} cy={4} r={3} />
            </svg>
            Pending
          </span>
        );
    }
  };

  return (
<Link to={`/${basePath}/${channelId}/video/${video.videoId}`}> 
      <div
        className="flex flex-col mb-8 relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative h-48 md:h-45 md:rounded-xl overflow-hidden border-[1.5px] border-[#5b5b5b] ">
          {/* Video element */}
          <video
            ref={videoRef}
            className={`h-full w-full object-cover transition duration-200 ease-in-out ${
              isHovering ? "block" : "hidden"
            }`}
            src={video?.videoUrl}
            loop
          />
          {/* Thumbnail image */}
          <img
            className={`h-full w-full object-cover transition duration-200 ease-in-out ${
              isHovering ? "hidden" : "block"
            }`}
            src={video?.thumbnailUrl}
            alt="Thumbnail"
          />
        </div>
        <div className="flex text-white mt-3">
          <div className="flex flex-col ml-3 overflow-hidden">
            <span className="text-sm font-bold line-clamp-2">
              {video?.title}
            </span>
            <div className="flex text-[12px] font-semibold text-white/[0.7] truncate overflow-hidden mt-2 items-center">
              <div className="ml-auto">{renderApprovalStatus()}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
