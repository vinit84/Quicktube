import React from "react";

const Service = () => {
  return (
    <section className="pb-12 pt-20 dark:bg-dark lg:pb-[90px] lg:pt-[120px] ">
      <div className="container w-screen mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto mb-12 max-w-[460px] text-center lg:mb-20 ">
              <span className="flex flex-row my-5 w-fit  mx-auto px-3 py-1 text-lg Gilroy-SemiBold text-white bg-neutral-950 drop-shadow-lg border-[1px] border-[#1f2734] rounded-full ">
                Our Services
              </span>
              <h2 className="mb-3 text-3xl Gilroy-Bold leading-[1.2] text-white dark:text-white sm:text-4xl md:text-[40px]">
                What We Offer
              </h2>
              <p className="text-base Gilroy-Regular text-gray-200 dark:text-dark-6">
              Seamless Collaboration Streamlining Connections Between YouTubers and Video Editors
              </p>
            </div>
          </div>
        </div>

        <div className="-mx-4 flex flex-wrap">
          <ServiceCard
           title="YouTube Integration"
           details="Seamlessly integrate with YouTube channels to manage and publish videos directly from our platform."
           icon={
            <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.985-8 4.015z"
              fill="white"
            />
          </svg>
            }
          />
          <ServiceCard
            title="Editor Access"
            details="Grant video editors access to YouTuber workspaces for efficient collaboration. Editors can seamlessly finalize content."
            icon={
              <img width="36" height="36" src="https://img.icons8.com/material-rounded/36/ffffff/video-editing.png" alt="video-editing"/>
            }
          />
          <ServiceCard
             title="Approval Notifications"
             details="Notify YouTubers for content approval via WhatsApp or Slack for a streamlined process make's the Workflow more easier."
             icon={
              <img width="36" height="36" src="https://img.icons8.com/material-rounded/36/ffffff/notification-center.png" alt="notification-center"/>
            }
          />
          {/* <ServiceCard
                title="Metadata Customization"
            details="Customize video metadata like title, description,tags,visibility status before publishing."
            icon={
              <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm-.5 6h-3c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h3c.276 0 .5.224.5.5s-.224.5-.5.5zm0 4h-7c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h7c.276 0 .5.224.5.5s-.224.5-.5.5zm0 4h-7c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h7c.276 0 .5.224.5.5s-.224.5-.5.5zm-12-8h-3c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h3c.276 0 .5.224.5.5s-.224.5-.5.5z"
                fill="white"
              />
            </svg>
            }
          /> */}
           <ServiceCard
            title="Multi-Channel Management"
            details="Effortlessly manage multiple YouTube channels from a single unified platform, saving time and increasing efficiency."
            icon={
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"
                  fill="white"
                />
              </svg>
            }
          />
          <ServiceCard
             title="Two-Step Approval"
             details="Enhance security with a two-step approval process for content. This ensures that all content undergoes through review."
             icon={
              <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"
                fill="white"
              />
            </svg>
            }
          />
          <ServiceCard
              title="YouTuber Control"
              details="Provide YouTubers with enhanced control over their content before uploading to YouTube servers."
              icon={
                <img width="36" height="36" src="https://img.icons8.com/material-rounded/36/ffffff/administrator-male.png" alt="administrator-male"/>
            }
          />
        </div>
      </div>
    </section>
  );
};

export default Service;

const ServiceCard = ({ icon, title, details }) => {
  return (
    <>
      <div className="w-full px-4 md:w-1/2 lg:w-1/3">
        <div className="mb-9 rounded-[20px] bg-neutral-950 drop-shadow-lg border-[1px] border-[#1f2734] p-10 shadow-2 hover:shadow-lg dark:bg-dark-2 md:px-7 xl:px-10">
          <div className="mb-8 flex h-[70px] w-[70px] items-center justify-center rounded-2xl bg-[#5E17EB]">
            {icon}
          </div>
          <h4 className="mb-[14px] text-2xl Gilroy-SemiBold text-white dark:text-white">
            {title}
          </h4>
          <p className="text-gray-300 dark:text-white">{details}</p>
        </div>
      </div>
    </>
  );
};











