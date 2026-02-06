import React, { useMemo, useState, useEffect, useRef } from "react";

const CORRECT_USERNAME = "i will be your valentine";
const CORRECT_PASSWORD = "22_02_2026";

const HEART_SYMBOLS = ["❤️", "💕", "💖", "💗", "💓", "💝", "💞", "💟"];

function FloatingHeartSymbols({ count = 8 }) {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const newHearts = Array.from({ length: count }, (_, i) => ({
      id: i,
      symbol: HEART_SYMBOLS[Math.floor(Math.random() * HEART_SYMBOLS.length)],
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 10,
    }));
    setHearts(newHearts);
  }, [count]);

  return (
    <>
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="floating-heart-symbol"
          style={{
            left: `${heart.left}%`,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
          }}
        >
          {heart.symbol}
        </div>
      ))}
    </>
  );
}

function calculateLove(username, password) {
  const totalNeeded = CORRECT_USERNAME.length + CORRECT_PASSWORD.length;
  const current =
    Math.min(username.length, CORRECT_USERNAME.length) +
    Math.min(password.length, CORRECT_PASSWORD.length);
  const pct = Math.min(100, Math.round((current / totalNeeded) * 100));
  return pct;
}

function Login({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [shake, setShake] = useState(false);
  const [butterflies, setButterflies] = useState([]);
  const [showDoorAnimation, setShowDoorAnimation] = useState(false);
  const [doorOpen, setDoorOpen] = useState(false);

  const love = useMemo(
    () => calculateLove(username, password),
    [username, password]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === CORRECT_USERNAME && password === CORRECT_PASSWORD) {
      // Show door opening animation
      setShowDoorAnimation(true);
      setTimeout(() => {
        setDoorOpen(true);
        // Add butterflies on success
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            const newButterfly = {
              id: Date.now() + Math.random() + i,
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            };
            setButterflies((prev) => [...prev, newButterfly]);
            setTimeout(() => {
              setButterflies((prev) => prev.filter((b) => b.id !== newButterfly.id));
            }, 3000);
          }, i * 200);
        }
        setTimeout(() => {
          setShowDoorAnimation(false);
          setDoorOpen(false);
          onSuccess();
        }, 2000);
      }, 500);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div className="scene scene-login">
      <div className="eiffel-glow" />
      <div className="floating-hearts" />
      <div className="butterflies" />
      <FloatingHeartSymbols count={6} />

      <div className="card login-card">
        <h1 className="title">Will you be my valentine?</h1>
        <p className="subtitle">
          Type the magic words and watch the love meter rise.
        </p>

        <div className="love-meter">
          <div
            className="love-meter-fill"
            style={{ width: `${love}%` }}
          ></div>
          <div className="love-meter-heart">
            {love}
            <span className="love-meter-percent">%</span>
          </div>
        </div>

        <form
          className={`login-form ${shake ? "shake" : ""}`}
          onSubmit={handleSubmit}
        >
          <label className="field-label">
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='i will be your valentine'
              autoComplete="off"
            />
          </label>
          <label className="field-label">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="22_02_2026"
              autoComplete="off"
            />
          </label>

          <button type="submit" className="btn-primary">
            Unlock my heart
          </button>
        </form>

        {showDoorAnimation && (
          <div className="door-animation-overlay">
            <div className={`door-container ${doorOpen ? "open" : ""}`}>
              <div className="door-left"></div>
              <div className="door-right"></div>
              <div className="key-animation">🗝️</div>
              <div className="heart-behind-door">❤️</div>
            </div>
          </div>
        )}

        {butterflies.map((butterfly) => (
          <div
            key={butterfly.id}
            className="flying-butterfly"
            style={{
              left: `${butterfly.x}px`,
              top: `${butterfly.y}px`,
            }}
          >
            🦋
          </div>
        ))}
      </div>
    </div>
  );
}

