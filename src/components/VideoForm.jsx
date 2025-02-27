import React, { useState } from "react";
import styles from "../styles/VideoForm.module.css";

function VideoForm({ addVideo, editVideo, deleteVideo, videos, toggleForm }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [localFile, setLocalFile] = useState(null);
  const [customImage, setCustomImage] = useState(null);
  const [category, setCategory] = useState("Desenhos");
  const [editingVideo, setEditingVideo] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const correctPassword = "050519"; // Temporário, será movido para o backend

  const getYouTubeId = (url) => {
    const regex = /[?&]v=([^&#]*)/;
    const match = regex.exec(url);
    return match && match[1] ? match[1] : "";
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLocalFile(file);
      setTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    if (image) setCustomImage(image);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newVideo;

    if (localFile) {
      const videoUrl = `/assets/movies-nativos/${localFile.name}`;
      const imageUrl = customImage
        ? `/assets/img-card/${customImage.name}`
        : "/default-video.jpg";
      newVideo = {
        id: editingVideo ? editingVideo.id : Date.now(),
        title,
        url: videoUrl,
        image: imageUrl,
        category,
        isLocal: true,
      };
    } else if (url) {
      const videoId = getYouTubeId(url);
      const thumbnail = videoId
        ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        : "";
      newVideo = {
        id: editingVideo ? editingVideo.id : Date.now(),
        title,
        url,
        image: thumbnail,
        category,
        isLocal: false,
      };
    } else {
      alert("Insira um link do YouTube ou selecione um vídeo local.");
      return;
    }

    console.log(
      "Novo vídeo a ser adicionado:",
      JSON.stringify(newVideo, null, 2)
    );

    if (editingVideo) {
      editVideo(newVideo);
      setEditingVideo(null);
    } else {
      addVideo(newVideo);
    }

    const updatedVideos = {
      desenhos: videos.desenhos || [],
      filmes: videos.filmes || [],
      musicas: videos.musicas || [],
    };
    if (editingVideo) {
      updatedVideos[category.toLowerCase()] = updatedVideos[
        category.toLowerCase()
      ].map((v) => (v.id === newVideo.id ? newVideo : v));
    } else {
      updatedVideos[category.toLowerCase()].push(newVideo);
    }
    // Salva apenas localmente, sem integração com GitHub
    localStorage.setItem("videos", JSON.stringify(updatedVideos));

    setTitle("");
    setUrl("");
    setLocalFile(null);
    setCustomImage(null);
    setCategory("Desenhos");
  };

  const handleEdit = (video) => {
    setEditingVideo(video);
    setTitle(video.title);
    setUrl(video.isLocal ? "" : video.url);
    setLocalFile(null);
    setCustomImage(null);
    setCategory(video.category);
    setIsFormVisible(true);
    setShowPassword(false);
  };

  const handleDelete = (videoId) => {
    deleteVideo(videoId);

    const updatedVideos = {
      desenhos: (videos.desenhos || []).filter((v) => v.id !== videoId),
      filmes: (videos.filmes || []).filter((v) => v.id !== videoId),
      musicas: (videos.musicas || []).filter((v) => v.id !== videoId),
    };
    // Salva apenas localmente, sem integração com GitHub
    localStorage.setItem("videos", JSON.stringify(updatedVideos));
  };

  const handleSaveChanges = () => {
    const updatedVideos = {
      desenhos: videos.desenhos || [],
      filmes: videos.filmes || [],
      musicas: videos.musicas || [],
    };
    localStorage.setItem("videos", JSON.stringify(updatedVideos));
    alert("Alterações salvas com sucesso localmente!");
  };

  const handleToggleForm = () => {
    if (window.innerWidth <= 1024) return;
    if (isFormVisible) {
      setIsFormVisible(false);
      setShowPassword(false);
      setPassword("");
      setEditingVideo(null);
      if (window.innerWidth < 768) toggleForm();
    } else {
      setShowPassword(true);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (window.innerWidth <= 1024) return;
    if (password === correctPassword) {
      setIsFormVisible(true);
      setShowPassword(false);
      setPassword("");
      if (window.innerWidth < 768) toggleForm();
    } else {
      alert("Senha incorreta!");
      setPassword("");
    }
  };

  return window.innerWidth > 1024 ? (
    <div
      className={`${styles.formContainer} ${
        isFormVisible || showPassword ? styles.formOpen : ""
      }`}
    >
      {showPassword ? (
        <form onSubmit={handlePasswordSubmit} className={styles.form}>
          <input
            type="password"
            placeholder="Digite a senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className={styles.submitBtn}>
            Entrar
          </button>
        </form>
      ) : isFormVisible ? (
        <div>
          <form className={styles.form} onSubmit={handleSubmit}>
            <h2>{editingVideo ? "EDITAR VÍDEO" : "ADICIONAR NOVO VÍDEO"}</h2>
            <input
              type="text"
              placeholder="NOME DO CARD"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="url"
              placeholder="LINK DO YOUTUBE (OPCIONAL)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={localFile}
            />
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              disabled={url}
            />
            {localFile && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            )}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Desenhos">DESENHOS</option>
              <option value="Filmes">FILMES</option>
              <option value="Músicas">MÚSICAS</option>
            </select>
            <button type="submit" className={styles.submitBtn}>
              {editingVideo ? "SALVAR" : "ADICIONAR"}
            </button>
          </form>
          <div className={styles.videoList}>
            <h3>VÍDEOS EXISTENTES</h3>
            {Object.values(videos).flat().length > 0 ? (
              Object.values(videos)
                .flat()
                .map((video) => (
                  <div key={video.id} className={styles.videoItem}>
                    <span
                      id="videoTitle"
                      style={{ fontSize: "10px", color: "#fff" }}
                    >
                      {video.title.toUpperCase()} (
                      {video.category.toUpperCase()}){" "}
                      {video.isLocal ? "[LOCAL]" : "[YOUTUBE]"}
                    </span>
                    <button
                      onClick={() => handleEdit(video)}
                      className={styles.editBtn}
                    >
                      EDITAR
                    </button>
                    <button
                      onClick={() => handleDelete(video.id)}
                      className={styles.deleteBtn}
                    >
                      EXCLUIR
                    </button>
                  </div>
                ))
            ) : (
              <p style={{ color: "white" }}>Nenhum vídeo disponível.</p>
            )}
          </div>
          <button onClick={handleSaveChanges} className={styles.submitBtn}>
            SALVAR ALTERAÇÕES
          </button>
          <button onClick={handleToggleForm} className={styles.submitBtn}>
            FECHAR FORMULÁRIO
          </button>
        </div>
      ) : (
        <button onClick={handleToggleForm} className={styles.submitBtn}>
          ADICIONAR VÍDEOS
        </button>
      )}
    </div>
  ) : null;
}

export default VideoForm;
