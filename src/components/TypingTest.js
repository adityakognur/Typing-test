import React, { useState, useEffect, useRef } from "react";
import "./TypingTest.css";

const TypingTest = () => {
  const [words, setWords] = useState(generateRandomWords());
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typedWord, setTypedWord] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [selectedTime, setSelectedTime] = useState(60);
  const [countdown, setCountdown] = useState(3);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const typingAreaRef = useRef(null);
  let timerInterval = useRef(null);

  function generateRandomWords() {
    const sampleWords = [
      "apple", "banana", "orange", "grape", "pear", "peach", "plum", "kiwi", "lemon", "lime",
      "house", "car", "computer", "keyboard", "mouse", "screen", "bottle", "cup", "table", "phone",
      "run", "jump", "walk", "dance", "sleep", "eat", "drink", "think", "read", "write",
    ];
    const newWords = [];
    for (let i = 0; i < 12; i++) {
      newWords.push(sampleWords[Math.floor(Math.random() * sampleWords.length)]);
    }
    return newWords;
  }

  const startCountdown = () => {
    setIsCountingDown(true);
    let countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          clearInterval(countdownInterval);
          startTest();
          setIsCountingDown(false);
          return 3;
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };

  const getSpeedMessage = () => {
    const wpm = wordCount;
    if (wpm < 20) {
      return "You're a beginner, keep practicing!";
    } else if (wpm < 40) {
      return "Good job, you're getting better!";
    } else if (wpm < 60) {
      return "You're quite fast, keep up the good work!";
    } else {
      return "Master level typing! Incredible speed!";
    }
  };

  const startTest = () => {
    setIsTestStarted(true);
    setTimeLeft(selectedTime);
    setWordCount(0);
    setCurrentWordIndex(0);
    setWords(generateRandomWords());
    setTypedWord("");
    setShowResult(false);
  
    // Make sure the typing area exists before trying to set the focus and disable state
    if (typingAreaRef.current) {
      typingAreaRef.current.disabled = false;
      typingAreaRef.current.focus();
    }
  
    // Clear any previous timers
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
  
    // Start the timer
    timerInterval.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerInterval.current);
          setShowResult(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };
  

  const handleTyping = (event) => {
    const typed = event.target.value.trim();
    setTypedWord(event.target.value);

    if (typed === words[currentWordIndex]) {
      setWordCount(wordCount + 1);
      setCurrentWordIndex((prevIndex) => prevIndex + 1);
      setTypedWord("");

      if (currentWordIndex + 1 === words.length) {
        setWords(generateRandomWords());
        setCurrentWordIndex(0);
      }
    }
  };



  const handleRestart = () => {
    setShowResult(false); // Hide the result modal
    setIsTestStarted(false); // Reset the test state
    startCountdown(); // Start the countdown to restart the test
  };


  const resetTest = () => {
    setShowResult(false); // Close the result modal
    setIsTestStarted(false); // Allow the user to start the test again
    setWordCount(0); // Reset the word count
    setCurrentWordIndex(0); // Reset the word index
    setTypedWord(""); // Clear the typing area
    setTimeLeft(0); // Reset the timer
    setSelectedTime(60); // Reset to default time, or keep the user's last choice
  };
  


  return (
    <div className={`typing-test-container ${showResult ? "blurred" : ""}`}>
      <h1>Typing Speed Test</h1>

      <div className="select-container">
      <label>Select Test Duration: </label>
        <select
          className="select-items"
          value={selectedTime}
          onChange={(e) => setSelectedTime(Number(e.target.value))}
          disabled={isTestStarted || isCountingDown}
        >
          <option value="30">30 seconds</option>
          <option value="60">60 seconds</option>
          <option value="120">120 seconds</option>
        </select>
      </div>

      <div className="start-button-container">
        <button
          className="start-button"
          onClick={startCountdown}
          disabled={isTestStarted || isCountingDown}
        >
          {isTestStarted ? "Restart Test" : "Start Test"}
        </button>
      </div>

      {isCountingDown && <p className="countdown">{countdown}</p>}

      {!isCountingDown && (
        <>
          <p id="timer">Time Left: {timeLeft}s</p>
          <p id="word-count">Words Typed: {wordCount}</p>

          <div className="text-to-type">
            <span className="highlighted-word">{words[currentWordIndex]}</span>{" "}
            <span className="remaining-words">{words.slice(currentWordIndex + 1).join(" ")}</span>
          </div>

          <textarea
            autoFocus
            ref={typingAreaRef}
            id="typing-area"
            value={typedWord}
            onChange={handleTyping}
            disabled={!isTestStarted || timeLeft === 0}
            placeholder="Start typing the word above..."

          ></textarea>
        </>
      )}

{showResult && (
  <div className="modal">
    <div className="modal-content">
      <button className="close-button" onClick={() => {
        setShowResult(false); // Close the modal
        resetTest(); // Reset test to initial state
      }}>
        X
      </button> {/* Close button */}
      <h2>Your Result</h2>
      <p>
        You typed {wordCount} words in {selectedTime} seconds. {getSpeedMessage()}
      </p>
      <button className="Restart-button" onClick={handleRestart}>Restart</button> {/* Restart button */}
    </div>
  </div>
)}

    </div>
  );
};

export default TypingTest;

