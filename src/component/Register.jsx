import React from "react";

import firebase from "../firebase/firebaseconfig";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import logo from "../assets/logo.png"
// import '../index.css'

const Register = () => {
  const [fullname, setFullname] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const navigate = useNavigate(); //importing from react-router-dom

  const handleSubmit = async (e) => {
    e.preventDefault(); //The absence of this may cause page reload without any result in console

    try {
      if (!fullname || !email || !password) {
        console.log("please fill all the details");
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //Email validation
      if (!emailRegex.test(email)) {
        console.log("Please enter a valid email address");
        return;
      }
      const response = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password); //INbuilt function to create a user with email and password

      if (response.user) {
        //If the user is created successfully then update the display name
        await response.user.updateProfile({
          displayName: fullname,
        });
        const uid = response.user.uid; // Unique id's for each user
        //storing user info in realtime database

        const userRef = firebase.database().ref("users/" + uid); //Giving the reference of database and passing it in userRef
        await userRef.set({
          uid: uid,
          email: email,
          username: fullname,
        }); //storing user info in realtime database and passing it in userRef and to know what plan the  specific user has chosen

        //Emptying the useState variables
        setFullname("");
        setEmail("");
        setPassword("");

        await navigate("/login"); //After registering user is navigated to login page
      }
    } catch (error) {
      console.log("Register error", error);
    }

    //Using try catch to handle error
  };

  const auth = getAuth(); // Ensure you've initialized Firebase Auth

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;

      // Extract UID and email from the signed-in user info
      const { uid, email } = user;

      // Store the UID and email in the Realtime Database under 'users' node
      const userRef = firebase.database().ref("users/" + uid);
      await userRef.set({
        uid,
        email,
        // You might not have a username equivalent for Google sign-in, but you can use displayName if available
        username: user.displayName || "",
        role: "user",
        subscriptionStatus: "Inactive",
      });

      // Navigate to home or dashboard page after successful login
      navigate("/");
    } catch (error) {
      console.error(error);
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // TODO: Show error message to user
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <div className="min-h-full flex flex-col justify-center  py-6 sm:px-6 lg:px-8 font-['Gilroy'] bg-[#09090b] w-screen h-screen">
        <div className="sm:mx-auto sm:w-full sm:max-w-md border-[#27272a]">
          
        <img
            className="mx-auto w-[80px] mt-0 cursor-pointer"
            onClick={() => {
              window.location.href = "/";
            }}
            src={logo}
            alt="Workflow"
          />
          <h2 className="mt-3 text-center text-3xl font-extrabold  text-white">
            Create an account
          </h2>
          <div className="mt-3 space-y-2 justify-center flex items-center">
            {/* <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Log in to your account</h3> */}
            <p className="text-white font-medium">
              Already have an account ?{" "}
              <a
                href="javascript:void(0)"
                className="font-medium text-indigo-600 hover:text-indigo-500"
                onClick={handleLogin}
              >
                Sign in
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md text-white">
          <div className="bg-[#09090b] py-10 px-4 shadow sm:rounded-lg sm:px-10 border border-[1px] border-[#27272a] rounded-lg">
            <form
              onSubmit={handleSubmit}
              className="space-y-6 text-white"
              action="#"
              method="POST"
            >
              {/* <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold "
                >
                  Name
                </label>
                <div className="mt-1">
                  <input
                    id="fullname"
                    name="fullname"
                    type="text"
                    autoComplete="off"
                    required
                    placeholder="Your name"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border  border-[#27272a] bg-[#09090b] rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div> */}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold "
                >
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
                    className="appearance-none block w-full px-3 py-2 border  border-[#27272a] bg-[#09090b] rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                    className="appearance-none block w-full px-3 py-2 border  border-[#27272a] bg-[#09090b] rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
      
                <div className="flex items-center gap-x-3">
                  <input
                    type="checkbox"
                    id="terms&condition-checkbox"
                    className="checkbox-item peer hidden"
                  />
                  <label
                    htmlFor="terms&condition-checkbox"
                    className="relative flex w-5 h-5 bg-white peer-checked:bg-indigo-600 rounded-md border ring-offset-2 ring-indigo-600 duration-150 peer-active:ring cursor-pointer after:absolute after:inset-x-0 after:top-[3px] after:m-auto after:w-1.5 after:h-2.5 after:border-r-2 after:border-b-2 after:border-white after:rotate-45"
                  ></label>
                  <span>
                    I agree to the{" "}
                    <span className="text-indigo-600">terms & conditions</span>
                  </span>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign up
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#09090b] text-white font-medium">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-x-3 py-2.5 border rounded-lg text-sm font-medium hover:bg-[#222222] duration-200 active:bg-gray-100"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
