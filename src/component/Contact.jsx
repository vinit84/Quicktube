import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import emailjs from "emailjs-com";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Contact() {
  const sendEmail = (e) => {
    e.preventDefault(); // Prevent the default form submission

    emailjs
      .sendForm(
        "service_0od8e4t",
        "template_15c6iqp",
        e.target,
        "PxkyQj7qBEUWwVlkg"
      )
      .then(
        (result) => {
          console.log(result.text);
          toast.success("Message sent successfully!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        },
        (error) => {
          console.log(error.text);
          toast.error("Failed to send message. Please try again later.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      );
  };

  return (
    <div className="bg-black w-screen h-screen">
      <div className=" mx-auto px-4 sm:py-10 sm:px-6 lg:px-8">
        <div className="relative w-fit h-fit bg-black shadow-xl">
          <ToastContainer />
          {/* <h2 className="sr-only">Contact us</h2> */}

          <div className="grid  grid-cols-1 lg:grid-cols-2">
            <div className="flex flex-col py-10 lg:mx-5 mx-10 md:px-16 lg:px-0">
              <h3 className="lg:text-5xl md:text-5xl text-3xl Gilroy-Bold text-white">
                Get in touch
              </h3>
              <p className="mt-6 text-base text-indigo-50 max-w-3xl">
                Have a question, comment, or need assistance? We're here to
                help! Please fill out the form below, and we'll get back to you
                as soon as possible. You can also reach us via email or phone.
              </p>
              <dl className="mt-8 space-y-6">
                <dt>
                  <span className="sr-only">Phone number</span>
                </dt>
                <dd className="flex text-base text-white">
                  <PhoneIcon
                    className="flex-shrink-0 w-6 h-6 text-white"
                    aria-hidden="true"
                  />
                  <span className="ml-3">+91 9082685211</span>
                </dd>
                <dt>
                  <span className="sr-only">Email</span>
                </dt>
                <dd className="flex text-base text-white">
                  <EnvelopeIcon
                    className="flex-shrink-0 w-6 h-6 text-white"
                    aria-hidden="true"
                  />
                  <span className="ml-3">support@quicktube.com</span>
                </dd>
              </dl>
            </div>

            {/* Contact form */}
            <div className="py-10 bg-neutral-950 h-full rounded-2xl lg:px-6  px-10 sm:px-10 lg:col-span-1 xl:p-12 lg:mr-6  md:mx-20 lg:mx-0 md:mt-20 lg:mt-0">
              {/* <h3 className="text-lg Gilroy-Medium text-white">
                Send us a message
              </h3> */}
              <form
                onSubmit={sendEmail}
                method="POST"
                className="mt-6 grid grid-cols-1 gap-y-6 Gilroy-Medium sm:grid-cols-2 sm:gap-x-8"
              >
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-sm Gilroy-Medium text-white"
                  >
                    First name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="first-name"
                      id="first-name"
                      autoComplete="given-name"
                      className="py-2 px-4 block w-full bg-neutral-950  shadow-sm text-white focus:ring-indigo-500 focus:border-indigo-500 border-[1px] border-white rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-sm Gilroy-Medium text-white"
                  >
                    Last name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="last-name"
                      id="last-name"
                      autoComplete="family-name"
                      className="py-2 px-4 block w-full bg-neutral-950 border-[1px] border-white shadow-sm text-white focus:ring-indigo-500 focus:border-indigo-500  rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm Gilroy-Medium text-white"
                  >
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="py-2 px-4 block w-full shadow-sm bg-neutral-950 border-[1px] border-white text-white focus:ring-indigo-500 focus:border-indigo-500  rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between">
                    <label
                      htmlFor="phone"
                      className="block text-sm Gilroy-Medium text-white"
                    >
                      Phone
                    </label>
                    {/* <span id="phone-optional" className="text-sm text-gray-500">
                      Optional
                    </span> */}
                  </div>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="phone"
                      id="phone"
                      autoComplete="tel"
                      requiindigo
                      className="py-2 px-4 block w-full bg-neutral-950 border-[1px] border-white shadow-sm text-white focus:ring-indigo-500 focus:border-indigo-500  rounded-md"
                      aria-describedby="phone-optional"
                    />
                  </div>
                </div>
                {/* <div className="sm:col-span-2">
                  <label
                    htmlFor="subject"
                    className="block text-sm Gilroy-Medium text-white"
                  >
                    Website
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      className="py-2 px-4 block w-full bg-neutral-950 border-[1px] border-white shadow-sm text-white focus:ring-indigo-500 focus:border-indigo-500  rounded-md"
                    />
                  </div>
                </div> */}
                <div className="sm:col-span-2">
                  <div className="flex justify-between">
                    <label
                      htmlFor="message"
                      className="block text-sm Gilroy-Medium text-white"
                    >
                      Message
                    </label>
                    <span id="message-max" className="text-sm  text-gray-500">
                      Max. 500 characters
                    </span>
                  </div>
                  <div className="mt-1">
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="py-2 px-4 block w-full shadow-sm bg-neutral-950 border-[1px] border-white text-white focus:ring-indigo-500 focus:border-indigo-500  rounded-md"
                      aria-describedby="message-max"
                      defaultValue={""}
                    />
                  </div>
                </div>
                <div className="sm:col-span-2 sm:flex sm:justify-end">
                  <button
                    type="submit"
                    className="mt-2 w-full inline-flex items-center justify-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-base Gilroy-Medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
