/**
 * ==============================================================================
 * 💖 ROMANTIC PROPOSAL EXPERIENCE - SCRIPT 💖
 * ==============================================================================
 * 
 * INSTRUCTIONS FOR PERSONALIZATION:
 * You can customize the names and messages below! Simply change the values inside
 * the quotation marks. The website will automatically update everywhere.
 * ==============================================================================
 */

const CONFIG = {
  // 1. Names
  herName: "Priyanka",                 // Replace with her name
  yourName: "Yours Truly",             // Replace with your name or nickname

  // 2. Welcome Screen Text
  welcomeHeading: "Hey, {HER_NAME}! 💗",
  welcomeSubtitle: "I made something special for you... Will you give me a little moment?",

  // 3. Main Proposal Screen Text
  proposalHeading: "There's Something I've Been Meaning to Tell You...",
  proposalMessage: `Somewhere between our conversations, our laughs, and all those little moments, you became someone really special to me. I don't know exactly when it happened, but I realized that I wanted to be more than just your friend.\n\nSo today, I decided to gather a little courage and ask you something that means a lot to me...`,
  proposalQuestion: "Will you be my girlfriend? 💖",

  // 4. Playful "NO" Button Responses
  // Displayed gracefully when she clicks "NO". Never manipulative, always respectful and sweet.
  noButtonResponses: [
    "Are you sure? 🥺",
    "Give my little heart another chance? 💗",
    "I'll respect your answer, but I had to ask! 🌷",
    "No pressure at all, take your time. 💕",
    "My heart just skipped a beat! Give it one more thought? ✨",
    "Even if it takes time, you'll always be special to me! 🌸",
    "No worries at all! Just wanted to share what was in my heart. 💖"
  ],

  // 5. YES Celebration Screen Text
  yesCelebrationHeading: "YOU JUST MADE MY DAY! ❤️",
  yesCelebrationMessage: "I don't know what the future holds, but I'm really happy that we get to explore this feeling together. Thank you for giving me this chance. Let's make some beautiful memories! 💖",
  storyTagline: "This is the beginning of our little story... 💌",

  // 6. Final Personal Note Text (Revealed on click)
  finalNoteTitle: "From the Bottom of My Heart",
  finalNoteText: "No matter what happens, I'm grateful that I found someone as special as you. Thank you for being part of my life. ❤️",
  
  // 7. Audio Settings
  musicFile: "romantic-music.mp3",     // Name of your local audio file (if available)
  autoPlayOnSurpriseClick: true        // Attempts to start music on first screen button click
};


/* ==============================================================================
   STATE & ELEMENT REFERENCES
   ============================================================================== */
const state = {
  currentScreen: 'welcome',
  isMusicPlaying: false,
  lastNoIndex: -1,
  audioContext: null,
  synthInterval: null
};

// DOM Elements
const elements = {
  // Canvases
  ambientCanvas: document.getElementById('ambientCanvas'),
  confettiCanvas: document.getElementById('confettiCanvas'),

  // Music Controls
  musicToggleBtn: document.getElementById('musicToggleBtn'),
  musicLabel: document.getElementById('musicLabel'),
  bgMusic: document.getElementById('bgMusic'),

  // Screens
  screenWelcome: document.getElementById('screenWelcome'),
  screenProposal: document.getElementById('screenProposal'),
  screenCelebration: document.getElementById('screenCelebration'),

  // Welcome Screen
  welcomeHeading: document.getElementById('welcomeHeading'),
  welcomeSubtitle: document.getElementById('welcomeSubtitle'),
  btnOpenSurprise: document.getElementById('btnOpenSurprise'),

  // Proposal Screen
  proposalHeading: document.getElementById('proposalHeading'),
  proposalMessage: document.getElementById('proposalMessage'),
  proposalQuestion: document.getElementById('proposalQuestion'),
  teddySpeechText: document.getElementById('teddySpeechText'),
  noResponseBanner: document.getElementById('noResponseBanner'),
  noResponseText: document.getElementById('noResponseText'),
  btnYes: document.getElementById('btnYes'),
  btnNo: document.getElementById('btnNo'),

  // Celebration Screen
  celebrationHeading: document.getElementById('celebrationHeading'),
  celebrationMessage: document.getElementById('celebrationMessage'),
  storyTaglineText: document.getElementById('storyTaglineText'),
  btnReadFinalNote: document.getElementById('btnReadFinalNote'),
  btnReplay: document.getElementById('btnReplay'),
  finalNoteModal: document.getElementById('finalNoteModal'),
  finalNoteText: document.getElementById('finalNoteText'),
  signatureName: document.getElementById('signatureName')
};


