import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseconfig';
import { collection, getDocs } from 'firebase/firestore';

function Youtuber() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const videosCollectionRef = collection(db, "videos");
      const data = await getDocs(videosCollectionRef);
      setVideos(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };

    fetchVideos();
  }, []);

  return (
    <div className="videos-container">
      {videos.map(video => (
        <div key={video.id} className="video">
          <div className="video-preview">
            <video controls width="100%" style={{ aspectRatio: '16 / 9' }} src={video.videoUrl}>
              Your browser does not support the video tag.
            </video>
            <img src={video.thumbnailUrl} alt="Thumbnail" className="video-thumbnail" />
          </div>
          <div className="video-info">
            <h3>{video.title}</h3>
            <p>{video.description}</p>
            <div className="tags">
              {video.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Youtuber;