function Home({ onYes }) {
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [butterflies, setButterflies] = useState([]);
  const [noClickCount, setNoClickCount] = useState(0);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const noAreaRef = useRef(null);
  const wrapperRef = useRef(null);

  // Proximity-based roaming - only move when cursor/touch is close
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current || !buttonRef.current || !noAreaRef.current) return;

      const container = containerRef.current;
      const button = buttonRef.current;
      const noArea = noAreaRef.current;

      // Get container bounds
      const containerRect = container.getBoundingClientRect();
      const noAreaRect = noArea.getBoundingClientRect();

      // Current button center position (absolute)
      const buttonCenterX = noAreaRect.left + noAreaRect.width / 2 + noPos.x;
      const buttonCenterY = noAreaRect.top + noAreaRect.height / 2 + noPos.y;

      // Cursor/touch position
      const cursorX = e.clientX || (e.touches && e.touches[0]?.clientX);
      const cursorY = e.clientY || (e.touches && e.touches[0]?.clientY);

      if (cursorX === undefined || cursorY === undefined) return;

      // Calculate distance from cursor to button center
      const distance = Math.sqrt(
        Math.pow(cursorX - buttonCenterX, 2) + Math.pow(cursorY - buttonCenterY, 2)
      );

      // Proximity threshold - move when cursor is within 120px (mobile) or 100px (desktop)
      const isMobile = window.innerWidth <= 780;
      const proximityThreshold = isMobile ? 120 : 100;

      if (distance < proximityThreshold) {
        // Calculate angle away from cursor
        const angle = Math.atan2(
          buttonCenterY - cursorY,
          buttonCenterX - cursorX
        ) + (Math.random() - 0.5) * 0.5; // Add some randomness

        // Calculate workspace boundaries (within the main card container)
        const container = containerRef.current;
        const containerRect = container.getBoundingClientRect();
        const padding = 20;
        const btnRadius = 30;

        // Calculate center of noArea relative to container
        const anchorX = noAreaRect.left - containerRect.left + noAreaRect.width / 2;
        const anchorY = noAreaRect.top - containerRect.top + noAreaRect.height / 2;

        // Compute possible range for noPos relative to anchor
        const minX = padding + btnRadius - anchorX;
        const maxX = containerRect.width - padding - btnRadius - anchorX;
        const minY = padding + btnRadius - anchorY;
        const maxY = containerRect.height - padding - btnRadius - anchorY;

        // Distance to move - bigger jumps when in a bigger container
        const moveDist = isMobile ? 90 : 70;

        let targetX = noPos.x + Math.cos(angle) * moveDist;
        let targetY = noPos.y + Math.sin(angle) * moveDist;

        // Clamp to allowed range within the card
        const finalX = Math.max(minX, Math.min(maxX, targetX));
        const finalY = Math.max(minY, Math.min(maxY, targetY));

        setNoPos({ x: finalX, y: finalY });

        // Add butterfly animation when button moves
        const newButterfly = {
          id: Date.now() + Math.random(),
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        };
        setButterflies((prev) => [...prev, newButterfly]);
        setTimeout(() => {
          setButterflies((prev) => prev.filter((b) => b.id !== newButterfly.id));
        }, 3000);
      }
    };

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleMouseMove, { passive: true });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleMouseMove);
    };
  }, [noPos]);

  const handleButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setNoClickCount(prev => prev + 1);

    // Move button away on click attempt (teleport within card)
    if (!containerRef.current || !noAreaRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const padding = 20;
    const btnRadius = 30;

    const anchorX = noAreaRef.left - containerRect.left + noAreaRect.width / 2;
    const anchorY = noAreaRef.top - containerRect.top + noAreaRect.height / 2;

    const minX = padding + btnRadius - anchorX;
    const maxX = containerRect.width - padding - btnRadius - anchorX;
    const minY = padding + btnRadius - anchorY;
    const maxY = containerRect.height - padding - btnRadius - anchorY;

    // Pick a random spot anywhere inside the home card
    const newX = minX + Math.random() * (maxX - minX);
    const newY = minY + Math.random() * (maxY - minY);

    setNoPos({ x: newX, y: newY });
  };

  const handleYesClick = () => {
    // Add butterflies on Yes click
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const newButterfly = {
          id: Date.now() + Math.random() + i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        };
        setButterflies((prev) => [...prev, newButterfly]);
        setTimeout(() => {
          setButterflies((prev) => prev.filter((b) => b.id !== newButterfly.id));
        }, 3000);
      }, i * 150);
    }
    setTimeout(() => onYes(), 1200);
  };

  return (
    <div className="scene scene-home">
      <div className="eiffel-glow stronger" />
      <div className="floating-hearts denser" />
      <div className="butterflies more" />
      <FloatingHeartSymbols count={10} />

      <div className="card home-card" ref={containerRef}>
        <h2 className="home-title">
          Adiye Rekha!!!
          <br />
          <span className="home-subtitle">
            I love you, will you be my valentine?
          </span>
        </h2>

        <p className="home-text">
          There is only one correct answer. Choose wisely. 💗
        </p>

        {noClickCount >= 3 && (
          <p className="no-message">
            Romba try panatha click Yes
          </p>
        )}

        <div className="home-buttons-wrapper" ref={wrapperRef}>
          <button className="btn-primary big" onClick={handleYesClick}>
            Yes
          </button>

          <div className="no-area" ref={noAreaRef}>
            <button
              ref={buttonRef}
              className="btn-ghost no-btn"
              style={{
                transform: `translate(calc(-50% + ${noPos.x}px), calc(-50% + ${noPos.y}px))`
              }}
              onClick={handleButtonClick}
              onTouchStart={handleButtonClick}
            >
              No
            </button>
          </div>

          {butterflies.map((butterfly) => (
            <div
              key={butterfly.id}
              className="flying-butterfly"
              style={{
                left: `${butterfly.x}px`,
                top: `${butterfly.y}px`,
              }}
            >
              🦋
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Letter() {
  const [opened, setOpened] = useState(false);
  const [isUnfolding, setIsUnfolding] = useState(false);
  const [ribbonCut, setRibbonCut] = useState(false);
  const [showScissors, setShowScissors] = useState(false);
  const [letterRead, setLetterRead] = useState(false);
  const [butterflies, setButterflies] = useState([]);

  const handleRibbonClick = () => {
    setShowScissors(true);
    setTimeout(() => {
      setRibbonCut(true);
      setShowScissors(false);
      setTimeout(() => {
        setIsUnfolding(true);
        setTimeout(() => {
          setOpened(true);
          setIsUnfolding(false);
        }, 1200);
      }, 800);
    }, 800);

    // Add butterfly animation
    const newButterfly = {
      id: Date.now() + Math.random(),
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    };
    setButterflies((prev) => [...prev, newButterfly]);
    setTimeout(() => {
      setButterflies((prev) => prev.filter((b) => b.id !== newButterfly.id));
    }, 3000);
  };

  const handleCall = () => {
    window.location.href = "tel:+919344721150";
  };

  return (
    <div className="scene scene-letter">
      <div className="eiffel-glow strongest" />
      <div className="floating-hearts intense" />
      <div className="butterflies most" />
      <FloatingHeartSymbols count={12} />

      <div className="card letter-card">
        <div className="letter-stage">
          {!opened && (
            <div className="ribbon-container">
              <button
                className={`ribbon ${ribbonCut ? "cut" : ""}`}
                onClick={handleRibbonClick}
              >
                ✂ Cut the ribbon
              </button>
              {showScissors && (
                <div className="scissors-animation">
                  <span className="scissors-icon">✂️</span>
                </div>
              )}
            </div>
          )}

          <div className={`envelope ${opened ? "open" : ""}`}>
            <div className="envelope-back" />
            <div className="envelope-front" />
            <div className="envelope-flap" />
            <div className={`letter-sheet ${opened ? "show" : ""} ${isUnfolding ? "unfolding" : ""}`}>
              <div className="letter-content">
                <h3>To my dearest Rekha,</h3>
                <p>
                  In a world of billions, my heart chose you – again and again,
                  in every lifetime I can imagine.
                </p>
                <p>
                  Your smile is my sunrise, your laughter is my favorite song,
                  and every tiny moment with you feels like a scene from the most
                  beautiful love story.
                </p>
                <p>
                  I don&apos;t know what tomorrow looks like, but I know this –
                  as long as I get to walk it with you, my heart is already home.
                </p>
                <p className="quote">
                  &quot;You are my now, my always, my forever Valentine.&quot;
                </p>
                <p className="signature">With all my love,</p>
                <p className="signature">Your Valentine Prem ❤️</p>
              </div>

              {opened && !letterRead && (
                <button
                  className="btn-read-more"
                  onClick={() => setLetterRead(true)}
                >
                  Click me
                </button>
              )}

              {letterRead && (
                <div className="date-section">
                  <p className="date-text">Come let&apos;s date 💕</p>
                  <button className="btn-primary big" onClick={handleCall}>
                    📞 Call Me
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {butterflies.map((butterfly) => (
          <div
            key={butterfly.id}
            className="flying-butterfly"
            style={{
              left: `${butterfly.x}px`,
              top: `${butterfly.y}px`,
            }}
          >
            🦋
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState("login");

  return (
    <div className="app-root">
      {step === "login" && <Login onSuccess={() => setStep("home")} />}
      {step === "home" && <Home onYes={() => setStep("letter")} />}
      {step === "letter" && <Letter />}
    </div>
  );
}

