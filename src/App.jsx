import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import './App.css'

import Lottie from "lottie-react";
import loveCat from "./assets/love-cat.json";
import heartsAnim from "./assets/hearts.json";

import dateNight from "./assets/photos/dateNight.jpeg";
import firstmet from "./assets/photos/firstmet.jpeg";
import kissykissy from "./assets/photos/kissykissy.jpeg";
import picnic from "./assets/photos/picnic.jpeg";
import poolside from "./assets/photos/poolside.jpeg";
import roo1 from "./assets/photos/roo1.jpeg";
import tennis from "./assets/photos/tennis.jpeg";
import thatOneTime from "./assets/photos/thatOneTime.png";
import truth from "./assets/photos/truth.jpeg";
import babysFirstDj from "./assets/photos/babysFirstDj.jpeg";
import brisBane from "./assets/photos/brisBane.jpeg";
import foodFestival from "./assets/photos/foodFestivalDay.jpeg";
import leopleuredon from "./assets/photos/Leo-pleuredon.jpeg";
import newYear from "./assets/photos/newYears-ish.jpeg";

const DEV_MODE = false;

// Simplified flow per stop:
// 1) Show question
// 2) Correct answer reveals place + clue + task
// 3) Button moves to next stop (no extra unlock code)

const slides = [
  { src: truth, caption: "Our truth ❤️" },
  { src: dateNight, caption: "Date night ❤️" },
  { src: firstmet, caption: "When we first met ❤️" },
  { src: kissykissy, caption: "Kiss kiss 💋" },
  { src: picnic, caption: "Picnic ❤️" },
  { src: poolside, caption: "Poolside ❤️" },
  { src: roo1, caption: "Roo ❤️" },
  { src: tennis, caption: "Tennis ❤️" },
  { src: thatOneTime, caption: "That one time ❤️" },
  { src: babysFirstDj, caption: "Babys first DJ ❤️" },
  { src: brisBane, caption: "Brisbane ❤️" },
  { src: foodFestival, caption: "Food Festival ❤️" },
  { src: leopleuredon, caption: "Leo pleuredon ❤️" },
  { src: newYear, caption: "New Year ❤️" },
];

const stops = [
  {
    question: "Let’s rewind to the beginning, where two glasses met before we really knew what we were starting.",
    answer: "cherry",
    title: "Stop 1: Cherry Tree Hotel",
    clue: `Our story didn’t start with once upon a time — it started with a drink, a laugh, and what we both wanted in life.
Where the cherry doesn’t grow on a tree — but poured in one glass, shared with me. `,
    task: "As the pub is closed, lets go to IGA grab a drink and sit on the bench outside, for a brief moment, then we can head to the next stop.",
  },
  {
    question: "His name is on the door, But he’s not the bartender (probably).",
    answer: "fred",
    title: "Stop 2: Fred’s Bar",
    clue: `Not mine, not yours — but Fred’s instead. Where stories were shared and thing's was said.`,
    task: "Order some sourdough and some drinks and sit outside, then we can head to the next stop.",
  },
  {
    question: "One grows in soil, one’s poured in a cup, put them together — that’s our next stop.",
    answer: "lilac",
    title: "Stop 3: Lilac Wine",
    clue: `A color, a flower, and also a wine. these are some of your favorite things.`,
    task: "Share something you appreciated early in our relationship but never said.",
  },
  {
    question: "Which rooftop spot did we go to in Richmond, that can be a 'drag' ?",
    answer: "harlow",
    title: "Stop 4: Harlow Bar",
    clue: `Up we went where the city could see us,
where we thought we were alone. Lets head to the rooftop and reclaim it as our own.`,
    task: "Take a selfie recreating an early-date vibe photo and share it with me.",
  },
  {
    question: "Where things are forged with fire and art — like good drinks, good talks, and the start of a heart.",
    answer: "blacksmith",
    title: "Stop 5: Blacksmith",
    clue: `Where things are forged with fire and art —
like good drinks, good talks, and the start of a heart.`,
    task: "Toast: one thing we must do this year, travel, holiday, or something else.",
  },

  {
    question: "There’s a place in our story waiting for a rewrite.",
    answer: "spelt",
    title: "Stop 6: Spelt Pizzeria",
    clue: "Let's reclaim a bad memory, to a better one. Just add garlic (bread)",
    task: "Present your final note, kiss or choose what you would like to do next below ❤️",
  },
];

