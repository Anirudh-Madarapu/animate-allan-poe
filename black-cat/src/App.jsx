// === src/App.jsx ===
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import storyData from "./assets/storyData";
import "./style.css";

gsap.registerPlugin(ScrollTrigger);

afterStartAnimations();

export default function App() {
  const [started, setStarted] = useState(false);
  const horizontalRefs = useRef([]);

  useEffect(() => {
    if (!started) return;

    // CAPTION WORD‑BY‑WORD FLOW
    gsap.utils.toArray(".section-caption").forEach((cap) => {
      // Split caption text into word spans for staggered animation
      const words = cap.textContent.trim().split(/\s+/);
      cap.innerHTML = words.map((w) => `<span class=\"word\">${w}&nbsp;</span>`).join("");

      gsap.fromTo(
        cap.querySelectorAll(".word"),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.07,
          duration: 0.45,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cap,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // HORIZONTAL PANELS
    horizontalRefs.current.forEach((container) => {
      const panels = gsap.utils.toArray(".panel", container);
      if (panels.length < 2) return;
      gsap.set(container, { width: `${panels.length * 100}%` });
      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: container.parentNode,
          start: "top top",
          end: () => `+=${container.offsetWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });
    });

    ScrollTrigger.refresh();
  }, [started]);

  // START SCREEN
  const StartScreen = () => (
    <div className="start-screen">
      <h1 className="story-title">The Black Cat</h1>
      <p className="story-tagline">“Yet, mad am I not—and very surely do I not dream.”</p>
      <button className="begin-button" onClick={() => setStarted(true)}>
        Begin the Story
      </button>
    </div>
  );

  // RENDER SCENES
  const renderScene = (scene, idx) => {
    if (scene.panels && scene.panels.length > 1) {
      return (
        <section className="story-section horizontal" key={`h-${idx}`}>
          <div
            className="horizontal-inner"
            ref={(el) => (horizontalRefs.current[idx] = el)}
          >
            {scene.panels.map((p, i) => (
              <div
                className="panel"
                key={i}
                style={{ backgroundImage: `url(${p.image})` }}
              >
                <div className="panel-overlay" />
                <div className="section-caption panel-text">{p.text}</div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    const imgFirst = idx % 2 === 0;
    return (
      <section className="story-section vertical" key={`v-${idx}`}>        
        <div className={`scene-inner ${imgFirst ? "row" : "row reverse"}`}>
          <div
            className="scene-img"
            style={{ backgroundImage: `url(${scene.image})` }}
          >
            <div className="img-overlay" />
          </div>
          <div className="scene-text-wrapper">
            <p className="section-caption scene-text">{scene.text}</p>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="app-container">
      <div className="fog" /> {/* global moving fog layer */}
      {!started && <StartScreen />}
      {started && <main className="story-container">{storyData.map(renderScene)}</main>}
    </div>
  );
}

function afterStartAnimations() {
  // Ensure ScrollTrigger/GSAP loaded before any rendering if needed
}

// === src/style.css ===
/* Global */
