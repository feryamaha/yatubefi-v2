import React, { useState, useEffect } from "react";
import Player from "./components/Player";
import Menu from "./components/Menu";
import Card from "./components/Card";
import VideoForm from "./components/VideoForm";
import useTheme from "./hooks/useTheme";
import initialVideos from "./data/dynamic-videos.json";

function App() {
  const [currentVideo, setCurrentVideo] = useState(null);
  const { theme, switchTheme } = useTheme();
  const [videos, setVideos] = useState(() => {
    const savedVideos = localStorage.getItem("videos");
    return savedVideos ? JSON.parse(savedVideos) : initialVideos;
  });
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("videos", JSON.stringify(videos));
    console.log(
      "Vídeos salvos no localStorage:",
      JSON.stringify(videos, null, 2)
    );
  }, [videos]);

  const addVideo = (newVideo) => {
    const normalizedCategory = newVideo.category
      .toLowerCase()
      .replace("ú", "u");
    console.log(
      "Adicionando vídeo na categoria:",
      normalizedCategory,
      "Vídeo:",
      newVideo
    );
    setVideos((prev) => ({
      ...prev,
      [normalizedCategory]: [...(prev[normalizedCategory] || []), newVideo],
    }));
  };

  const editVideo = (updatedVideo) => {
    const normalizedCategory = updatedVideo.category
      .toLowerCase()
      .replace("ú", "u");
    setVideos((prev) => ({
      ...prev,
      [normalizedCategory]: prev[normalizedCategory].map((v) =>
        v.id === updatedVideo.id ? updatedVideo : v
      ),
    }));
  };

  const deleteVideo = (videoId) => {
    setVideos((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((category) => {
        updated[category] = updated[category].filter((v) => v.id !== videoId);
      });
      return updated;
    });
  };

  const closePlayer = () => setCurrentVideo(null);

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  return (
    <div className={`app ${theme}`}>
      <Menu
        switchTheme={switchTheme}
        closePlayer={closePlayer}
        setCurrentVideo={setCurrentVideo}
        toggleForm={toggleForm}
      />
      <VideoForm
        addVideo={addVideo}
        editVideo={editVideo}
        deleteVideo={deleteVideo}
        videos={videos}
        toggleForm={toggleForm}
      />
      <Card videos={videos} onCardClick={setCurrentVideo} />
      {currentVideo && <Player video={currentVideo} onClose={closePlayer} />}
    </div>
  );
}

export default App;
