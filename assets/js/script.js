document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // =========================================
  // 1. HELPER FUNCTIONS
  // =========================================

  const $ = (selector, parent = document) => parent.querySelector(selector);

  const $$ = (selector, parent = document) => [
    ...parent.querySelectorAll(selector),
  ];

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remaining = Math.floor(seconds % 60);

    return `${minutes}:${String(remaining).padStart(2, "0")}`;
  };

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // =========================================
  // 2. ELEMENT UTAMA
  // =========================================

  const welcomeScreen = $("#welcomeScreen");
  const welcomeEnvelope = $("#welcomeEnvelope");
  const openGiftBtn = $("#openGiftBtn");
  const mainContent = $("#mainContent");

  let isOpening = false;
  let isResetting = false;

  // =========================================
  // 3. CONFETTI EFFECT
  // =========================================

  function createConfetti(amount = 35) {
    if (prefersReducedMotion) return;

    const colors = ["#f4a6bd", "#f8d6df", "#d9a5b5", "#ffffff", "#e8c5a5"];

    const container = document.createDocumentFragment();

    for (let i = 0; i < amount; i++) {
      const particle = document.createElement("span");

      particle.textContent = Math.random() > 0.5 ? "♡" : "✧";

      particle.style.cssText = `
        position: fixed;
        z-index: 99999;
        left: ${Math.random() * 100}vw;
        top: -20px;
        pointer-events: none;
        color: ${colors[Math.floor(Math.random() * colors.length)]};
        font-size: ${12 + Math.random() * 18}px;
        animation: birthdayConfetti ${2 + Math.random() * 2}s ease-out forwards;
      `;

      container.appendChild(particle);

      particle.addEventListener("animationend", () => {
        particle.remove();
      });
    }

    document.body.appendChild(container);
  }

  if (!$("#birthday-confetti-style")) {
    const style = document.createElement("style");

    style.id = "birthday-confetti-style";

    style.textContent = `
      @keyframes birthdayConfetti {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(110vh) rotate(720deg);
          opacity: 0;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          scroll-behavior: auto !important;
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  // =========================================
  // 4. BACKGROUND MUSIC PLAYER
  // =========================================

  const audio = $("#backgroundMusic");
  const musicToggle = $("#musicToggle");
  const musicCurrentTime = $("#musicCurrentTime");
  const musicProgress = $("#musicProgress");
  const musicDuration = $("#musicDuration");
  const musicVolume = $("#musicVolume");
  const musicHideBtn = $("#musicHideBtn");
  const musicShowBtn = $("#musicShowBtn");
  const musicPlayer = $("#musicPlayer");

  let musicWasPlaying = false;

  function updateMusicButton() {
    if (!musicToggle || !audio) return;

    musicToggle.textContent = audio.paused ? "▶" : "Ⅱ";

    musicToggle.setAttribute(
      "aria-label",
      audio.paused ? "Putar musik" : "Jeda musik",
    );

    musicToggle.setAttribute("aria-pressed", String(!audio.paused));

    const vinyl = $(".music-vinyl");

    if (vinyl) {
      vinyl.classList.toggle("playing", !audio.paused);
    }
  }

  async function playMusic() {
    if (!audio) return;

    try {
      await audio.play();
    } catch (error) {
      console.warn("Musik tidak dapat diputar:", error);
    }

    updateMusicButton();
  }

  function pauseMusic() {
    if (!audio) return;

    audio.pause();
    updateMusicButton();
  }

  function updateMusicProgress() {
    if (!audio) return;

    if (musicCurrentTime) {
      musicCurrentTime.textContent = formatTime(audio.currentTime);
    }

    if (musicProgress && Number.isFinite(audio.duration)) {
      musicProgress.value = (audio.currentTime / audio.duration) * 100;
    }
  }

  if (audio) {
    audio.addEventListener("play", updateMusicButton);
    audio.addEventListener("pause", updateMusicButton);
    audio.addEventListener("ended", updateMusicButton);

    audio.addEventListener("loadedmetadata", () => {
      if (musicDuration) {
        musicDuration.textContent = formatTime(audio.duration);
      }

      updateMusicProgress();
    });

    audio.addEventListener("timeupdate", updateMusicProgress);

    audio.addEventListener("volumechange", () => {
      if (musicVolume) {
        musicVolume.value = audio.volume;
      }
    });
  }

  musicToggle?.addEventListener("click", () => {
    if (!audio) return;

    audio.paused ? playMusic() : pauseMusic();
  });

  musicProgress?.addEventListener("input", () => {
    if (!audio || !Number.isFinite(audio.duration)) return;

    audio.currentTime = (Number(musicProgress.value) / 100) * audio.duration;
  });

  musicVolume?.addEventListener("input", () => {
    if (!audio) return;

    audio.volume = Number(musicVolume.value);
  });

  musicHideBtn?.addEventListener("click", () => {
    if (musicPlayer) musicPlayer.hidden = true;
    if (musicShowBtn) musicShowBtn.hidden = false;
  });

  musicShowBtn?.addEventListener("click", () => {
    if (musicPlayer) musicPlayer.hidden = false;
    if (musicShowBtn) musicShowBtn.hidden = true;
  });

  // =========================================
  // 5. OPENING EXPERIENCE
  // =========================================

  async function openGift() {
    if (isOpening || isResetting) return;

    isOpening = true;

    if (openGiftBtn) {
      openGiftBtn.disabled = true;
    }

    welcomeEnvelope?.classList.add("open");

    createConfetti(45);

    // Musik dimulai melalui interaksi pengguna.
    await playMusic();

    await wait(500);

    welcomeScreen?.classList.add("hide");
    mainContent?.classList.add("show");

    document.body.classList.remove("welcome-active");

    await wait(prefersReducedMotion ? 0 : 300);

    $("#hero")?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });

    isOpening = false;
  }

  openGiftBtn?.addEventListener("click", openGift);

  // =========================================
  // 6. GALLERY / LIGHTBOX
  // =========================================

  const galleryImages = $$(".gallery-image");

  const galleryLightbox = $("#galleryLightbox");
  const lightboxImage = $("#lightboxImage");
  const lightboxCaption = $("#lightboxCaption");
  const lightboxClose = $("#lightboxClose");
  const lightboxPrev = $("#lightboxPrev");
  const lightboxNext = $("#lightboxNext");

  let currentImageIndex = 0;
  let touchStartX = 0;

  // Counter otomatis dibuat jika belum tersedia.
  let lightboxCounter = $("#lightboxCounter");

  if (galleryLightbox && !lightboxCounter) {
    lightboxCounter = document.createElement("span");

    lightboxCounter.id = "lightboxCounter";
    lightboxCounter.setAttribute("aria-live", "polite");

    galleryLightbox.appendChild(lightboxCounter);
  }

  function getImageCaption(image) {
    const polaroid = image.closest(".polaroid");
    const caption = $("p", polaroid || document.createElement("div"));

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

    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
    }
  }

  function openLightbox(index) {
    if (!galleryLightbox) return;

    showGalleryImage(index);

    galleryLightbox.hidden = false;
    document.body.style.overflow = "hidden";

    lightboxClose?.focus();
  }

  function closeLightbox() {
    if (!galleryLightbox || galleryLightbox.hidden) return;

    galleryLightbox.hidden = true;
    document.body.style.overflow = "";

    galleryImages[currentImageIndex]?.focus?.();
  }

  function nextGalleryImage() {
    showGalleryImage(currentImageIndex + 1);
  }

  function previousGalleryImage() {
    showGalleryImage(currentImageIndex - 1);
  }

  galleryImages.forEach((image, index) => {
    image.addEventListener("click", () => {
      openLightbox(index);
    });
  });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightboxNext?.addEventListener("click", nextGalleryImage);
  lightboxPrev?.addEventListener("click", previousGalleryImage);

  galleryLightbox?.addEventListener("click", (event) => {
    if (event.target === galleryLightbox) {
      closeLightbox();
    }
  });

  galleryLightbox?.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].screenX;
    },
    { passive: true },
  );

  galleryLightbox?.addEventListener(
    "touchend",
    (event) => {
      const touchEndX = event.changedTouches[0].screenX;
      const difference = touchEndX - touchStartX;

      if (Math.abs(difference) < 50) return;

      if (difference < 0) {
        nextGalleryImage();
      } else {
        previousGalleryImage();
      }
    },
    { passive: true },
  );

  // =========================================
  // 7. FLIP CARDS
  // =========================================

  const flipCards = $$(".flip-card");

  flipCards.forEach((card) => {
    card.addEventListener("click", () => {
      const isActive = card.classList.toggle("active");

      card.setAttribute("aria-pressed", String(isActive));
    });

    card.addEventListener("keydown", (event) => {
      if (
        (event.key === "Enter" || event.key === " ") &&
        event.target === card
      ) {
        event.preventDefault();

        const isActive = card.classList.toggle("active");

        card.setAttribute("aria-pressed", String(isActive));
      }
    });
  });

  // =========================================
  // 8. LITTLE QUIZ
  // =========================================

  const quizQuestionNumber = $("#quizQuestionNumber");
  const quizProgressFill = $("#quizProgressFill");
  const quizContent = $("#quizContent");
  const quizQuestion = $("#quizQuestion");
  const quizOptions = $("#quizOptions");
  const quizFeedback = $("#quizFeedback");
  const quizNextBtn = $("#quizNextBtn");
  const quizResult = $("#quizResult");
  const quizScore = $("#quizScore");
  const quizRestartBtn = $("#quizRestartBtn");

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
      wrongText: "Hmm, jawaban paling cocok tetap strawberry cake!",
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
      wrongText: "Petunjuknya: orang itu sedang melihat layar ini.",
    },
  ];

  let currentQuestion = 0;
  let quizTotalScore = 0;
  let quizAnswered = false;

  function renderQuiz() {
    if (!quizQuestion || !quizOptions) return;

    const question = quizQuestions[currentQuestion];

    quizAnswered = false;

    if (quizQuestionNumber) {
      quizQuestionNumber.textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
    }

    if (quizProgressFill) {
      quizProgressFill.style.width = `${(currentQuestion / quizQuestions.length) * 100}%`;
    }

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
    const options = $$(".quiz-option", quizOptions);

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

      quizFeedback.className = `quiz-feedback ${isCorrect ? "correct" : "wrong"}`;
    }

    if (quizNextBtn) {
      quizNextBtn.hidden = false;
    }

    if (isCorrect) {
      createConfetti(12);
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

    createConfetti(50);
  }

  function restartQuiz() {
    currentQuestion = 0;
    quizTotalScore = 0;
    quizAnswered = false;

    if (quizContent) quizContent.hidden = false;
    if (quizResult) quizResult.hidden = true;

    renderQuiz();
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

  quizRestartBtn?.addEventListener("click", restartQuiz);

  if (quizQuestion && quizOptions) {
    renderQuiz();
  }

  // =========================================
  // 9. BIRTHDAY CAKE
  // =========================================

  const birthdayCake = $("#birthdayCake");
  const blowCandlesBtn = $("#blowCandlesBtn");
  const cakeMessage = $("#cakeMessage");

  let candlesBlown = false;

  async function blowCandles() {
    if (!birthdayCake || candlesBlown) return;

    candlesBlown = true;

    const flames = $$(".flame", birthdayCake);

    for (const flame of flames) {
      flame.classList.add("extinguished");
      await wait(200);
    }

    if (blowCandlesBtn) {
      blowCandlesBtn.disabled = true;
      blowCandlesBtn.textContent = "Wish made! ♡";
    }

    if (cakeMessage) {
      cakeMessage.hidden = false;
      cakeMessage.textContent =
        "May all your little wishes find their way to you. ♡";
    }

    createConfetti(55);
  }

  blowCandlesBtn?.addEventListener("click", blowCandles);

  // =========================================
  // 10. FORTUNE COOKIE
  // =========================================

  const fortuneCookieBtn = $("#fortuneCookieBtn");
  const fortuneMessage = $("#fortuneMessage");
  const fortuneText = $("#fortuneText");
  const anotherFortuneBtn = $("#anotherFortuneBtn");

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
  let typingToken = 0;

  async function typeText(element, text, speed = 35) {
    if (!element) return;

    const token = ++typingToken;

    element.textContent = "";

    if (prefersReducedMotion) {
      element.textContent = text;
      return;
    }

    for (const character of text) {
      if (token !== typingToken) return;

      element.textContent += character;

      await wait(speed);
    }
  }

  async function revealFortune() {
    if (!fortuneText || !fortuneMessage) return;

    let randomIndex;

    do {
      randomIndex = Math.floor(Math.random() * fortunes.length);
    } while (fortunes.length > 1 && randomIndex === previousFortune);

    previousFortune = randomIndex;

    fortuneCookieBtn?.classList.add("opened");

    fortuneMessage.hidden = false;

    await typeText(fortuneText, fortunes[randomIndex], 30);
  }

  fortuneCookieBtn?.addEventListener("click", revealFortune);
  anotherFortuneBtn?.addEventListener("click", revealFortune);

  // =========================================
  // 11. LOVE LETTER
  // =========================================

  const letterEnvelope = $("#letterEnvelope");
  const openLetterBtn = $("#openLetterBtn");

  const letterText = $("#letterText, #loveLetterText, .letter-content");

  let letterOriginalText = "";
  let letterTypingToken = 0;

  if (letterText) {
    letterOriginalText = letterText.textContent.trim();
  }

  async function toggleLoveLetter() {
    if (!letterEnvelope) return;

    const isOpen = letterEnvelope.classList.toggle("open");

    if (openLetterBtn) {
      openLetterBtn.textContent = isOpen
        ? "Close the letter ♡"
        : "Open the letter ♡";
    }

    if (!letterText) return;

    if (isOpen && letterOriginalText) {
      const token = ++letterTypingToken;

      letterText.textContent = "";

      if (prefersReducedMotion) {
        letterText.textContent = letterOriginalText;
        return;
      }

      for (const character of letterOriginalText) {
        if (token !== letterTypingToken) return;

        letterText.textContent += character;

        await wait(20);
      }
    } else {
      letterTypingToken++;
      letterText.textContent = letterOriginalText;
    }
  }

  openLetterBtn?.addEventListener("click", toggleLoveLetter);

  // =========================================
  // 12. SECRET MESSAGE
  // =========================================

  const passwordForm = $("#passwordForm");
  const secretPassword = $("#secretPassword");
  const secretFeedback = $("#secretFeedback");
  const secretContent = $("#secretContent");
  const secretLock = $("#secretLock");

  const SECRET_PASSWORD = "02012026";

  passwordForm?.addEventListener("submit", async (event) => {
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

      createConfetti(45);
    } else {
      if (secretFeedback) {
        secretFeedback.textContent =
          "Oops! That's not the right date. Try again, sweetheart ♡";

        secretFeedback.className = "secret-feedback error";
      }

      const input = secretPassword;

      input.classList.remove("shake");

      // Memicu ulang animasi shake.
      void input.offsetWidth;

      input.classList.add("shake");

      input.value = "";
      input.focus();

      await wait(500);

      input.classList.remove("shake");
    }
  });

  // =========================================
  // 13. SCROLL REVEAL
  // =========================================

  const revealElements = $$(
    ".section-title, .polaroid, .flip-card, .quiz-container, .birthday-cake, .fortune-container",
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");

            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
      },
    );

    revealElements.forEach((element) => {
      if (!prefersReducedMotion) {
        observer.observe(element);
      } else {
        element.classList.add("revealed");
      }
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("revealed");
    });
  }

  // =========================================
  // 14. NAVIGATION SMOOTH SCROLL
  // =========================================

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = $(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  });

  // =========================================
  // 15. CURSOR HEART EFFECT
  // =========================================

  const cursorEffects = $("#cursorEffects");

  const supportsFinePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;

  if (cursorEffects && supportsFinePointer && !prefersReducedMotion) {
    let lastCursorEffect = 0;

    document.addEventListener("mousemove", (event) => {
      const now = Date.now();

      if (now - lastCursorEffect < 100) return;

      lastCursorEffect = now;

      const heart = document.createElement("span");

      heart.className = "cursor-heart";

      heart.textContent = Math.random() > 0.5 ? "♡" : "✧";

      heart.style.left = `${event.clientX}px`;
      heart.style.top = `${event.clientY}px`;

      cursorEffects.appendChild(heart);

      heart.addEventListener(
        "animationend",
        () => {
          heart.remove();
        },
        { once: true },
      );
    });
  }

  // =========================================
  // 16. KEYBOARD SHORTCUT
  // =========================================

  document.addEventListener("keydown", (event) => {
    if (!galleryLightbox || galleryLightbox.hidden) return;

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowRight") {
      nextGalleryImage();
    }

    if (event.key === "ArrowLeft") {
      previousGalleryImage();
    }
  });

  // =========================================
  // 17. START AGAIN / RESET ALL
  // =========================================

  const startAgainBtn = $("#startAgainBtn");

  function resetMusic() {
    if (!audio) return;

    musicWasPlaying = !audio.paused;

    pauseMusic();

    audio.currentTime = 0;

    updateMusicProgress();
  }

  async function startAgain() {
    if (isResetting || isOpening) return;

    isResetting = true;

    // Musik dihentikan sementara.
    resetMusic();

    // Reset opening.
    welcomeScreen?.classList.remove("hide");
    mainContent?.classList.remove("show");
    welcomeEnvelope?.classList.remove("open");

    document.body.classList.add("welcome-active");

    if (openGiftBtn) {
      openGiftBtn.disabled = false;
    }

    // Reset gallery.
    closeLightbox();

    // Reset quiz.
    restartQuiz();

    // Reset birthday cake.
    birthdayCake?.querySelectorAll(".flame").forEach((flame) => {
      flame.classList.remove("extinguished");
    });

    candlesBlown = false;

    if (blowCandlesBtn) {
      blowCandlesBtn.disabled = false;
      blowCandlesBtn.textContent = "Blow the candles ♡";
    }

    if (cakeMessage) {
      cakeMessage.hidden = true;
    }

    // Reset fortune cookie.
    typingToken++;
    previousFortune = -1;

    fortuneCookieBtn?.classList.remove("opened");

    if (fortuneMessage) {
      fortuneMessage.hidden = true;
    }

    if (fortuneText) {
      fortuneText.textContent = "";
    }

    // Reset love letter.
    letterTypingToken++;

    letterEnvelope?.classList.remove("open");

    if (letterText) {
      letterText.textContent = letterOriginalText;
    }

    if (openLetterBtn) {
      openLetterBtn.textContent = "Open the letter ♡";
    }

    // Reset secret message.
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

    // Reset music visibility.
    if (musicPlayer) {
      musicPlayer.hidden = false;
    }

    if (musicShowBtn) {
      musicShowBtn.hidden = true;
    }

    // Kembali ke paling atas.
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });

    await wait(400);

    isResetting = false;
  }

  startAgainBtn?.addEventListener("click", startAgain);

  // =========================================
  // 18. INITIAL STATE
  // =========================================

  document.body.classList.add("welcome-active");

  updateMusicButton();

  if (audio && musicVolume) {
    audio.volume = Number(musicVolume.value);
  }

  if (musicShowBtn) {
    musicShowBtn.hidden = true;
  }

  if (galleryLightbox) {
    galleryLightbox.hidden = true;
  }
});
