import styles from "../styles/Card.module.css";

function Card({
  videos = { desenhos: [], filmes: [], musicas: [] },
  onCardClick,
}) {
  const categories = ["Desenhos", "Filmes", "Músicas"];

  console.log("Vídeos no Card (detalhes):", JSON.stringify(videos, null, 2));

  if (!videos || Object.keys(videos).length === 0) {
    return (
      <p style={{ color: "white" }}>
        Nenhum vídeo disponível. Adicione vídeos via formulário.
      </p>
    );
  }

  return (
    <section className={styles.cardContainer}>
      {categories.map((category) => {
        const lowerCategory = category.toLowerCase().replace("ú", "u");
        return (
          <div
            key={category}
            id={`category-${lowerCategory}`}
            className={styles.category}
          >
            <h2>{category}</h2>
            <div className={styles.cards}>
              {videos[lowerCategory] && videos[lowerCategory].length > 0
                ? videos[lowerCategory]
                    .filter((video) => {
                      const videoCategory = video.category
                        ? video.category.toLowerCase().replace("ú", "u").trim()
                        : "";
                      console.log(
                        `Filtrando ${video.title} - Categoria: ${videoCategory}, Esperado: ${lowerCategory}`
                      );
                      return videoCategory === lowerCategory;
                    })
                    .map((video) => (
                      <div
                        key={video.id}
                        className={styles.card}
                        onClick={() => onCardClick(video)}
                      >
                        <img
                          src={
                            video.isLocal
                              ? video.image || "./default-video.jpg"
                              : video.image
                          }
                          alt={video.title}
                          className={styles.icon}
                          onError={(e) => {
                            e.target.src = "./default-video.jpg";
                          }}
                        />
                        <p>{video.title}</p>
                      </div>
                    ))
                : null}
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default Card;