/* ==============================================================================
   1. PERSONALIZATION INJECTION
   ============================================================================== */
function applyPersonalization() {
  const replaceTokens = (text) => {
    if (!text) return '';
    return text
      .replace(/{HER_NAME}/g, CONFIG.herName)
      .replace(/{YOUR_NAME}/g, CONFIG.yourName);
  };

  // Welcome Screen
  if (elements.welcomeHeading) {
    elements.welcomeHeading.textContent = replaceTokens(CONFIG.welcomeHeading);
  }
  if (elements.welcomeSubtitle) {
    elements.welcomeSubtitle.textContent = replaceTokens(CONFIG.welcomeSubtitle);
  }

  // Proposal Screen
  if (elements.proposalHeading) {
    elements.proposalHeading.textContent = replaceTokens(CONFIG.proposalHeading);
  }
  if (elements.proposalMessage) {
    // Preserve paragraph breaks
    const formatted = replaceTokens(CONFIG.proposalMessage).replace(/\n/g, '<br>');
    elements.proposalMessage.innerHTML = formatted;
  }
  if (elements.proposalQuestion) {
    elements.proposalQuestion.textContent = replaceTokens(CONFIG.proposalQuestion);
  }

  // Celebration Screen
  if (elements.celebrationHeading) {
    elements.celebrationHeading.textContent = replaceTokens(CONFIG.yesCelebrationHeading);
  }
  if (elements.celebrationMessage) {
    elements.celebrationMessage.textContent = replaceTokens(CONFIG.yesCelebrationMessage);
  }
  if (elements.storyTaglineText) {
    elements.storyTaglineText.textContent = replaceTokens(CONFIG.storyTagline);
  }
  if (elements.finalNoteText) {
    elements.finalNoteText.textContent = replaceTokens(CONFIG.finalNoteText);
  }
  if (elements.signatureName) {
    elements.signatureName.textContent = CONFIG.yourName;
  }
}


/* ==============================================================================
   2. SCREEN NAVIGATION WITH SMOOTH TRANSITIONS
   ============================================================================== */
