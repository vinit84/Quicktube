import { Fragment } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  BellIcon,
  CalendarIcon,
  Cog6ToothIcon,
  FolderIcon,
  HomeIcon,
  InboxStackIcon,
  Bars3Icon,
  UsersIcon,
  XMarkIcon,
  CreditCardIcon
} from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import EditorsList from "./EditorsList";
import React, { useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  onValue,
} from "firebase/database";
import { app } from "../../firebase/firebaseconfig";
import { getAuth, onAuthStateChanged ,signOut} from "@firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VideoDisplay from "../VideoDisplay";
import Details from "../Admin/Details";
import ProfileDashboard from "../ProfileDashbaord";
import Billing from "./Billing";

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
  // {
  //   id: "dashboard",
  //   name: "Dashboard",

  //   icon: HomeIcon,
  //   current: true,
  // },
  {
    id: "editors",
    name: "Editors",

    icon: UsersIcon,
    current: false,
  },
  // {
  //   id: "projects",
  //   name: "Projects",

  //   icon: FolderIcon,
  //   current: false,
  // },
  // {
  //   id: "calendar",
  //   name: "Calendar",

  //   icon: CalendarIcon,
  //   current: false,
  // },
  {
    id: "billing",
    name: "Billing",

    icon: CreditCardIcon,
    current: false,
  },
  {
    id: "settings",
    name: "Settings",

    icon: Cog6ToothIcon,
    current: false,
  },
//   {
//     id: "logout",
//     name: "Logout",
//     icon: XMarkIcon, // Assuming you have an icon for logout
//     current: false,
//     href: "#",
//     onClick: (e) => {
//       e.preventDefault(); // Prevent the default anchor action
//       const auth = getAuth(app);
//       signOut(auth).then(() => {
//         // Sign-out successful.
//         notifySuccess("You have been logged out successfully.");
//         // Redirect to login page
//         window.location.href = "/login";
//       }).catch((error) => {
//         // An error happened.
//         notifyError("Error during logout: " + error.message);
//       });
//     },
// },
];

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

function YoutuberDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [navigationState, setNavigationState] = useState(navigation);
  const [channelState, setChannelState] = useState([]);
  const [selectedChannelId, setSelectedChannelId] = useState(null);

  useEffect(() => {
    const auth = getAuth(app);
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, now you can fetch the channels
        const db = getDatabase(app);
        const channelsRef = ref(db, `users/${user.uid}/youtubechannels`);
        // Using onValue to listen for changes in real-time
        onValue(
          channelsRef,
          (snapshot) => {
            if (snapshot.exists()) {
              const channelsData = snapshot.val();
              const channelsArray = Object.entries(channelsData).map(
                ([key, value]) => ({
                  id: key,
                  name: value.name,
                  current: false, // Assuming you want to mark all channels as not current initially
                })
              );
              setChannelState(channelsArray);
            } else {
              // Handle the case where there are no channels
              setChannelState([]);
            }
          },
          (error) => {
            console.error("Error fetching channels:", error);
          }
        );
      } else {
        // User is signed out or there's no user. Clear the channels.
        setChannelState([]);
      }
    });

    // Cleanup function to unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, []); // This useEffect depends on the component mounting, hence the empty dependency array

  // Function to handle navigation item click
  const handleNavigationItemClick = (viewId) => {
    setCurrentView(viewId);
    // Close sidebar on mobile after selection
    setSidebarOpen(false);
    const updatedNavigationState = navigationState.map((item) => ({
      ...item,
      current: item.id === viewId,
    }));
    const updatedChannelState = channelState.map((channel) => ({
      ...channel,
      current: channel.id === viewId,
    }));
    setNavigationState(updatedNavigationState);
    setChannelState(updatedChannelState);
  };

  const handleNavigationChannelClick = (channelName) => {
    const db = getDatabase(app);
    const auth = getAuth(app);
    const user = auth.currentUser;
    if (user) {
      const channelsRef = ref(db, `users/${user.uid}/youtubechannels`);
      const channelsQuery = query(
        channelsRef,
        orderByChild("name"),
        equalTo(channelName)
      );

      onValue(
        channelsQuery,
        (snapshot) => {
          if (snapshot.exists()) {
            const channelId = Object.keys(snapshot.val())[0]; // Assuming each name is unique, get the first key
            setSelectedChannelId(channelId); // Set the selected channel ID
            setCurrentView("channelContent"); // Change the view to display the channel's content

            // Close sidebar on mobile after selection
            setSidebarOpen(false);
            // Update navigation state to reflect the current view
            const updatedNavigationState = navigationState.map((item) => ({
              ...item,
              current: item.id === "channelContent", // Assuming 'channelContent' is a valid id for the view
            }));
            // Update channel state to mark the selected channel as current
            const updatedChannelState = channelState.map((channel) => ({
              ...channel,
              current: channel.id === channelId,
            }));
            setNavigationState(updatedNavigationState);
            setChannelState(updatedChannelState);
          } else {
            console.error("Channel not found");
          }
        },
        {
          onlyOnce: true, // This ensures the listener triggers only once
        }
      );
    }
  };

  // const [videosForApproval, setVideosForApproval] = useState([]);
  const auth = getAuth(app);

  // useEffect(() => {
  //   const user = auth.currentUser;
  //   if (user) {
  //     const youtuberId = user.uid; // Using the user's UID as the youtuberId
  //     const dbRef = ref(getDatabase(app), `users/${youtuberId}/youtubechannels`);
  //     onValue(dbRef, (snapshot) => {
  //       const channelsData = snapshot.val();
  //       const videosList = [];
  //       Object.values(channelsData || {}).forEach(channel => {
  //         Object.values(channel.videos || {}).forEach(video => {
  //           if (video.approvalStatus === "pending") {
  //             videosList.push(video);
  //           }
  //         });
  //       });
  //       setVideosForApproval(videosList);
  //     });
  //   }
  // }, [auth]);

  return (
    <>
      <ToastContainer />
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
                        href={item.href || "#"}
                        onClick={item.onClick}
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
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
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
                        : "text-gray-300 hover:bg-gray-700 hover:text-white font-semibold",
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

              <nav className="flex-1 px-3 py-4 space-y-1">
                <h1 className="text-gray-300 text-[13px] font-bold p-2">
                  Your Channels{" "}
                </h1>
                {channelState.map((channel) => (
                  <a
                    key={channel.id}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigationChannelClick(channel.name);
                    }}
                    className={classNames(
                      channel.current
                        ? "bg-gray-900 text-white font-semibold"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white font-semibold",
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer"
                    )}
                  >
                    <div className="mr-3 flex-shrink-0 h-6 w-6 border border-white-solid rounded-lg text-center justify-center items-center ">
                      <h1 className="text-[13px] text-center justify-center">
                        {channel.name.charAt(0).toUpperCase()}
                      </h1>
                    </div>
                    {channel.name}
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

          <main className="flex-1 bg-black text-white h-screen">
            <div className="py-6 text-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {/* <h1 className="text-2xl font-semibold ">Dashboard</h1> */}
              </div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full h-full">
                <div className=" ">
                  {currentView === "dashboard" && (
                    // <div className=""><Details/></div>
                    <>
                    </>
                  )}
                  {currentView === "settings" && (
                    // <div className=""><Details/></div>
                    
                    <ProfileDashboard/>
                  
                  )}
                  {currentView === "billing" && (
                    // <div className=""><Details/></div>
                    
                    <Billing/>
                  
                  )}
                  {currentView === "editors" && <EditorsList />}
                  {currentView === "channelContent" && selectedChannelId && (
                    <div>
                      <VideoDisplay
                        channelId={selectedChannelId}
                        basePath="youtuber/dashboard"
                      />
                    </div>
                  )}
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

export default YoutuberDashboard;
