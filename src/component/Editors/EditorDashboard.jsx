import { Fragment, useEffect, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  BellIcon,
  HomeIcon,
  Bars3Icon,
  XMarkIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import UploadForm from "./UploadForm";
import { useParams } from "react-router-dom";
import { getAuth, signOut } from "@firebase/auth";
import { ToastContainer, toast } from "react-toastify";
// import { getDatabase, onValue, ref } from "firebase/database";
import { app } from "../../firebase/firebaseconfig";
import VideoDisplay from "../VideoDisplay";
import { useNavigate } from 'react-router-dom';
// import EditorsList from "../Youtuber/EditorsList";


const notifySuccess = (message) =>
  toast.success(message, {
    position: "bottom-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  });

const notifyError = (errorMessage) =>
  toast.error(errorMessage, {
    position: "bottom-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  });

const navigation = [
  {
    id: "dashboard",
    name: "Dashboard",

    icon: HomeIcon,
    current: true,
  },
  {
    id: "upload",
    name: "Upload",

    icon: VideoCameraIcon,
    current: false,
  },
];

// const channels = [
//   {
//     id: "ranveer",
//     name: "Ranveer",

//     icon: ChartBarIcon,
//     current: false,
//   }
// ]
const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  {
    name: "Sign out",
    onClick: () => {
      const auth = getAuth(app);
      signOut(auth).then(() => {
        // Sign-out successful.
        notifySuccess("Sign out successful");
        // Redirect to login page
        window.location.href = "/login";
      }).catch((error) => {
        // An error happened.
        notifyError("Sign out error: " + error.message);
      });
    }
  },
];


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function EditorDashboard() {
  const { channelId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [navigationState, setNavigationState] = useState(navigation);
  const [videos, setVideos] = useState([]);
  const auth = getAuth(app);

  // Function to handle navigation item click
  const handleNavigationItemClick = (viewId) => {
    setCurrentView(viewId);
    // Close sidebar on mobile after selection
    setSidebarOpen(false);
    const updatedNavigationState = navigationState.map((item) => ({
      ...item,
      current: item.id === viewId,
    }));

    setNavigationState(updatedNavigationState);
  };

  const navigate = useNavigate();

  return (
    <>
      <div className="bg-black h-screen font-['Gilroy']">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 flex z-40 md:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-800">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-shrink-0 flex items-center px-4">
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
                    alt="Workflow"
                  />
                </div>
                <div className="mt-5 flex-1 h-0 overflow-y-auto">
                  <nav className="px-2 space-y-1">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                        )}
                      >
                        <item.icon
                          className={classNames(
                            item.current
                              ? "text-gray-300"
                              : "text-gray-400 group-hover:text-gray-300",
                            "mr-4 flex-shrink-0 h-6 w-6"
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </Transition.Child>
            <div className="flex-shrink-0 w-14" aria-hidden="true">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex-1 flex flex-col min-h-0 bg-[#09090b]">
          <div
              className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
                alt="Workflow"
              />
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-3 py-4 space-y-1 ">
                {navigationState.map((item) => (
                  <a
                    key={item.id}
                    onClick={(e) => {
                      e.preventDefault(); // Prevent default link behavior
                      handleNavigationItemClick(item.id);
                    }}
                    className={classNames(
                      item.current
                        ? "bg-gray-900 text-white font-semibold "
                        : "text-gray-300 hover:bg-gray-800 hover:text-white font-semibold",
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer font-semibold"
                    )}
                  >
                    <item.icon
                      className={classNames(
                        "mr-3 flex-shrink-0 h-6 w-6",
                        item.current
                          ? "text-gray-300"
                          : "text-gray-400 group-hover:text-gray-300"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
        <div className="md:pl-64 flex flex-col">
          <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-black shadow">
            <button
              type="button"
              className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-1 px-4 flex justify-between">
              <div className="flex-1 flex">
                <form className="w-full flex md:ml-0" action="#" method="GET">
                  <label htmlFor="search-field" className="sr-only">
                    Search
                  </label>
                  <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                    <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      id="search-field"
                      className="block bg-black w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                      placeholder="Search"
                      type="search"
                      name="search"
                    />
                  </div>
                </form>
              </div>
              <div className="ml-4 flex items-center md:ml-6">
                <button
                  type="button"
                  className="bg-black p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="max-w-xs bg-black flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-black ring-1 ring-white ring-opacity-5 focus:outline-none">
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <a
                            onClick={item.onClick}
                              href={item.href}
                              className={classNames(
                                active ? "bg-gray-900" : "",
                                "block px-4 py-2 text-sm text-white"
                              )}
                            >
                              {item.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <main className="flex-1 bg-black text-white">
            <div className="py-6 text-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {/* <h1 className="text-2xl font-semibold ">Dashboard</h1> */}
              </div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <div className="py-4 ">
                  {currentView === "dashboard" && (
                    <VideoDisplay
                      channelId={channelId}
                      basePath="editor/dashboard"
                    />
                  )}
                  {currentView === "upload" && <UploadForm />}
                </div>
                {/* /End replace */}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default EditorDashboard;