function switchScreen(fromScreen, toScreen) {
  if (!fromScreen || !toScreen) return;

  fromScreen.classList.remove('screen-active');
  fromScreen.classList.add('screen-hidden');

  setTimeout(() => {
    toScreen.classList.remove('screen-hidden');
    toScreen.classList.add('screen-active');
    
    // Smooth scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 180);
}


/* ==============================================================================
   3. PLAYFUL "NO" BUTTON HANDLER
   ============================================================================== */
function handleNoClick() {
  const responses = CONFIG.noButtonResponses;
  if (!responses || responses.length === 0) return;

  // Pick a random response that is not the same as the last one
  let nextIndex;
  if (responses.length === 1) {
    nextIndex = 0;
  } else {
    do {
      nextIndex = Math.floor(Math.random() * responses.length);
    } while (nextIndex === state.lastNoIndex);
  }
  state.lastNoIndex = nextIndex;

  const chosenMessage = responses[nextIndex];

  // Display in feedback banner with smooth animation
  if (elements.noResponseText && elements.noResponseBanner) {
    elements.noResponseText.textContent = chosenMessage;
    elements.noResponseBanner.classList.remove('show');
    
    // Trigger reflow to restart css animation
    void elements.noResponseBanner.offsetWidth;
    elements.noResponseBanner.classList.add('show');
  }

  // Also update Teddy's speech bubble to react lovingly
  if (elements.teddySpeechText) {
    elements.teddySpeechText.textContent = "I'll still be right here! 🥺";
  }

  // Add subtle shake animation to button without blocking or trapping
  elements.btnNo.classList.remove('btn-no-shake');
  void elements.btnNo.offsetWidth;
  elements.btnNo.classList.add('btn-no-shake');

  setTimeout(() => {
    elements.btnNo.classList.remove('btn-no-shake');
  }, 500);
}


/* ==============================================================================
   4. CELEBRATION & YES HANDLER
   ============================================================================== */
function handleYesClick() {
  switchScreen(elements.screenProposal, elements.screenCelebration);
  state.currentScreen = 'celebration';

  // Trigger celebration confetti cannon
  startConfetti();

  // Try to play music if not already playing
  startAudioGracefully();
}

function handleReplayClick() {
  // Hide final note modal if open
  if (elements.finalNoteModal) {
    elements.finalNoteModal.classList.add('hidden');
  }
  // Reset banner and teddy speech
  if (elements.noResponseBanner) {
    elements.noResponseBanner.classList.remove('show');
  }
  if (elements.teddySpeechText) {
    elements.teddySpeechText.textContent = "I'm so nervous... but here goes! 🙈";
  }

  // Switch back to welcome screen
  switchScreen(elements.screenCelebration, elements.screenWelcome);
  state.currentScreen = 'welcome';
}

function toggleFinalNote() {
  if (!elements.finalNoteModal) return;
  const isHidden = elements.finalNoteModal.classList.contains('hidden');
  if (isHidden) {
    elements.finalNoteModal.classList.remove('hidden');
    elements.finalNoteModal.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } else {
    elements.finalNoteModal.classList.add('hidden');
  }
}


/* ==============================================================================
   5. AUDIO SYSTEM: LOCAL MP3 + DREAMY WEB AUDIO SYNTHESIZER FALLBACK
   ============================================================================== */
// Synthesizes a soft, romantic music-box melody using Web Audio API
// so music works even when romantic-music.mp3 has not been added yet!
function playRomanticSynth() {
  if (state.synthInterval) return;

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!state.audioContext) {
      state.audioContext = new AudioContextClass();
    }
    if (state.audioContext.state === 'suspended') {
      state.audioContext.resume();
    }

    // Romantic music-box chord progression notes (Frequencies in Hz)
    // Dreamy C Major / A Minor arpeggiated romantic chords
    const melodyNotes = [
      523.25, 659.25, 783.99, 1046.50, // C5, E5, G5, C6
      440.00, 523.25, 659.25, 880.00,  // A4, C5, E5, A5
      349.23, 440.00, 523.25, 698.46,  // F4, A4, C5, F5
      392.00, 493.88, 587.33, 783.99   // G4, B4, D5, G5
    ];

    let noteIndex = 0;
    const playNote = (freq) => {
      if (!state.isMusicPlaying) return;
      const osc = state.audioContext.createOscillator();
      const gain = state.audioContext.createGain();

      // Sine wave for soft bell/music-box feel
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, state.audioContext.currentTime);

      // Envelope: instant soft attack, gentle decaying ring
      const now = state.audioContext.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(state.audioContext.destination);

      osc.start(now);
      osc.stop(now + 1.2);
    };

    // Play initial note
    playNote(melodyNotes[0]);
    noteIndex = (noteIndex + 1) % melodyNotes.length;

    state.synthInterval = setInterval(() => {
      if (!state.isMusicPlaying) {
        clearInterval(state.synthInterval);
        state.synthInterval = null;
        return;
      }
      playNote(melodyNotes[noteIndex]);
      noteIndex = (noteIndex + 1) % melodyNotes.length;
    }, 450);

  } catch (err) {
    console.warn("Romantic audio synthesizer could not start:", err);
  }
}

