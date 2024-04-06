import { Fragment, useState } from "react";
import { useEffect } from "react";
import {
  getAuth,
  updateEmail,
  updateProfile,
  sendEmailVerification,
  deleteUser,
} from "firebase/auth";
import { ref, get, getDatabase, update, remove } from "firebase/database";
import DeactivateModal from "./DeactivateModal";
import { useNavigate } from "react-router-dom";
import DomainInfo from "./DomainInfo";

// import { Dialog, Switch, Transition } from "@headlessui/react";
// import {
//   BellIcon,
//   BriefcaseIcon,
//   ChartBarSquareIcon,
//   CogIcon,
//   MagnifyingGlassCircleIcon,
//   HomeIcon,
//   Bars3Icon,
//   QuestionMarkCircleIcon,
//   UsersIcon,
//   XMarkIcon,
// } from "@heroicons/react/24/outline";

// const navigation = [
//   { name: 'Home', href: '#', icon: HomeIcon, current: false },
//   { name: 'Jobs', href: '#', icon: BriefcaseIcon, current: false },
//   { name: 'Applications', href: '#', icon: MagnifyingGlassCircleIcon, current: false },
//   { name: 'Messages', href: '#', icon: ChartBarSquareIcon, current: false },
//   { name: 'Team', href: '#', icon: UsersIcon, current: false },
//   { name: 'Settings', href: '#', icon: CogIcon, current: true },
// ]
// const secondaryNavigation = [
//   { name: 'Help', href: '#', icon: QuestionMarkCircleIcon },
//   { name: 'Logout', href: '#', icon: CogIcon },
// ]
const tabs = [
  { name: "General", href: "#", current: true },
  // { name: 'Password', href: '#', current: false },
  // { name: 'Notifications', href: '#', current: false },
  { name: "Plan", href: "#", current: false },
  // { name: "Billing", href: "#", current: false },
  // { name: 'Team Members', href: '#', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProfileDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("General"); // New state for active tab

  // Function to handle tab click
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const [userDetails, setUserDetails] = useState({ name: "", email: "" });
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailVerificationPending, setEmailVerificationPending] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    const db = getDatabase();
    if (user) {
      const userRef = ref(db, "users/" + user.uid);
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setUserDetails({ name: data.username, email: data.email });
            setEditName(data.username);
            setEditEmail(data.email);
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  const handleUpdateName = async () => {
    if (!isEditingName) {
      setIsEditingName(true);
      return;
    }
    const auth = getAuth();
    const user = auth.currentUser;
    const db = getDatabase();
    if (user) {
      await updateProfile(user, {
        displayName: editName,
      });
      const userRef = ref(db, "users/" + user.uid);
      update(userRef, {
        username: editName,
      })
        .then(() => {
          setUserDetails({ ...userDetails, name: editName });
          setIsEditingName(false);
          console.log("Name updated successfully.");
        })
        .catch((error) => {
          console.error("Error updating name:", error);
        });
    }
  };

  const handleUpdateEmail = async () => {
    if (!isEditingEmail) {
      setIsEditingEmail(true);
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    const db = getDatabase();

    if (user) {
      try {
        // Step 1: Update the email in Firebase Auth
        await updateEmail(user, editEmail);

        // Step 2: Send a verification email to the new address
        await sendEmailVerification(user);

        // Step 3: Update the email in the Firebase Realtime Database
        const userRef = ref(db, "users/" + user.uid);
        await update(userRef, {
          email: editEmail,
        });

        // Step 4: Update local state to reflect the change and indicate verification is pending
        setUserDetails({ ...userDetails, email: editEmail });
        setEmailVerificationPending(true); // Assuming you have logic to handle this state
        setIsEditingEmail(false);

        console.log(
          "Email updated and verification email sent. Please verify the new email address."
        );
      } catch (error) {
        console.error("Error updating email:", error);
        // Handle specific errors, e.g., re-authentication required
      }
    }
  };

  const finalizeEmailUpdate = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const db = getDatabase();

    if (user) {
      await user.reload();
      if (user.emailVerified) {
        const userRef = ref(db, "users/" + user.uid);
        await update(userRef, { email: user.email });
        setUserDetails({ ...userDetails, email: user.email });
        setEmailVerificationPending(false);
        alert("Email updated successfully.");
      } else {
        alert("Please verify your new email address before continuing.");
      }
    }
  };

  const handleDeleteAccount = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const db = getDatabase();

    if (user) {
      try {
        // Remove user data from Firebase Realtime Database first
        const userRef = ref(db, "users/" + user.uid);
        await remove(userRef);

        // Then delete the user from Firebase Authentication
        await deleteUser(user);

        console.log("User account deleted successfully.");
        navigate("/"); // Redirect to the home page
      } catch (error) {
        console.error("Error deleting user account:", error);
        // Handle errors, e.g., show an error message to the user
      }
    }
  };

  return (
    <>
      {/*
        This example requires updating your template:
        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}

      {/* Static sidebar for desktop */}

      {/* Content area */}
      <div>
        <div className="max-w-4xl  mx-auto flex flex-col md:px-8 xl:px-0">
          {/* <div className="sticky top-0 z-10 flex-shrink-0 h-16 bg-white border-b border-gray-200 flex">
              <button
                type="button"
                className="border-r border-gray-200 px-4 text-[#9ca2ae] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white-500 md:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
              <div className="flex-1 flex justify-between px-4 md:px-0">
                <div className="flex-1 flex">
                  <form className="w-full flex md:ml-0" action="#" method="GET">
                    <label htmlFor="mobile-search-field" className="sr-only">
                      Search
                    </label>
                    <label htmlFor="desktop-search-field" className="sr-only">
                      Search
                    </label>
                    <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                        <MagnifyingGlassCircleIcon className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
                      </div>
                      <input
                        name="mobile-search-field"
                        id="mobile-search-field"
                        className="h-full w-full border-transparent py-2 pl-8 pr-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent focus:placeholder-gray-400 sm:hidden"
                        placeholder="Search"
                        type="search"
                      />
                      <input
                        name="desktop-search-field"
                        id="desktop-search-field"
                        className="hidden h-full w-full border-transparent py-2 pl-8 pr-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent focus:placeholder-gray-400 sm:block"
                        placeholder="Search jobs, applicants, and more"
                        type="search"
                      />
                    </div>
                  </form>
                </div>
                <div className="ml-4 flex items-center md:ml-6">
                  <button
                    type="button"
                    className="bg-white rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-[#9ca2ae] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white-500"
                  >
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                    <span className="sr-only">View notifications</span>
                  </button>
                </div>
              </div>
            </div> */}

          <main className="flex-1 bg-black h-screen">
            <div className="relative max-w-4xl mx-auto md:px-8 xl:px-0">
              <div className="pt-10 pb-16">
                <div className="px-10 sm:px-6 md:px-0">
                  <h1 className="text-3xl Gilroy-Bold text-white">Settings</h1>
                </div>
                <div className="px-4 sm:px-6 md:px-0 ">
                  <div className="py-6 ">
                    {/* Tabs */}
                    <div className="lg:hidden ">
                      <label htmlFor="selected-tab" className="sr-only">
                        Select a tab
                      </label>
                      <select
                        id="selected-tab"
                        name="selected-tab"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-[#9ca2ae] border-gray-300 focus:outline-none focus:ring-white-500 focus:border-white-500 sm:text-sm rounded-md"
                        defaultValue={tabs.find((tab) => tab.current).name}
                      >
                        {tabs.map((tab) => (
                          <option key={tab.name}>{tab.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="hidden lg:block">
                      <div className="border-b-[1px] border-[#1f2734] ">
                        <nav className="-mb-px flex space-x-8">
                          {tabs.map((tab) => (
                            <button
                              key={tab.name}
                              onClick={() => handleTabClick(tab.name)}
                              className={classNames(
                                activeTab === tab.name
                                  ? "border-indigo-600 text-indigo-600"
                                  : "border-transparent text-[#9ca2ae] hover:border-gray-300 hover:text-gray-600",
                                "whitespace-nowrap py-4 px-1 border-b-2 Gilroy-SemiBold text-md"
                              )}
                            >
                              {tab.name}
                            </button>
                          ))}
                        </nav>
                      </div>
                    </div>

                    {activeTab === "General" && (
                      <>
                        <div className="mt-10 divide-y divide-[#1f2734] rounded-2xl shadow-sm   p-5    bg-neutral-950 drop-shadow-lg border-[1px] border-[#1f2734] shadow-2 hover:shadow-lg dark:bg-dark-2">
                          <div className="space-y-1">
                            <h3 className="text-lg leading-6  Gilroy-SemiBold text-white">
                              Profile
                            </h3>
                            <p className="max-w-2xl text-sm text-[#9ca2ae]">
                              This information will be not be displayed publicly
                              it will be private to you.
                            </p>
                          </div>
                          <div className="mt-6">
                            <dl className="divide-y divide-[#1f2734]">
                              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                <dt className="text-sm Gilroy-SemiBold text-white">
                                  Name
                                </dt>
                                <dd className="mt-1 flex text-sm Gilroy-Medium text-[#9ca2ae] sm:mt-0 sm:col-span-2">
                                  {isEditingName ? (
                                    <input
                                      type="email"
                                      value={editName}
                                      onChange={(e) =>
                                        setEditName(e.target.value)
                                      }
                                      className="flex-grow border-2 text-white bg-neutral-950 shadow-sm  border-gray-300 rounded-md p-[0.2rem]"
                                    />
                                  ) : (
                                    <span className="flex-grow">
                                      {userDetails.name}
                                    </span>
                                  )}
                                  <span className="ml-4 flex-shrink-0">
                                    <button
                                      type="button"
                                      onClick={handleUpdateName}
                                      className="bg-indigo-600 hover:bg-indigo-700 rounded-md p-2 px-3 Gilroy-SemiBold text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white-500"
                                    >
                                      {isEditingName ? "Save" : "Update"}
                                    </button>
                                    {isEditingName && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setIsEditingName(false);
                                          setEditName(userDetails.name);
                                        }}
                                        className="ml-2 bg-gray-600 hover:bg-gray-700 rounded-md p-2 px-3 Gilroy-SemiBold text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                      >
                                        Cancel
                                      </button>
                                    )}
                                  </span>
                                </dd>
                              </div>
                              {/* <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:pt-5">
                            <dt className="text-sm Gilroy-Medium text-white">Photo</dt>
                            <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <span className="flex-grow">
                                <img
                                  className="h-8 w-8 rounded-full"
                                  src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                  alt=""
                                />
                              </span>
                              <span className="ml-4 flex-shrink-0 flex items-start space-x-4">
                                <button
                                  type="button"
                                  className="bg-white rounded-md Gilroy-Medium text-white-600 hover:text-white-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white-500"
                                >
                                  Update
                                </button>
                                <span className="text-gray-300" aria-hidden="true">
                                  |
                                </span>
                                <button
                                  type="button"
                                  className="bg-white rounded-md Gilroy-Medium text-white-600 hover:text-white-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white-500"
                                >
                                  Remove
                                </button>
                              </span>
                            </dd>
                          </div> */}
                              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:pt-5">
                                <dt className="text-sm Gilroy-SemiBold text-white">
                                  Email
                                </dt>
                                <dd className="mt-1 flex flex-col sm:flex-row text-sm text-[#9ca2ae] Gilroy-Medium sm:mt-0 sm:col-span-2">
                                  {isEditingEmail ? (
                                    <input
                                      type="email"
                                      value={editEmail}
                                      onChange={(e) =>
                                        setEditEmail(e.target.value)
                                      }
                                      className="flex-grow border-2 border-gray-200 rounded-md p-2"
                                    />
                                  ) : (
                                    <span className="flex-grow">
                                      {userDetails.email}
                                    </span>
                                  )}
                                  <span className="ml-4 flex-shrink-0">
                                    <button
                                      type="button"
                                      onClick={handleUpdateEmail}
                                      className="bg-indigo-600 hover:bg-indigo-700 rounded-md p-2 px-3 Gilroy-SemiBold text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white-500"
                                    >
                                      {isEditingEmail ? "Save" : "Update"}
                                    </button>
                                    {isEditingEmail && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setIsEditingEmail(false);
                                          setEditEmail(userDetails.email);
                                        }}
                                        className="ml-2 bg-gray-600 hover:bg-gray-700 rounded-md p-2 px-3 Gilroy-SemiBold text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                      >
                                        Cancel
                                      </button>
                                    )}
                                  </span>
                                  {emailVerificationPending && (
                                    <div className="mt-4 sm:mt-0 sm:ml-4 flex-grow sm:flex sm:flex-col">
                                      <p className="text-sm text-yellow-500">
                                        Your email update is pending
                                        verification. Please check your inbox
                                        and verify your new email address.
                                      </p>
                                      <button
                                        onClick={finalizeEmailUpdate}
                                        className="mt-2 sm:mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                      >
                                        I've Verified My Email
                                      </button>
                                    </div>
                                  )}
                                </dd>
                              </div>
                              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:pt-5">
                                <div className="max-w-[15rem] flex flex-col  gap-3">
                                  <dt className="text-sm Gilroy-SemiBold text-white">
                                    Whatsapp
                                  </dt>
                                  <span className=" text-sm text-gray-500">
                                    Please provide a WhatsApp number where you
                                    would like to receive all updates related to
                                    the video from the editors.
                                  </span>
                                </div>

                                <dd className="mt-1 flex text-sm text-[#9ca2ae] Gilroy-SemiBold sm:mt-0 sm:col-span-2">
                                  <span className="flex-grow">
                                    +91 9082685211
                                  </span>
                                  <span className="ml-4 flex-shrink-0">
                                    <button
                                      type="button"
                                      className="bg-indigo-600 rounded-md p-2 px-3 Gilroy-SemiBold text-white hover:text-white-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white-500"
                                    >
                                      Update
                                    </button>
                                  </span>
                                </dd>
                              </div>

                              {/* <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-b sm:border-gray-200">
                            <dt className="text-sm Gilroy-Medium text-[#9ca2ae]">Job title</dt>
                            <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <span className="flex-grow">Human Resources Manager</span>
                              <span className="ml-4 flex-shrink-0">
                                <button
                                  type="button"
                                  className="bg-white rounded-md Gilroy-Medium text-white-600 hover:text-white-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white-500"
                                >
                                  Update
                                </button>
                              </span>
                            </dd>
                          </div> */}
                            </dl>
                          </div>
                        </div>
                        <div className="rounded-2xl mt-5 shadow-sm p-5   bg-neutral-950 drop-shadow-lg border-[1px] border-[#1f2734] shadow-2 hover:shadow-lg dark:bg-dark-2">
                          <div className="gap-y-5 flex flex-col ">
                            <p className="text-lg pb-5 Gilroy-SemiBold mb-2 border-b-[1px] border-[#1f2734] flex items-center gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-indigo-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                              Account
                            </p>
                            <div className="  flex flex-row justify-between items-center">
                              <div className="max-w-xl">
                                <h3 className="text-md Gilroy-Medium mb-2">
                                  Delete account
                                </h3>
                                <p className="text-sm text-gray-500 mb-4">
                                  Keep in mind that upon deleting your account
                                  all of your account information will be
                                  deleted without the possibility of
                                  restoration.
                                </p>
                              </div>
                              <div>
                                <button
                                  onClick={() => setShowDeleteModal(true)}
                                  className="bg-red-600 hover:bg-red-700 Gilroy-SemiBold text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-80"
                                >
                                  Delete account
                                </button>
                                {showDeleteModal && (
                                  <DeactivateModal
                                    open={showDeleteModal}
                                    setOpen={setShowDeleteModal}
                                    onConfirm={handleDeleteAccount} // Pass the delete function as a prop
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    {activeTab === "Plan" && (
                      <div>
                        {/* Plan tab content */}
                       <DomainInfo/>
                      </div>
                    )}
                    {activeTab === "Billing" && (
                      <div>
                        {/* Billing tab content */}
                        <p>Billing Information...</p>
                      </div>
                    )}

                    {/* Description list with inline editing */}

                    {/* <div className="mt-10 divide-y divide-gray-200">
                        <div className="space-y-1">
                          <h3 className="text-lg leading-6 Gilroy-Medium text-gray-900">Account</h3>
                          <p className="max-w-2xl text-sm text-[#9ca2ae]">
                            Manage how information is displayed on your account.
                          </p>
                        </div>
                        <div className="mt-6">
                          <dl className="divide-y divide-gray-200">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                              <dt className="text-sm Gilroy-Medium text-[#9ca2ae]">Language</dt>
                              <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <span className="flex-grow">English</span>
                                <span className="ml-4 flex-shrink-0">
                                  <button
                                    type="button"
                                    className="bg-white rounded-md Gilroy-Medium text-white-600 hover:text-white-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white-500"
                                  >
                                    Update
                                  </button>
                                </span>
                              </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:pt-5">
                              <dt className="text-sm Gilroy-Medium text-[#9ca2ae]">Date format</dt>
                              <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <span className="flex-grow">DD-MM-YYYY</span>
                                <span className="ml-4 flex-shrink-0 flex items-start space-x-4">
                                  <button
                                    type="button"
                                    className="bg-white rounded-md Gilroy-Medium text-white-600 hover:text-white-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white-500"
                                  >
                                    Update
                                  </button>
                                  <span className="text-gray-300" aria-hidden="true">
                                    |
                                  </span>
                                  <button
                                    type="button"
                                    className="bg-white rounded-md Gilroy-Medium text-white-600 hover:text-white-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white-500"
                                  >
                                    Remove
                                  </button>
                                </span>
                              </dd>
                            </div>
                            <Switch.Group as="div" className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:pt-5">
                              <Switch.Label as="dt" className="text-sm Gilroy-Medium text-[#9ca2ae]" passive>
                                Automatic timezone
                              </Switch.Label>
                              <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <Switch
                                  checked={automaticTimezoneEnabled}
                                  onChange={setAutomaticTimezoneEnabled}
                                  className={classNames(
                                    automaticTimezoneEnabled ? 'bg-white-600' : 'bg-gray-200',
                                    'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white-500 sm:ml-auto'
                                  )}
                                >
                                  <span
                                    aria-hidden="true"
                                    className={classNames(
                                      automaticTimezoneEnabled ? 'translate-x-5' : 'translate-x-0',
                                      'inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                                    )}
                                  />
                                </Switch>
                              </dd>
                            </Switch.Group>
                            <Switch.Group
                              as="div"
                              className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-b sm:border-gray-200"
                            >
                              <Switch.Label as="dt" className="text-sm Gilroy-Medium text-[#9ca2ae]" passive>
                                Auto-update applicant data
                              </Switch.Label>
                              <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <Switch
                                  checked={autoUpdateApplicantDataEnabled}
                                  onChange={setAutoUpdateApplicantDataEnabled}
                                  className={classNames(
                                    autoUpdateApplicantDataEnabled ? 'bg-white-600' : 'bg-gray-200',
                                    'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white-500 sm:ml-auto'
                                  )}
                                >
                                  <span
                                    aria-hidden="true"
                                    className={classNames(
                                      autoUpdateApplicantDataEnabled ? 'translate-x-5' : 'translate-x-0',
                                      'inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                                    )}
                                  />
                                </Switch>
                              </dd>
                            </Switch.Group>
                          </dl>
                        </div>
                      </div> */}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
