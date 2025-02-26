import React, { useEffect, useRef } from "react";
import YouTube from "react-youtube";

function Player({ video, onClose }) {
  const playerRef = useRef(null);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const handleClose = () => {
    try {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    } catch (error) {
      console.warn("Não foi possível sair do modo tela cheia:", error);
    }
    onClose();
  };

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      controls: 1,
      rel: 0,
      showinfo: 0,
      modestbranding: 1,
      fs: 1,
      iv_load_policy: 3,
      origin: window.location.origin,
    },
  };

  const onReadyYouTube = (event) => {
    playerRef.current = event.target;
    event.target.playVideo();
    if (containerRef.current && !document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.warn("Erro ao entrar em tela cheia:", err);
      });
    }
  };

  const onEndYouTube = () => {
    onClose();
  };

  const playLocalVideo = () => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn(
          "Erro ao tentar tocar o vídeo nativo automaticamente:",
          err
        );
      });
    }
  };

  useEffect(() => {
    if (video.isLocal && videoRef.current) {
      playLocalVideo();
      if (containerRef.current && !document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch((err) => {
          console.warn("Erro ao entrar em tela cheia:", err);
        });
      }
    }
  }, [video]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.8)",
        zIndex: 1000,
      }}
    >
      <button
        onClick={handleClose}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          padding: "10px",
          width: "100px",
          height: "50px",
          backgroundColor: "#ff0000",
          color: "#fff",
          fontSize: "18px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          zIndex: 1050,
        }}
      >
        Fechar
      </button>
      {video.isLocal ? (
        <video
          ref={videoRef}
          src={video.url}
          controls
          autoPlay
          style={{ width: "100%", height: "100%" }}
          onEnded={onClose}
          onError={(e) => console.error("Erro ao carregar vídeo nativo:", e)}
        />
      ) : (
        <YouTube
          videoId={getYouTubeId(video.url)}
          opts={opts}
          onReady={onReadyYouTube}
          onEnd={onEndYouTube}
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
}

function getYouTubeId(url) {
  const regex = /[?&]v=([^&#]*)/;
  const match = regex.exec(url);
  return match && match[1] ? match[1] : "";
}

export default Player;
