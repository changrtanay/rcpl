import React, { useEffect, useState } from "react";

const FastBotButton = () => {
  const [buttonPosition, setButtonPosition] = useState("bottom-5");

  useEffect(() => {
    const checkOverlap = () => {
      const footer = document.querySelector("footer");
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Check if footer is visible in the viewport
        if (footerRect.top < viewportHeight) {
          setButtonPosition(`bottom-[${viewportHeight - footerRect.top + 10}px]`); // Add 10px gap
        } else {
          setButtonPosition("bottom-5");
        }
      }
    };

    window.addEventListener("resize", checkOverlap);
    window.addEventListener("scroll", checkOverlap);

    checkOverlap(); // Initial check
    return () => {
      window.removeEventListener("resize", checkOverlap);
      window.removeEventListener("scroll", checkOverlap);
    };
  }, []);

  return (
    <a
      href={`https://app.fastbots.ai/embed/${process.env.REACT_APP_FASTBOT_ID}`} // Use curly braces for dynamic values in JSX
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed ${buttonPosition} right-4 w-16 h-16 text-2xl bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transform hover:scale-110 transition duration-300 z-10`}
    >
      🤖
    </a>
  );
};

export default FastBotButton;
