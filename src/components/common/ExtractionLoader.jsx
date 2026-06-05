
import React, { useEffect, useState } from "react";

const ExtractionLoader = ({ count = 0, total = 0, label = "Items Extracted", isLoading = false }) => {
  const [displayCount, setDisplayCount] = useState(0);

  // Smooth count-up effect
  useEffect(() => {
    let start = displayCount;
    const end = count;
    if (start === end) return;

    const duration = 400; // ms
    const increment = (end - start) / (duration / 16); // 60fps

    const timer = setInterval(() => {
      start += increment;
      if ((increment > 0 && start >= end) || (increment < 0 && start <= end)) {
        setDisplayCount(end);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [count, displayCount]);

  const showStarting = isLoading && count === 0 && total === 0;

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="relative w-[160px] h-[160px] flex items-center justify-center mx-auto my-[10px]">
        <div className="absolute inset-0 rounded-full border-[6px] border-dashed border-primary animate-[spinDash_6s_linear_infinite]"></div>

        <div className="flex flex-col items-center justify-center z-[2] relative gap-1">
          <div className="flex items-center justify-center w-full">
            {showStarting ? (
              <span className="text-primary font-black text-lg tracking-tight animate-pulse uppercase">
                Starting
              </span>
            ) : (
              <div className="flex items-baseline gap-0.5">
                <span className="text-primary font-black text-5xl leading-none drop-shadow-[0_0_15px_rgba(15,121,44,0.2)]">
                  {displayCount}
                </span>
                {total > 0 && (
                  <span className="text-gray-400 font-bold text-lg">/{total}</span>
                )}
              </div>
            )}
          </div>
          {label && total > 0 && (
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide text-center px-3">
              {label}
            </span>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes spinDash {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ExtractionLoader;