const eveningActivities = [
  {
    id: 0,
    title: "Continue on with drinks and dessert",
    emoji: "🍽️",
    description: "We can head to the cinema room, to watch a movie and have some drinks. You've earned it after our adventure!",
    details: "No words needed, lets just go and enjoy each other ❤️",
    url: " "
  },
  {
    id: 1,
    title: "Symphony in the Park",
    emoji: "🎶",
    description: "Go to the Symphony in the Park and enjoy the music.",
    details: "We can go grab some picnic snacks and head to the bowl to watch some symphony in the park",
    url: "https://www.artscentremelbourne.com.au/whats-on/2026/seasons/mso/50-years-of-abc-classic",
  },
  {
    id: 2,
    title: "Save ourselves for tomorrow and our staycation",
    emoji: "💰",
    description: "We can save ourselves for tomorrow and our staycation.",
    details: "Room service, drinks, lingerie, bath robes and chill",
    url: ""
  },
];

export default function App() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState("question"); // question | place
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const progressPercent = ((index + (phase === "place" ? 1 : 0)) / stops.length) * 100;
  const [showCelebrate, setShowCelebrate] = useState(false);
  const [fadeCelebrate, setFadeCelebrate] = useState(false);

  const [started, setStarted] = useState(false);

  const [showHint, setShowHint] = useState(false);
  const [wrongGuessCount, setWrongGuessCount] = useState(0);
  const [activeModal, setActiveModal] = useState(null);
  const [heartFlyAnim, setHeartFlyAnim] = useState(null);

  const stop = stops[index];

  const [phaseApp, setPhaseApp] = useState("countdown");
  const [timeLeft, setTimeLeft] = useState("");
  const [slideIndex, setSlideIndex] = useState(0);

  const TARGET_DATE = new Date("2026-02-14T13:30:00");

  // Dev bypass: run in console to skip countdown or jump to evening activities
  useEffect(() => {
    if (import.meta.env.DEV) {
      window.__skipCountdown = () => setPhaseApp("welcome");
      window.__showEveningActivities = () => {
        setPhaseApp("welcome");
        setStarted(true);
        setIndex(stops.length - 1);
        setPhase("place");
      };
    }
    return () => {
      delete window.__skipCountdown;
      delete window.__showEveningActivities;
    };
  }, []);

  // countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = TARGET_DATE - now;

      if (diff <= 0) {
        setTimeLeft("Ready ❤️");
        return;
      }

      const h = Math.floor(diff / 1000 / 60 / 60);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  // slideshow rotator
  useEffect(() => {
    const rotator = setInterval(() => {
      setSlideIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(rotator);
  }, []);

  // Load heart-fly Lottie for evening activities background
  useEffect(() => {
    fetch("https://lottie.host/4E1YKrHWvy.json")
      .then((r) => r.json())
      .then(setHeartFlyAnim)
      .catch(() => setHeartFlyAnim(heartsAnim));
  }, []);


  function startHunt() {
    setStarted(true);
  }

  function checkAnswer() {
    if (input.trim().toLowerCase().includes(stop.answer)) {
      setPhase("place");
      setInput("");
      setError(false);
      setShowHint(false);
      setWrongGuessCount(0);
      // 🎉 trigger animation
      setShowCelebrate(true);
      // auto hide after 2.5s
      setTimeout(() => setShowCelebrate(false), 3500);
    } else {
      setError(true);
      setWrongGuessCount((c) => c + 1);
    }
  }

  function nextStop() {
    if (index < stops.length - 1) {
      setIndex(index + 1);
      setPhase("question");
      setInput("");
      setError(false);
      setShowHint(false);
      setWrongGuessCount(0);
    }
  }

  function reset() {
    setIndex(0);
    setPhase("question");
    setInput("");
    setError(false);
    setShowHint(false);
    setWrongGuessCount(0);
    setActiveModal(null);
  }

  function cheatReveal() {
    setPhase("place");
    setInput("");
    setError(false);
    setWrongGuessCount(0);
  }

  function cheatNext() {
    if (index < stops.length - 1) {
      setIndex(index + 1);
      setPhase("question");
      setInput("");
      setError(false);
    }
  }

  if (phaseApp === "countdown") {
    return (
      <div style={styles.countdownPage}>
        <div style={styles.polaroidStage}>
          <AnimatePresence mode="sync">
            <motion.div
              key={slideIndex}
              initial={{ opacity: 0, rotate: slideIndex % 2 === 0 ? -5 : 5 }}
              animate={{ opacity: 1, rotate: slideIndex % 2 === 0 ? -5 : 5 }}
              exit={{ opacity: 0, rotate: slideIndex % 2 === 0 ? -5 : 5 }}
              transition={{ duration: 1.2 }}
              style={styles.polaroid}
            >
              <img src={slides[slideIndex].src} style={styles.polaroidImg} />
              <div className="beth" style={styles.polaroidCaption}>{slides[slideIndex].caption}</div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div style={styles.countdownSection}>
          <h1 className="beth" style={styles.countdownHeading}>Our Adventure Begins In</h1>
          <h2 style={styles.countdownTime}>{timeLeft}</h2>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div style={styles.page}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.card}
        >
          <h1 className="beth">Let's spend some koality time together</h1>

          <p style={{ marginTop: 16 }}>
            Before we begin… are you ready to start ?
          </p>


          <button onClick={startHunt} style={styles.button}>
            Start Adventure →
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div style={styles.page}>
        <motion.div
          key={index + phase}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.card}
        >{/* Progress Indicator */}
          <div style={{ textAlign: "center", marginBottom: 16 }}>

            <Lottie
              animationData={loveCat}
              loop={true}
              style={{ height: 150 }}
            />

            <div style={styles.progressBarOuter}>
              <div
                style={{
                  ...styles.progressBarInner,
                  width: `${progressPercent}%`,
                }}
              />
            </div>

            <p style={{ marginTop: 6 }}>
              Stop {index + 1} of {stops.length}
            </p>
          </div>
          {showCelebrate && (
            <motion.div
              style={styles.celebrateWrap}
              initial={{ opacity: 0 }}
              animate={{ opacity: fadeCelebrate ? 0 : 1 }}
              transition={{ duration: 0.6 }}
              onAnimationComplete={() => {
                if (fadeCelebrate) setShowCelebrate(false);
              }}
            >
              <Lottie
                animationData={heartsAnim}
                loop={false}
                style={{ height: 580 }}
              />
            </motion.div>
          )}
          <h3 className="beth" style={{ textWrap: "nowrap" }}>Valentines Day Adventure</h3>

          {phase === "question" ? (
            <>
              <h4 style={{ fontWeight: "bold" }}>Answer to reveal the next place</h4>
              <p style={{ marginTop: 10 }}>{stop.question}</p>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Your answer"
                  style={styles.input}
                  inputMode="text"
                  name="answer"
                />
              </div>

              {error && <p style={{ color: "red" }}>Not quite — try again 💭</p>}

              <div style={styles.buttonRow}>
                {wrongGuessCount >= 3 && (
                  <button
                    onClick={() => setShowHint(true)}
                    style={{ ...styles.button, background: "#f59e0b", marginTop: 0 }}
                  >
                    Hint 💡
                  </button>
                )}
                {wrongGuessCount < 3 && <div />}
                <button onClick={checkAnswer} style={{ ...styles.button, marginTop: 0 }}>
                  Reveal Place
                </button>
              </div>

              {DEV_MODE && (
                <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button onClick={cheatReveal} style={{ ...styles.button, background: "#9ca3af" }}>
                    Cheat: Reveal
                  </button>
                  <button onClick={cheatNext} style={{ ...styles.button, background: "#9ca3af" }}>
                    Cheat: Next Stop →
                  </button>
                </div>
              )}

              {showHint && (
                <p style={{ marginTop: 10, fontStyle: "italic" }}>
                  Hint: The answer is <strong>{stop.answer}</strong>
                </p>
              )}
            </>
          ) : (
            <>
              <h2>{stop.title}</h2>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <pre style={styles.clue}>{stop.clue}</pre>
              </div>

              <div style={styles.taskBox}>
                <strong>Mini Mission:</strong>
                <p>{stop.task}</p>
              </div>

              {index < stops.length - 1 ? (
                <div style={styles.buttonRow}>
                  <div />
                  <button onClick={nextStop} style={{ ...styles.button, marginTop: 0 }}>
                    Next Stop →
                  </button>
                </div>
              ) : (
                <>
                  <div style={styles.activityCardsWrapper}>
                    {heartFlyAnim && (
                      <div style={styles.heartFlyBg}>
                        <Lottie
                          animationData={heartFlyAnim}
                          loop
                          style={{ height: "100%", width: "100%", opacity: 0.6 }}
                        />
                      </div>
                    )}
                    <p style={{ marginTop: 20, textAlign: "center", fontWeight: 600, position: "relative", zIndex: 1 }}>
                      Choose your surprise for tonight ❤️
                    </p>
                    <div style={styles.activityCards}>
                      {eveningActivities.map((activity, i) => (
                        <motion.button
                          key={activity.id}
                          onClick={() => setActiveModal(activity.id)}
                          style={styles.activityCard}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span style={styles.activityEmoji}>🎁</span>
                          <span style={styles.activityTitle}>Surprise {i + 1}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <div style={styles.buttonRow}>
                    <div />
                    <button onClick={reset} style={{ ...styles.button, marginTop: 0 }}>
                      Restart Hunt
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {activeModal !== null && (
          <motion.div
            style={styles.modalOverlay}
            onClick={() => setActiveModal(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              style={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {(() => {
                const activity = eveningActivities[activeModal];
                if (!activity) return null;
                return (
                  <>
                    <div style={styles.modalHeader}>
                      <span style={styles.modalEmoji}>{activity.emoji}</span>
                      <h3 style={styles.modalTitle}>{activity.title}</h3>
                      <button
                        style={styles.modalClose}
                        onClick={() => setActiveModal(null)}
                        aria-label="Close"
                      >
                        ×
                      </button>
                    </div>
                    <p style={styles.modalDescription}>{activity.description}</p>
                    <p style={styles.modalDetails}>{activity.details}</p>
                    {activity.url && (
                      <a
                        href={activity.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.learnMoreLink}
                      >
                        Learn more →
                      </a>
                    )}
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "clamp(1rem, 4vw, 2em)",
    color: "#020202",
    overflow: "auto",
  },
  countdownPage: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "clamp(1rem, 4vw, 2em)",
  },
  polaroidStage: {
    position: "relative",
    minHeight: "min(480px, 72vh)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  countdownSection: {
    flexShrink: 0,
    marginTop: "clamp(16px, 4vw, 24px)",
    padding: "0 clamp(12px, 4vw, 20px)",
    textAlign: "center",
    color: "#1f2937",
  },
  countdownHeading: {
    margin: 0,
    fontSize: "clamp(1.2rem, 4vw, 1.5rem)",
    fontWeight: 600,
    color: "#fafafa",
  },
  countdownTime: {
    margin: "12px 0 0",
    fontSize: "clamp(1.5rem, 6vw, 2rem)",
    fontWeight: 700,
    color: "#fafafa",
  },

  polaroid: {
    position: "absolute",
    width: "min(360px, 90vw)",
    background: "white",
    padding: 12,
    paddingBottom: 26,
    borderRadius: 6,
    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
  },

  polaroidImg: {
    width: "100%",
    height: "min(320px, 80vw)",
    objectFit: "cover",
    objectPosition: "center center",
    background: "#f3f4f6",
    borderRadius: 2,
  },

  polaroidCaption: {
    textAlign: "center",
    marginTop: 8,
    fontSize: "clamp(12px, 3vw, 14px)",
    fontWeight: 500,
    color: "#1f2937",
  },
  card: {
    position: "relative",
    background: "white",
    padding: "clamp(1.5rem, 5vw, 3em)",
    borderRadius: 16,
    maxWidth: 520,
    width: "100%",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  clue: {
    whiteSpace: "pre-wrap",
    fontFamily: '"Cormorant Garamond", Georgia, serif',
    fontSize: "1.15rem",
    fontStyle: "italic",
    lineHeight: 1.7,
    textAlign: "center",
    maxWidth: 420,
    padding: "0 8px",
  },
  taskBox: {
    background: "#fff1f2",
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  activityCardsWrapper: {
    position: "relative",
    minHeight: 120,
  },
  heartFlyBg: {
    position: "absolute",
    inset: "-20%",
    pointerEvents: "none",
    zIndex: 0,
  },
  activityCards: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
    marginTop: 16,
  },
  activityCard: {
    flex: "1 1 100px",
    minWidth: 90,
    maxWidth: 140,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    padding: 16,
    border: "2px solid #ffb3ba",
    borderRadius: 12,
    background: "#fff9fa",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
  },
  activityEmoji: {
    fontSize: 28,
  },
  activityTitle: {
    textAlign: "center",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    zIndex: 1000,
  },
  modalContent: {
    background: "white",
    borderRadius: 16,
    padding: 24,
    maxWidth: 400,
    width: "100%",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    position: "relative",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
    color: "#fb7185",
  },
  modalEmoji: {
    fontSize: 32,
  },
  modalTitle: {
    flex: 1,
    margin: 0,
    fontSize: "1.35rem",
    color: "#fb7185",
  },
  modalClose: {
    background: "none",
    border: "none",
    fontSize: 28,
    cursor: "pointer",
    padding: "0 4px",
    lineHeight: 1,
    color: "#666",
  },
  modalDescription: {
    margin: "0 0 12px",
    fontSize: "1rem",
    lineHeight: 1.5,
    color: "#666",
    fontWeight: 600,
  },
  modalDetails: {
    margin: 0,
    fontSize: 14,
    color: "#555",
    lineHeight: 1.6,
  },
  learnMoreLink: {
    display: "inline-block",
    marginTop: 16,
    color: "#fb7185",
    fontWeight: 600,
    textDecoration: "none",
  },
  input: {
    width: "100%",
    padding: 10,
    marginTop: 12,
    borderRadius: 8,
    border: "1px solid #ddd",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    gap: 12,
  },
  button: {
    marginTop: 12,
    width: "auto",
    padding: 12,
    borderRadius: 10,
    border: "none",
    background: "#fb7185",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
  progressBarOuter: {
    width: "100%",
    height: 10,
    background: "#ffe4e6",
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 8,
  },

  progressBarInner: {
    height: "100%",
    background: "#fb7185",
    borderRadius: 999,
    transition: "width 0.4s ease",
  },
  celebrateWrap: {
    position: "absolute",
    top: -40,
    left: 0,
    right: 0,
    pointerEvents: "none",
  },
};
