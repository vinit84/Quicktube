import React, { useState } from "react";

import firebase from "../firebase/firebaseconfig";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { ref, get, update } from "firebase/database";
import logo from "../assets/logo.png";
import ChannelSelectionModal from "./ChannelModal";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [channels, setChannels] = useState([]);
  const db = getFirestore();

  const navigate = useNavigate(); //importing from react-router-dom

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      console.log("Please fill all the details");
      return; // Stop the function if the condition is met
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Please enter a valid email address");
      return; // Stop the function if the condition is met
    }
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Fetch the user's role from Firestore
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setEmail(""); // Clear email state
        setPassword(""); // Clear password state

        if (userData.role === "youtuber") {
          navigate("/youtuber"); // Navigate to Youtuber Dashboard
        } else {
          navigate("/"); // Navigate to home or another page for "user" role or default
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Login error", error);
      // Here, you can add more user-friendly error messages or handling, depending on the error type
    }
  };

  const auth = getAuth(); // Ensure you've initialized Firebase Auth

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const { email, displayName } = user; // displayName is the name of the user provided by Google
  
      // Fetch all users to check if the email belongs to any editor
      const usersRef = ref(firebase.database(), "users");
      get(usersRef).then(async (usersSnapshot) => {
        if (usersSnapshot.exists()) {
          let isEditor = false;
          let editorChannels = []; // To store channels where the editor is assigned
  
          // Create a promise array to wait for all editor checks
          const editorChecks = [];
          usersSnapshot.forEach((userSnapshot) => {
            const channelsRef = ref(
              firebase.database(),
              `users/${userSnapshot.key}/youtubechannels`
            );
            const editorCheck = get(channelsRef).then((channelsSnapshot) => {
              if (channelsSnapshot.exists()) {
                channelsSnapshot.forEach((channelSnapshot) => {
                  const editorsSnapshot = channelSnapshot.child("editors");
                  if (editorsSnapshot.exists()) {
                    editorsSnapshot.forEach((editorSnapshot) => {
                      const editorData = editorSnapshot.val();
                      if (editorData.email === email) {
                        if (editorData.status === "Active" || editorData.status === "Pending") {
                          isEditor = true;
                          editorChannels.push({
                            channelId: channelSnapshot.key,
                            channelName: channelSnapshot.val().name, // Assuming channel name is stored directly under the channel ID
                            editorKey: editorSnapshot.key,
                            editorParentKey: userSnapshot.key,
                            editorStatus: editorData.status
                          });
  
                          // If the editor's status is "Pending", update it to "Active" and update the name
                          if (editorData.status === "Pending" || editorData.name !== displayName) {
                            const editorRef = ref(firebase.database(), `users/${userSnapshot.key}/youtubechannels/${channelSnapshot.key}/editors/${editorSnapshot.key}`);
                            update(editorRef, { status: "Active", name: displayName });
                          }
                        }
                      }
                    });
                  }
                });
              }
            });
            editorChecks.push(editorCheck);
          });
  
          // Wait for all editor checks to complete
          await Promise.all(editorChecks);
  
          if (isEditor) {
            if (editorChannels.length > 1) {
              // If the editor is associated with multiple channels, open the channel selection modal
              setChannels(editorChannels); // Assuming setChannels is a state setter for channels
              setIsModalOpen(true); // Assuming setIsModalOpen opens the channel selection modal
            } else {
              // If the editor is associated with only one channel, navigate directly to that channel's dashboard
              navigate(`/editor/dashboard/${editorChannels[0].channelId}`);
            }
          } else {
            // Proceed with the usual sign-in or account creation process for non-editors
            const uid = user.uid;
            const userRef = firebase.database().ref("users/" + uid);
            userRef.once("value", async (snapshot) => {
              if (!snapshot.exists()) {
                await userRef.set({
                  uid,
                  email,
                  username: displayName || "",
                  role: "user",
                  subscriptionStatus: "Inactive",
                });
                navigate("/");
              } else {
                const userData = snapshot.val();
                if (userData.role === "youtuber") {
                  navigate("/youtuber");
                } else {
                  navigate("/");
                }
              }
            });
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <>
      <div className="min-h-full flex flex-col justify-center py-6 sm:px-6 lg:px-8 font-['Gilroy'] bg-black w-screen h-screen">
        <div className="sm:mx-auto sm:w-full sm:max-w-md  border-[#27272a]">
          {/* <img
            className="mx-auto w-[80px] mt-0 cursor-pointer"
            onClick={() => {
              window.location.href = "/";
            }}
            src={logo}
            alt="Workflow"
          /> */}
          <h2 className=" text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
          <div className="mt-3 space-y-2 justify-center flex items-center">
            {/* <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Log in to your account</h3> */}
            <p className="text-white font-medium">
              Don't have an account ? Simply <span className="text-indigo-600"> Sign up </span> On Single Click{" "}
              {/* <a
                href="javascript:void(0)"
                className="font-medium text-indigo-600 hover:text-indigo-500"
                onClick={handleRegister}
              >
                Sign up
              </a> */}
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md text-white  ">
          <div className="bg-black py-10 px-4 shadow sm:rounded-lg sm:px-10 border border-[1px] border-[#27272a] rounded-lg">
            {/* <form
              onSubmit={handleSubmit}
              className="space-y-6 text-white"
              action="#"
              method="POST"
            >
              <div>
                <label htmlFor="email" className="block text-sm font-semibold ">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border  border-[#27272a] bg-black rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold "
                  required
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-[#27272a] bg-black rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-x-3">
                  <input
                    type="checkbox"
                    id="remember-me-checkbox"
                    className="checkbox-item peer hidden"
                  />
                  <label
                    htmlFor="remember-me-checkbox"
                    className="relative flex w-5 h-5 bg-white peer-checked:bg-indigo-600 rounded-md border ring-offset-2 ring-indigo-600 duration-150 peer-active:ring cursor-pointer after:absolute after:inset-x-0 after:top-[3px] after:m-auto after:w-1.5 after:h-2.5 after:border-r-2 after:border-b-2 after:border-white after:rotate-45"
                  ></label>
                  <span>Remember me</span>
                </div>
                <a
                  href="javascript:void(0)"
                  className="text-center text-indigo-600 hover:text-indigo-500 font-semibold "
                >
                  Forgot password ?
                </a>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign in
                </button>
              </div>
            </form> */}

            <div className="mt-6">
              {/* <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black text-white font-medium">
                    Or continue with
                  </span>
                </div>
              </div> */}

              <div className="mt-6  grid-cols-1 gap-5 text-center justify-center items-center flex flex-col mx-auto">
                <p className="text-lg Gilroy-Regular">Sign in or Register using your official Google account, which you want to use to manage all of your YouTube channels.</p>
                <p className="text-lg Gilroy-Regular max-w-[20rem]">Editors can directly login with their invited email id </p>
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-x-3 py-2.5 border rounded-lg text-sm font-medium hover:bg-[#1b1b1b] duration-200 active:bg-gray-100"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_17_40)">
                      <path
                        d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z"
                        fill="#34A853"
                      />
                      <path
                        d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z"
                        fill="#FBBC04"
                      />
                      <path
                        d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z"
                        fill="#EA4335"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_17_40">
                        <rect width="48" height="48" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  Continue with Google
                </button>
                <p className="text-white ">By continuing, you are indicating that you accept our <span className="text-indigo-600 cursor-pointer">Terms of Service</span> and <span className="text-indigo-600 cursor-pointer">Privacy Policy.</span></p>
              </div>
            </div>
          </div>
        </div>
        <ChannelSelectionModal
        isOpen={isModalOpen}
        channels={channels}
        onClose={() => setIsModalOpen(false)}
      />
      </div>
    </>
  );
};

export default Login;
