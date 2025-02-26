import React, { useState } from "react";
import useVoiceCommand from "../hooks/useVoiceCommand";
import styles from "../styles/Menu.module.css";
import IconDesenho from "../assets/icon-desenho.svg";
import IconFilme from "../assets/icon-filme.svg";
import IconMusica from "../assets/icon-musica.svg";
import IconYa from "../assets/icon-ya.svg";
import IconForm from "../assets/icon-form.svg";

function Menu({ switchTheme, closePlayer, setCurrentVideo, toggleForm }) {
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { listening, startListening } = useVoiceCommand(null);

  const toggleMenu = () => {
    setIsHidden(!isHidden);
    if (!isHidden && closePlayer) {
      closePlayer();
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCategoryClick = (category) => {
    if (closePlayer) {
      closePlayer();
      setIsHidden(false);
      setIsMobileMenuOpen(false);
    }
    if (window.innerWidth < 768 && category) {
      // Remove acentos para garantir correspondência com o ID
      const normalizedCategory = category.toLowerCase().replace("ú", "u");
      const categoryElement = document.getElementById(
        `category-${normalizedCategory}`
      );
      if (categoryElement) {
        categoryElement.scrollIntoView({ behavior: "smooth" });
      } else {
        console.log(`Elemento category-${normalizedCategory} não encontrado`);
      }
    }
  };

  const handleFormOpen = () => {
    setIsMobileMenuOpen(false);
    toggleForm();
  };

  return (
    <>
      <div className={styles.mobileMenuToggle} onClick={toggleMobileMenu}>
        <div
          className={`${styles.hamburger} ${
            isMobileMenuOpen ? styles.open : ""
          }`}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <footer className={`${styles.menu} ${isHidden ? styles.hidden : ""}`}>
        <div
          onClick={() => handleCategoryClick("Desenhos")}
          className={styles.menuItem}
        >
          <img src={IconDesenho} alt="Desenhos" className={styles.icon} />
        </div>
        <div
          onClick={() => handleCategoryClick("Filmes")}
          className={styles.menuItem}
        >
          <img src={IconFilme} alt="Filmes" className={styles.icon} />
        </div>
        <div
          onClick={() => handleCategoryClick("Músicas")}
          className={styles.menuItem}
        >
          <img src={IconMusica} alt="Músicas" className={styles.icon} />
        </div>
        <div
          onClick={startListening}
          className={`${styles.menuItem} ${listening ? styles.listening : ""}`}
          aria-label="Falar com Ya-minuelle"
        >
          <img src={IconYa} alt="Ícone YA" className={styles.icon} />
        </div>
      </footer>

      <div
        className={`${styles.mobileMenu} ${
          isMobileMenuOpen ? styles.mobileOpen : ""
        }`}
      >
        <div
          onClick={() => handleCategoryClick("Desenhos")}
          className={styles.menuItem}
        >
          <img src={IconDesenho} alt="Desenhos" className={styles.icon} />
        </div>
        <div
          onClick={() => handleCategoryClick("Filmes")}
          className={styles.menuItem}
        >
          <img src={IconFilme} alt="Filmes" className={styles.icon} />
        </div>
        <div
          onClick={() => handleCategoryClick("Músicas")}
          className={styles.menuItem}
        >
          <img src={IconMusica} alt="Músicas" className={styles.icon} />
        </div>
        <div
          onClick={startListening}
          className={`${styles.menuItem} ${listening ? styles.listening : ""}`}
          aria-label="Falar com Ya-minuelle"
        >
          <img src={IconYa} alt="Ícone YA" className={styles.icon} />
        </div>
        <div onClick={handleFormOpen} className={styles.menuItem}>
          <img src={IconForm} alt="Formulário" className={styles.icon} />
        </div>
      </div>
    </>
  );
}

export default Menu;
