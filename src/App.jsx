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
    title: "Start - Cherry Tree Hotel",
    clue: `Our story didn’t start with once upon a time — it started with a drink, a laugh, and what we both wanted.
Where the cherry doesn’t grow on a tree — but poured in one glass, shared with me.`,
    task: "As the pub is closed, lets go to IGA grab a drink and sit on the bench outside.",
  },
  {
    question: "His name is on the door, But he’s not the bartender (probably).",
    answer: "fred",
    title: "Fred’s Bar",
    clue: `Not mine, not yours — but Fred’s instead. Where stories were shared and thing's was said.`,
    task: "Ask one future-date question.",
  },
  {
    question: "One grows in soil, one’s poured in a cup, put them together — that’s our next stop.",
    answer: "lilac",
    title: "Lilac Wine",
    clue: `A color, a flower, and also a wine. Soft like the mood when we slowed the pace.`,
    task: "Share something you appreciated early in our relationship but never said.",
  },

  {
    question: "Where things are forged with fire and art — like good drinks, good talks, and the start of a heart.",
    answer: "blacksmith",
    title: "Blacksmith",
    clue: `Where things are forged with fire and art —
like good drinks, good talks, and the start of a heart.`,
    task: "Toast: one thing you liked then vs now.",
  },
  {
    question: "Which rooftop spot did we go to in Richmond, that can be a 'drag' ?",
    answer: "harlow",
    title: "Harlow Bar",
    clue: `Up we went where the city could see us,
where we talked louder and laughed freer.
Find the rooftop where our night had height —
and everything felt easy and right.`,
    task: "Take a selfie recreating an early-date vibe photo.",
  },
  {
    question: "A house by name, not by design! Where to next?",
    answer: "union",
    title: "Union House",
    clue: `A house with no bedrooms, but plenty of cheer.
We didn’t live there — but memories do —
go back and make another with two.`,
    task: "Each write one favorite memory from your first 3 months.",
  },
  {
    question: "There’s a place in our story waiting for a rewrite.",
    answer: "spelt",
    title: "Finish — Spelt Pizzeria",
    clue: `We end where dough meets fire and heat —
something better than we expected to find.`,
    task: "Present your final note, kiss or what you would like to do next❤️",
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

  const stop = stops[index];

  const [phaseApp, setPhaseApp] = useState("countdown");
  const [timeLeft, setTimeLeft] = useState("");
  const [slideIndex, setSlideIndex] = useState(0);

  const TARGET_DATE = new Date("2026-02-14T13:30:00");

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

  function randomTilt() {
    return Math.random() * 12 - 6; // -6° to +6°
  }

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
            Start Adventure
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
              <h4 className="love-light" style={{ fontWeight: "bold" }}>Answer to reveal the next place</h4>
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
              <pre style={styles.clue}>{stop.clue}</pre>

              <div style={styles.taskBox}>
                <strong>Mini Mission:</strong>
                <p>{stop.task}</p>
              </div>

              <div style={styles.buttonRow}>
                <button
                  onClick={() => setShowHint(true)}
                  style={{ ...styles.button, background: "#f59e0b", marginTop: 0 }}
                >
                  Hint 💡
                </button>
                {index < stops.length - 1 ? (
                  <button onClick={nextStop} style={{ ...styles.button, marginTop: 0 }}>
                    Next Stop →
                  </button>
                ) : (
                  <button onClick={reset} style={{ ...styles.button, marginTop: 0 }}>
                    Restart Hunt
                  </button>
                )}
              </div>

              {showHint && (
                <p style={{ marginTop: 10, fontStyle: "italic" }}>
                  Hint: The answer is <strong>{stop.answer}</strong>
                </p>
              )}
            </>
          )}
        </motion.div>
      </div>
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
    fontFamily: "inherit",
  },
  taskBox: {
    background: "#fff1f2",
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
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