function stopRomanticSynth() {
  if (state.synthInterval) {
    clearInterval(state.synthInterval);
    state.synthInterval = null;
  }
}

function updateMusicUI(isPlaying) {
  state.isMusicPlaying = isPlaying;
  if (elements.musicToggleBtn) {
    if (isPlaying) {
      elements.musicToggleBtn.classList.add('playing');
      elements.musicLabel.textContent = "Music: On";
    } else {
      elements.musicToggleBtn.classList.remove('playing');
      elements.musicLabel.textContent = "Music: Off";
    }
  }
}

function startAudioGracefully() {
  if (state.isMusicPlaying) return;

  const audio = elements.bgMusic;
  if (!audio) return;

  // Try playing local file first
  audio.volume = 0.6;
  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        updateMusicUI(true);
      })
      .catch((_) => {
        // If file is missing or blocked, fall back to pure Web Audio romantic synthesizer
        updateMusicUI(true);
        playRomanticSynth();
      });
  } else {
    updateMusicUI(true);
    playRomanticSynth();
  }
}

function stopAudio() {
  const audio = elements.bgMusic;
  if (audio) {
    audio.pause();
  }
  stopRomanticSynth();
  updateMusicUI(false);
}

function toggleMusic() {
  if (state.isMusicPlaying) {
    stopAudio();
  } else {
    startAudioGracefully();
  }
}


/* ==============================================================================
   6. AMBIENT FLOATING HEARTS & SPARKLES CANVAS
   ============================================================================== */
class AmbientCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    if (!this.canvas) return;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.animationFrameId = null;
    this.particleCount = window.innerWidth < 600 ? 18 : 34;

    this.resize = this.resize.bind(this);
    this.animate = this.animate.bind(this);

    this.init();
  }

  init() {
    window.addEventListener('resize', this.resize);
    this.resize();
    this.createParticles();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    const colors = [
      'rgba(255, 117, 143, 0.45)',
      'rgba(255, 77, 109, 0.4)',
      'rgba(255, 182, 193, 0.5)',
      'rgba(199, 125, 255, 0.35)',
      'rgba(255, 255, 255, 0.6)'
    ];

    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 14 + 8,
        speedY: -(Math.random() * 0.6 + 0.3),
        speedX: (Math.random() - 0.5) * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.6 + 0.2,
        type: Math.random() > 0.4 ? 'heart' : 'sparkle',
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.02
      });
    }
  }

  drawHeart(ctx, x, y, size, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color;
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(0, topCurveHeight);
    // Left curve
    ctx.bezierCurveTo(
      -size / 2, -topCurveHeight,
      -size, size / 3,
      0, size
    );
    // Right curve
    ctx.bezierCurveTo(
      size, size / 3,
      size / 2, -topCurveHeight,
      0, topCurveHeight
    );
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawSparkle(ctx, x, y, size, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      ctx.moveTo(0, 0);
      ctx.lineTo(size * 0.3, size * 0.3);
      ctx.lineTo(0, size);
      ctx.lineTo(-size * 0.3, size * 0.3);
      ctx.closePath();
    }
    ctx.fill();
    ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.y += p.speedY;
      p.x += Math.sin(p.y * 0.01) * 0.4 + p.speedX;
      p.rotation += p.rotationSpeed;

      // Wrap around screen
      if (p.y < -30) {
        p.y = this.height + 20;
        p.x = Math.random() * this.width;
      }
      if (p.x < -30) p.x = this.width + 20;
      if (p.x > this.width + 30) p.x = -20;

      if (p.type === 'heart') {
        this.drawHeart(this.ctx, p.x, p.y, p.size, p.color);
      } else {
        this.drawSparkle(this.ctx, p.x, p.y, p.size * 0.6, p.color);
      }
    }

    this.animationFrameId = requestAnimationFrame(this.animate);
  }
}


