import { useState } from "react";
import { motion } from "framer-motion";

import './App.css'

import Lottie from "lottie-react";
import loveCat from "./assets/love-cat.json";
import heartsAnim from "./assets/hearts.json";

const DEV_MODE = false;

// Simplified flow per stop:
// 1) Show question
// 2) Correct answer reveals place + clue + task
// 3) Button moves to next stop (no extra unlock code)

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
  const [playerName, setPlayerName] = useState("");

  const [showHint, setShowHint] = useState(false);

  const stop = stops[index];

  function startHunt() {
    if (playerName.trim().length === 0) return;
    setStarted(true);
  }

  function checkAnswer() {
    if (input.trim().toLowerCase().includes(stop.answer)) {
      setPhase("place");
      setInput("");
      setError(false);
      setShowHint(false);
      // 🎉 trigger animation
      setShowCelebrate(true);
      // auto hide after 2.5s
      setTimeout(() => setShowCelebrate(false), 3500);
    } else {
      setError(true);
    }
  }

  function nextStop() {
    if (index < stops.length - 1) {
      setIndex(index + 1);
      setPhase("question");
      setInput("");
      setError(false);
      setShowHint(false);
    }
  }

  function reset() {
    setIndex(0);
    setPhase("question");
    setInput("");
    setError(false);
    setShowHint(false);
  }

  function cheatReveal() {
    setPhase("place");
    setInput("");
    setError(false);
  }

  function cheatNext() {
    if (index < stops.length - 1) {
      setIndex(index + 1);
      setPhase("question");
      setInput("");
      setError(false);
    }
  }

  if (!started) {
    return (
      <div style={styles.page}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.card}
        >
          <h1>❤️ Valentines Day Adventure</h1>
          <h3>A Richmond Scavenger Hunt</h3>

          <p style={{ marginTop: 16 }}>
            Before we begin… who is this adventure for?
          </p>

          <input
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            style={styles.input}
          />

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
    <h2>❤️ Valentines Day Adventure</h2>
    <h4>A Scavenger Hunt</h4>

    {phase === "question" ? (
      <>
        <h2>Answer to reveal the next place</h2>
        <p style={{ marginTop: 10 }}>{stop.question}</p>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Your answer"
          style={styles.input}
        />

        {error && <p style={{ color: "red" }}>Not quite — try again 💭</p>}

        <button onClick={checkAnswer} style={styles.button}>
          Reveal Place
        </button>

        {DEV_MODE && (
          <button
            onClick={cheatReveal}
            style={{ ...styles.button, background: "#9ca3af", marginLeft: 8 }}
          >
            Cheat: Reveal
          </button>
        )}
        {DEV_MODE && (
          <button
            onClick={cheatNext}
            style={{ ...styles.button, background: "#9ca3af", marginLeft: 8 }}
          >
            Cheat: Next Stop →
          </button>
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

        {index < stops.length - 1 ? (
          <button onClick={nextStop} style={styles.button}>
            Next Stop →
          </button>
        ) : (
          <button onClick={reset} style={styles.button}>
            Restart Hunt
          </button>
        )}
      </>
    )}
    <>
      <button
        onClick={() => setShowHint(true)}
        style={{ ...styles.button, background: "#f59e0b", marginLeft: 8 }}
      >
        Hint 💡
      </button>

      {showHint && (
        <p style={{ marginTop: 10, fontStyle: "italic" }}>
          Hint: The answer is <strong>{stop.answer}</strong>
        </p>
      )}
    </>
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
    padding: "2em",
    color: "#020202",
    overflow: "auto",
  },
  card: {
    position: "relative",
    background: "white",
    padding: "3em",
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
