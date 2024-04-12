import React from "react";
import Tabs from "../UI/animated_tabs";
import Youtuber from "../../assets/Youtuber.png";
import Editor from "../../assets/Editor.png";
import Upload from "../../assets/Upload.png"
import Video from "../../assets/Video.mp4";
import ReactPlayer from 'react-player';
// Import or define other images
// import ProductImage from "../../assets/Product.png";
// import ServicesImage from "../../assets/Services.png";
// import PlaygroundImage from "../../assets/Playground.png";
// import ContentImage from "../../assets/Content.png";
// import RandomImage from "../../assets/Random.png";

function TabsDemo() {
  const tabs = [
    {
      title: "Youtuber",
      value: "youtuber",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl Gilroy-Bold text-white bg-gradient-to-br from-[#5E17EB] to-indigo-200">
          <p>Youtuber Dashboard</p>
          <DummyContent src={Youtuber} />
        </div>
      ),
    },
    {
      title: "Editor",
      value: "editor",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl Gilroy-Bold text-white bg-gradient-to-br from-[#5E17EB] to-indigo-200">
          <p>Editor Dashboard</p>
          <DummyContent src={Editor} />
        </div>
      ),
    },
    {
      title: "Upload",
      value: "upload",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl Gilroy-Bold text-white bg-gradient-to-br from-[#5E17EB] to-indigo-200">
          <p>Uplaod</p>
          <DummyContent src={Upload} />
        </div>
      ),
    },
    {
      title: "Review",
      value: "review",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl Gilroy-Bold text-white bg-gradient-to-br from-[#5E17EB] to-indigo-200">
          <p>Review</p>
          <DummyContent src={Youtuber} />
        </div>
      ),
    },
    // {
    //   title: "Random",
    //   value: "random",
    //   content: (
    //     <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl Gilroy-Bold text-white bg-gradient-to-br from-[#5E17EB] to-indigo-200">
    //       <p>Random tab</p>
    //       <DummyContent src={Youtuber} />
    //     </div>
    //   ),
    // },
  ];

  return (
    <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full  items-start justify-start my-40">
      <Tabs tabs={tabs} />
    </div>
  );
}

// const DummyContent = ({ src }) => {
  const DummyContent = ({ src }) => {
  // Check if the src prop is a video based on its file extension
  // const isVideo = src.endsWith('.mp4');

  return (
    <div className="object-cover object-left-top h-[60%] md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto">
      {/* {isVideo ? (
        <video src={src} width="1000" height="1000" className="rounded-xl" controls></video>
      ) : ( */}
        <img src={src} width="1000" height="1000" className="rounded-xl"></img>
      {/* )} */}
    </div>
  );
};

export default TabsDemo;