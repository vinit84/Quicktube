import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from "../firebase/firebaseconfig";
import VideoCard from "./VideoCard"; // Import VideoCard
import { useLocation } from "react-router-dom";

const VideoDisplay = ({ channelId, basePath }) => { // Add basePath prop
  const [videos, setVideos] = useState([]);
  const location = useLocation();
  const userRole = location.pathname.includes('/youtuber/') ? 'youtuber' : 'editor';
  // Rest of your component logic
  

  useEffect(() => {
    const db = getDatabase(app);
    const videosRef = ref(db, `channels/${channelId}/videos`);

    onValue(videosRef, (snapshot) => {
      const videosData = snapshot.val();
      const videosList = videosData
        ? Object.keys(videosData).map((key) => ({
            videoId: key,
            ...videosData[key],
          }))
        : [];
      setVideos(videosList);
    });
  }, [channelId]);

  return (
    <div className="grid grid-cols-3 gap-4">
        {videos.map((video) => (
        <VideoCard key={video.videoId} channelId={channelId} video={video} basePath={basePath} userRole={userRole} /> // Pass userRole to VideoCard
      ))}
    </div>
  );
};

export default VideoDisplay;