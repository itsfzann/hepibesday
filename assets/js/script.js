document.addEventListener("DOMContentLoaded", () => {
  // =========================================
  // 1. ELEMENT UTAMA
  // =========================================

  const welcomeScreen = document.getElementById("welcomeScreen");
  const welcomeEnvelope = document.getElementById("welcomeEnvelope");
  const openGiftBtn = document.getElementById("openGiftBtn");
  const mainContent = document.getElementById("mainContent");

  // =========================================
  // 2. OPENING / PEMBUKA HADIAH
  // =========================================

  if (openGiftBtn) {
    openGiftBtn.addEventListener("click", () => {
      if (welcomeEnvelope) {
        welcomeEnvelope.classList.add("open");
      }

      setTimeout(() => {
        welcomeScreen?.classList.add("hide");
        mainContent?.classList.add("show");

        document.body.classList.remove("welcome-active");

        document.getElementById("hero")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 500);

      // Musik mulai setelah pengunjung menekan tombol.
      // Browser biasanya memblokir autoplay sebelum ada interaksi.
      playMusic();
    });
  }

  // =========================================
  // 3. BACKGROUND MUSIC PLAYER
  // =========================================

  const audio = document.getElementById("backgroundMusic");
  const musicToggle = document.getElementById("musicToggle");
  const musicCurrentTime = document.getElementById("musicCurrentTime");
  const musicProgress = document.getElementById("musicProgress");
  const musicDuration = document.getElementById("musicDuration");
  const musicVolume = document.getElementById("musicVolume");
  const musicHideBtn = document.getElementById("musicHideBtn");
  const musicShowBtn = document.getElementById("musicShowBtn");
  const musicPlayer = document.getElementById("musicPlayer");

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  function updateMusicButton() {
    if (!musicToggle || !audio) return;

    musicToggle.textContent = audio.paused ? "▶" : "Ⅱ";
    musicToggle.setAttribute(
      "aria-label",
      audio.paused ? "Putar musik" : "Jeda musik",
    );
  }

  function playMusic() {
    if (!audio) return;

    audio
      .play()
      .then(updateMusicButton)
      .catch(() => {
        updateMusicButton();
      });
  }

  function pauseMusic() {
    if (!audio) return;

    audio.pause();
    updateMusicButton();
  }

  if (musicToggle && audio) {
    musicToggle.addEventListener("click", () => {
      if (audio.paused) {
        playMusic();
      } else {
        pauseMusic();
      }
    });

    audio.addEventListener("play", updateMusicButton);
    audio.addEventListener("pause", updateMusicButton);

    audio.addEventListener("loadedmetadata", () => {
      if (musicDuration) {
        musicDuration.textContent = formatTime(audio.duration);
      }
    });

    audio.addEventListener("timeupdate", () => {
      if (musicCurrentTime) {
        musicCurrentTime.textContent = formatTime(audio.currentTime);
      }

      if (musicProgress && Number.isFinite(audio.duration)) {
        musicProgress.value = (audio.currentTime / audio.duration) * 100;
      }
    });

    audio.addEventListener("ended", () => {
      updateMusicButton();
    });
  }

  if (musicProgress && audio) {
    musicProgress.addEventListener("input", () => {
      if (!Number.isFinite(audio.duration)) return;

      audio.currentTime = (Number(musicProgress.value) / 100) * audio.duration;
    });
  }

  if (musicVolume && audio) {
    audio.volume = Number(musicVolume.value);

    musicVolume.addEventListener("input", () => {
      audio.volume = Number(musicVolume.value);
    });
  }

  if (musicHideBtn && musicPlayer && musicShowBtn) {
    musicHideBtn.addEventListener("click", () => {
      musicPlayer.hidden = true;
      musicShowBtn.hidden = false;
    });

    musicShowBtn.addEventListener("click", () => {
      musicPlayer.hidden = false;
      musicShowBtn.hidden = true;
    });
  }

  // =========================================
  // 4. GALLERY / LIGHTBOX
  // =========================================

  const galleryImages = Array.from(document.querySelectorAll(".gallery-image"));

  const galleryLightbox = document.getElementById("galleryLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  let currentImageIndex = 0;

  function getImageCaption(image) {
    const polaroid = image.closest(".polaroid");
    const caption = polaroid?.querySelector("p");

    return caption?.textContent.trim() || "A pretty little memory ♡";
  }

  function showGalleryImage(index) {
    if (!galleryImages.length || !lightboxImage) return;

    currentImageIndex = (index + galleryImages.length) % galleryImages.length;

    const selectedImage = galleryImages[currentImageIndex];

    lightboxImage.src = selectedImage.src;
    lightboxImage.alt = selectedImage.alt || "Gallery photo";

    if (lightboxCaption) {
      lightboxCaption.textContent = getImageCaption(selectedImage);
    }
  }

  function openLightbox(index) {
    if (!galleryLightbox) return;

    showGalleryImage(index);
    galleryLightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!galleryLightbox) return;

    galleryLightbox.hidden = true;
    document.body.style.overflow = "";
  }

  galleryImages.forEach((image, index) => {
    image.addEventListener("click", () => {
      openLightbox(index);
    });
  });

  lightboxClose?.addEventListener("click", closeLightbox);

  lightboxPrev?.addEventListener("click", () => {
    showGalleryImage(currentImageIndex - 1);
  });

  lightboxNext?.addEventListener("click", () => {
    showGalleryImage(currentImageIndex + 1);
  });

  galleryLightbox?.addEventListener("click", (event) => {
    if (event.target === galleryLightbox) {
      closeLightbox();
    }
  });

  // =========================================
  // 5. FLIP CARDS
  // =========================================

  const flipCards = document.querySelectorAll(".flip-card");

  flipCards.forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("active");
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        card.classList.toggle("active");
      }
    });
  });

  // =========================================
  // 6. LITTLE QUIZ
  // =========================================

  const quizQuestionNumber = document.getElementById("quizQuestionNumber");
  const quizProgressFill = document.getElementById("quizProgressFill");
  const quizContent = document.getElementById("quizContent");
  const quizQuestion = document.getElementById("quizQuestion");
  const quizOptions = document.getElementById("quizOptions");
  const quizFeedback = document.getElementById("quizFeedback");
  const quizNextBtn = document.getElementById("quizNextBtn");
  const quizResult = document.getElementById("quizResult");
  const quizScore = document.getElementById("quizScore");
  const quizRestartBtn = document.getElementById("quizRestartBtn");

  const quizQuestions = [
    {
      question: "Kalau kamu jadi makanan, kira-kira kamu jadi apa?",
      options: [
        "Strawberry cake 🍰",
        "Seblak pedas 🌶️",
        "Es krim vanilla 🍦",
        "Cokelat manis 🍫",
      ],
      answer: 0,
      correctText: "Manis, cantik, dan bikin nagih. Mirip kamu! ♡",
      wrongText:
        "Hmm, boleh juga. Tapi jawaban paling cocok tetap strawberry cake!",
    },
    {
      question: "Apa yang paling mungkin kamu lakukan saat bosan?",
      options: [
        "Tidur sebentar",
        "Scroll HP tanpa tujuan",
        "Cari makanan",
        "Semua benar!",
      ],
      answer: 3,
      correctText: "Wah, sepertinya kita sudah tahu kebiasaanmu! 😂",
      wrongText: "Coba pikir lagi. Kayaknya semuanya pernah kamu lakukan!",
    },
    {
      question: "Kalau ada yang memberi kamu hadiah, kamu akan...",
      options: [
        "Langsung membukanya",
        "Senyum dulu",
        "Penasaran banget",
        "Semua jawaban benar",
      ],
      answer: 3,
      correctText: "Tidak bisa menyembunyikan rasa penasaran, ya? ♡",
      wrongText: "Sepertinya kamu terlalu penasaran untuk memilih satu!",
    },
    {
      question: "Apa yang membuat hari biasa jadi lebih menyenangkan?",
      options: [
        "Makanan enak",
        "Tidur cukup",
        "Hal-hal kecil yang manis",
        "Ada seseorang yang bikin senyum",
      ],
      answer: 2,
      correctText: "Benar! Hal kecil pun bisa jadi kenangan indah.",
      wrongText: "Jawabanmu masuk akal, tapi ada satu yang lebih spesial!",
    },
    {
      question: "Siapa orang paling spesial yang sedang membaca ini?",
      options: [
        "Orang yang cantik",
        "Orang yang manis",
        "Orang yang luar biasa",
        "Kamu, tentu saja! ♡",
      ],
      answer: 3,
      correctText: "YES! Akhirnya ada jawaban yang benar-benar tepat! 💗",
      wrongText: "Coba lagi. Petunjuknya: orang itu sedang melihat layar ini.",
    },
  ];

  let currentQuestion = 0;
  let quizTotalScore = 0;
  let quizAnswered = false;

  function renderQuiz() {
    if (
      !quizQuestion ||
      !quizOptions ||
      !quizQuestionNumber ||
      !quizProgressFill
    )
      return;

    const question = quizQuestions[currentQuestion];

    quizAnswered = false;

    quizQuestionNumber.textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;

    quizProgressFill.style.width = `${(currentQuestion / quizQuestions.length) * 100}%`;

    quizQuestion.textContent = question.question;
    quizOptions.replaceChildren();

    if (quizFeedback) {
      quizFeedback.textContent = "";
      quizFeedback.className = "quiz-feedback";
    }

    if (quizNextBtn) {
      quizNextBtn.hidden = true;
      quizNextBtn.textContent =
        currentQuestion === quizQuestions.length - 1
          ? "See my result ♡"
          : "Next question →";
    }

    question.options.forEach((option, index) => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "quiz-option";
      button.textContent = option;

      button.addEventListener("click", () => {
        selectQuizAnswer(index);
      });

      quizOptions.appendChild(button);
    });
  }

  function selectQuizAnswer(selectedIndex) {
    if (quizAnswered) return;

    quizAnswered = true;

    const question = quizQuestions[currentQuestion];
    const options = quizOptions.querySelectorAll(".quiz-option");
    const isCorrect = selectedIndex === question.answer;

    if (isCorrect) {
      quizTotalScore++;
    }

    options.forEach((button, index) => {
      button.disabled = true;

      if (index === question.answer) {
        button.classList.add("correct");
      } else if (index === selectedIndex) {
        button.classList.add("wrong");
      }
    });

    if (quizFeedback) {
      quizFeedback.textContent = isCorrect
        ? question.correctText
        : question.wrongText;

      quizFeedback.classList.add(isCorrect ? "correct" : "wrong");
    }

    if (quizNextBtn) {
      quizNextBtn.hidden = false;
    }
  }

  function showQuizResult() {
    if (quizContent) quizContent.hidden = true;
    if (quizResult) quizResult.hidden = false;

    if (quizScore) {
      quizScore.textContent = `${quizTotalScore} / ${quizQuestions.length}`;
    }

    if (quizProgressFill) {
      quizProgressFill.style.width = "100%";
    }
  }

  quizNextBtn?.addEventListener("click", () => {
    if (!quizAnswered) return;

    if (currentQuestion < quizQuestions.length - 1) {
      currentQuestion++;
      renderQuiz();
    } else {
      showQuizResult();
    }
  });

  function restartQuiz() {
    currentQuestion = 0;
    quizTotalScore = 0;
    quizAnswered = false;

    if (quizContent) quizContent.hidden = false;
    if (quizResult) quizResult.hidden = true;

    renderQuiz();
  }

  quizRestartBtn?.addEventListener("click", restartQuiz);

  if (quizQuestion && quizOptions) {
    renderQuiz();
  }

  // =========================================
  // 7. BIRTHDAY CAKE / BLOW CANDLES
  // =========================================

  const birthdayCake = document.getElementById("birthdayCake");
  const blowCandlesBtn = document.getElementById("blowCandlesBtn");
  const cakeMessage = document.getElementById("cakeMessage");

  blowCandlesBtn?.addEventListener("click", () => {
    if (!birthdayCake) return;

    const flames = birthdayCake.querySelectorAll(".flame");

    flames.forEach((flame, index) => {
      setTimeout(() => {
        flame.classList.add("extinguished");
      }, index * 250);
    });

    blowCandlesBtn.disabled = true;
    blowCandlesBtn.textContent = "Wish made! ♡";

    if (cakeMessage) {
      cakeMessage.hidden = false;
      cakeMessage.textContent =
        "May all your little wishes find their way to you. ♡";
    }
  });

  // =========================================
  // 8. FORTUNE COOKIE
  // =========================================

  const fortuneCookieBtn = document.getElementById("fortuneCookieBtn");
  const fortuneMessage = document.getElementById("fortuneMessage");
  const fortuneText = document.getElementById("fortuneText");
  const anotherFortuneBtn = document.getElementById("anotherFortuneBtn");

  const fortunes = [
    "A beautiful chapter is waiting to begin. ♡",
    "You deserve all the happiness you give to others.",
    "Something lovely is on its way to you.",
    "Never forget how special you are.",
    "Your smile makes ordinary days feel magical.",
    "More laughter, more love, and more unforgettable memories await you.",
    "The best things in life are often the little things.",
    "You are someone's favorite kind of sunshine. ☀️",
    "Keep blooming, even in your own little way. 🌷",
    "May this new age bring you closer to every dream.",
  ];

  let previousFortune = -1;

  function revealFortune() {
    if (!fortuneText || !fortuneMessage) return;

    let randomIndex;

    do {
      randomIndex = Math.floor(Math.random() * fortunes.length);
    } while (fortunes.length > 1 && randomIndex === previousFortune);

    previousFortune = randomIndex;

    fortuneText.textContent = fortunes[randomIndex];
    fortuneMessage.hidden = false;

    if (fortuneCookieBtn) {
      fortuneCookieBtn.classList.add("opened");
    }
  }

  fortuneCookieBtn?.addEventListener("click", revealFortune);
  anotherFortuneBtn?.addEventListener("click", revealFortune);

  // =========================================
  // 9. LOVE LETTER
  // =========================================

  const letterEnvelope = document.getElementById("letterEnvelope");
  const openLetterBtn = document.getElementById("openLetterBtn");

  openLetterBtn?.addEventListener("click", () => {
    if (!letterEnvelope) return;

    const isOpen = letterEnvelope.classList.toggle("open");

    openLetterBtn.textContent = isOpen
      ? "Close the letter ♡"
      : "Open the letter ♡";
  });

  // =========================================
  // 10. SECRET MESSAGE / PASSWORD
  // =========================================

  const passwordForm = document.getElementById("passwordForm");
  const secretPassword = document.getElementById("secretPassword");
  const secretFeedback = document.getElementById("secretFeedback");
  const secretContent = document.getElementById("secretContent");
  const secretLock = document.getElementById("secretLock");

  // GANTI dengan tanggal spesial pilihanmu.
  // Format: DDMMYYYY. Contoh format: 02012026.
  const SECRET_PASSWORD = "02012026";

  passwordForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!secretPassword) return;

    const enteredPassword = secretPassword.value.trim();

    if (enteredPassword === SECRET_PASSWORD) {
      if (secretFeedback) {
        secretFeedback.textContent = "You found the secret! ♡";
        secretFeedback.className = "secret-feedback success";
      }

      if (secretContent) {
        secretContent.hidden = false;
      }

      if (secretLock) {
        secretLock.hidden = true;
      }

      secretPassword.disabled = true;
    } else {
      if (secretFeedback) {
        secretFeedback.textContent =
          "Oops! That's not the right date. Try again, sweetheart ♡";

        secretFeedback.className = "secret-feedback error";
      }

      secretPassword.value = "";
      secretPassword.focus();
    }
  });

  // =========================================
  // 11. START AGAIN
  // =========================================

  const startAgainBtn = document.getElementById("startAgainBtn");

  startAgainBtn?.addEventListener("click", () => {
    // Kembali ke halaman pembuka.
    welcomeScreen?.classList.remove("hide");
    mainContent?.classList.remove("show");
    welcomeEnvelope?.classList.remove("open");

    document.body.classList.add("welcome-active");

    // Reset beberapa fitur.
    restartQuiz();

    birthdayCake?.querySelectorAll(".flame").forEach((flame) => {
      flame.classList.remove("extinguished");
    });

    if (blowCandlesBtn) {
      blowCandlesBtn.disabled = false;
      blowCandlesBtn.textContent = "Blow the candles ♡";
    }

    if (cakeMessage) {
      cakeMessage.hidden = true;
    }

    if (fortuneMessage) {
      fortuneMessage.hidden = true;
    }

    if (letterEnvelope) {
      letterEnvelope.classList.remove("open");
    }

    if (openLetterBtn) {
      openLetterBtn.textContent = "Open the letter ♡";
    }

    if (secretContent) {
      secretContent.hidden = true;
    }

    if (secretLock) {
      secretLock.hidden = false;
    }

    if (secretPassword) {
      secretPassword.disabled = false;
      secretPassword.value = "";
    }

    if (secretFeedback) {
      secretFeedback.textContent = "";
      secretFeedback.className = "secret-feedback";
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // =========================================
  // 12. CURSOR HEART EFFECT
  // =========================================

  const cursorEffects = document.getElementById("cursorEffects");

  const supportsFinePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;

  if (cursorEffects && supportsFinePointer) {
    let lastCursorEffect = 0;

    document.addEventListener("mousemove", (event) => {
      const now = Date.now();

      // Membatasi jumlah efek agar tidak terlalu berat.
      if (now - lastCursorEffect < 90) return;

      lastCursorEffect = now;

      const heart = document.createElement("span");

      heart.className = "cursor-heart";
      heart.textContent = Math.random() > 0.5 ? "♡" : "✧";

      heart.style.left = `${event.clientX}px`;
      heart.style.top = `${event.clientY}px`;

      cursorEffects.appendChild(heart);

      heart.addEventListener("animationend", () => {
        heart.remove();
      });
    });
  }

  // =========================================
  // 13. KEYBOARD SHORTCUT LIGHTBOX
  // =========================================

  document.addEventListener("keydown", (event) => {
    if (!galleryLightbox || galleryLightbox.hidden) return;

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowRight") {
      showGalleryImage(currentImageIndex + 1);
    }

    if (event.key === "ArrowLeft") {
      showGalleryImage(currentImageIndex - 1);
    }
  });

  // =========================================
  // 14. INITIAL STATE
  // =========================================

  document.body.classList.add("welcome-active");
  updateMusicButton();
});