/* ==============================================================================
   7. HEART CONFETTI CANNON CELEBRATION
   ============================================================================== */
let confettiParticles = [];
let confettiAnimationFrame = null;

function startConfetti() {
  const canvas = elements.confettiCanvas;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const count = window.innerWidth < 600 ? 75 : 140;
  confettiParticles = [];

  const colors = [
    '#ff4d6d', '#ff758f', '#ff8fa3', '#c9184a',
    '#ffccd5', '#a594f9', '#ffd166', '#ffffff'
  ];

  for (let i = 0; i < count; i++) {
    confettiParticles.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 120,
      y: canvas.height * 0.45 + (Math.random() - 0.5) * 80,
      size: Math.random() * 14 + 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 18,
      vy: -(Math.random() * 16 + 6),
      gravity: 0.38,
      friction: 0.96,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8,
      type: Math.random() > 0.3 ? 'heart' : 'ribbon',
      opacity: 1
    });
  }

  function renderConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < confettiParticles.length; i++) {
      const p = confettiParticles[i];
      p.vx *= p.friction;
      p.vy *= p.friction;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;

      if (p.type === 'heart') {
        const s = p.size;
        ctx.beginPath();
        const top = s * 0.3;
        ctx.moveTo(0, top);
        ctx.bezierCurveTo(-s / 2, -top, -s, s / 3, 0, s);
        ctx.bezierCurveTo(s, s / 3, s / 2, -top, 0, top);
        ctx.closePath();
        ctx.fill();
      } else {
        // Shimmering ribbon rectangle
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      }

      ctx.restore();

      // Slow fade out after passing viewport bottom
      if (p.y > canvas.height - 80) {
        p.opacity -= 0.015;
      }
    }

    confettiParticles = confettiParticles.filter(p => p.opacity > 0 && p.y < canvas.height + 100);

    if (confettiParticles.length > 0) {
      confettiAnimationFrame = requestAnimationFrame(renderConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(confettiAnimationFrame);
    }
  }

  if (confettiAnimationFrame) {
    cancelAnimationFrame(confettiAnimationFrame);
  }
  renderConfetti();
}


/* ==============================================================================
   8. EVENT LISTENERS & INITIALIZATION
   ============================================================================== */
function setupEventListeners() {
  // 1. Welcome Screen "Open Your Surprise 💌" button
  if (elements.btnOpenSurprise) {
    elements.btnOpenSurprise.addEventListener('click', () => {
      switchScreen(elements.screenWelcome, elements.screenProposal);
      state.currentScreen = 'proposal';

      // Start music automatically on user interaction if configured
      if (CONFIG.autoPlayOnSurpriseClick && !state.isMusicPlaying) {
        startAudioGracefully();
      }
    });
  }

  // 2. Proposal "YES" button
  if (elements.btnYes) {
    elements.btnYes.addEventListener('click', handleYesClick);
  }

  // 3. Proposal "NO" button (playful, clickable, never moves away)
  if (elements.btnNo) {
    elements.btnNo.addEventListener('click', handleNoClick);
  }

  // 4. Celebration "Read One Last Thing" button
  if (elements.btnReadFinalNote) {
    elements.btnReadFinalNote.addEventListener('click', toggleFinalNote);
  }

  // 5. Celebration "Replay Experience" button
  if (elements.btnReplay) {
    elements.btnReplay.addEventListener('click', handleReplayClick);
  }

  // 6. Music Toggle button
  if (elements.musicToggleBtn) {
    elements.musicToggleBtn.addEventListener('click', toggleMusic);
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Apply personal names and messages
  applyPersonalization();

  // Attach event handlers
  setupEventListeners();

  // Start background ambient floating hearts canvas
  if (elements.ambientCanvas) {
    new AmbientCanvas(elements.ambientCanvas);
  }
});

