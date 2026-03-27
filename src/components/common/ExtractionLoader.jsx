
import React from "react";

const ExtractionLoader = ({ count = 0, label = "Items Extracted" }) => {
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="relative w-[150px] h-[150px] flex items-center justify-center mx-auto my-[10px]">
        {/* Dash border loader */}
        <div className="absolute inset-0 rounded-full border-[6px] border-dashed border-primary opacity-90 animate-[spinDash_8s_linear_infinite]"></div>
        
        {/* Inner glassmorphism content */}
        <div className="flex flex-col items-center justify-center z-[2] bg-white/90 w-[110px] h-[110px] rounded-full shadow-[inset_0_2px_10px_rgba(15,121,44,0.1),0_4px_15px_rgba(0,0,0,0.05)] backdrop-blur-[4px]">
          <span className="text-primary font-extrabold text-[52px] leading-[1] mb-[2px] drop-shadow-[0_0_10px_rgba(15,121,44,0.3)]">
            {count}
          </span>
          <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider text-center px-2">
            {label}
          </span>
        </div>
      </div>
      
      <style hsla>{`
        @keyframes spinDash {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ExtractionLoader;