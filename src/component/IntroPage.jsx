import React from "react";
import Designs from "./Designs";
import Feature from "./Feature";
import Logocloud from "./Logocloud";
import { GoogleGeminiEffect } from "./GoogleGeminiEffect";

const IntroPage = () => {
  return (
    <div className="bg-black h-screen font-['Gilroy'] w-screen md:py-24">
      <div className="flex justify-center items-center w-screen">
        <div className="text-center z-10">
         
          <p className="text-lg md:text-7xl Gilroy-SemiBold pb-4 text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-300">
            {`Introducing `} <span className="text-indigo-600">#Quicktube</span>
          </p>
          <p className="text-xs md:text-xl font-normal text-center text-neutral-400 mt-4 max-w-lg mx-auto">
            {`Accelerating your YouTube journey with Instant solutions and Endless
          Possibilities`}
          </p>
          <button
            className="bg-gradient-to-r from-indigo-600 to-[#050A30] hover:from-indigo-800 hover:to-[#050A30] w-32 sm:w-36 md:w-48 md:p-[15px] rounded-full border-none text-white text-sm sm:text-base md:text-md mt-4 sm:mt-6 md:mt-8 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
            onClick={() => {
              window.location.href = "/login";
            }}
          >
            Get started It's free
          </button>
        </div>
      </div>
      <div>
        <GoogleGeminiEffect />
      </div>
      {/* <Designs/>
      <Feature/> */}
    </div>
  );
};

export default IntroPage;
