import React, { useEffect, useState } from "react";
import firebase from "../firebase/firebaseconfig";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation

function Navbar() {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [planType, setPlanType] = useState("");
  const [userRole, setUserRole] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState("");

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        setUserName(user.displayName);

        const userRef = firebase.database().ref("users/" + user.uid);
        userRef.on("value", (snapshot) => {
          const userVal = snapshot.val();
          if (userVal) {
            // Directly access subscriptionStatus under the user's ID
            const status = userVal.subscriptionStatus ?? "";
            setSubscriptionStatus(status); // Use setSubscriptionStatus to update the state
            setUserRole(userVal.role || ""); // Set user role
          }
        });
      } else {
        setUserId("");
        setUserName("");
        setSubscriptionStatus(""); // Reset subscriptionStatus when there is no user
      }
    });
  }, [userId]);

  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage =
    location.pathname === "/login" || location.pathname === "/success";

  return (
    <div>
      <nav
        className={`navbar ${
          isLoginPage ? "justify-center" : "justify-around"
        } flex border-b-[0.5px] w-screen border-gray-800 items-center px-4 sm:px-8 md:px-20 py-4 sm:py-6 bg-black text-white Gilroy-Medium`}
      >
        <div
          className={`navbar ${
            isLoginPage ? "pr-0" : "pr-16"
          } Gilroy-Bold text-2xl mb-[0.5rem] cursor-pointer z-10`}
          onClick={() => navigate("/")}
        >
          <span>
            Quick<span className="text-[#5E17EB]">Tube</span>
          </span>
        </div>
        {!isLoginPage && (
          <>
            <div className="flex flex-wrap mx-auto justify-center z-10">
              <ul className="flex flex-row gap-x-5">
                <li className="sm:mr-6">
                  <a className="nav-link" href="#product">
                    Product
                  </a>
                </li>
                <li className="sm:mr-6 ">
                  <a className="nav-link" href="/contact">
                    Contact
                  </a>
                </li>
                <li className="sm:mr-6 ">
                  <a className="nav-link" href="/pricing">
                    Pricing
                  </a>
                </li>
                <li>
                  <a className="nav-link" href="#whatsnew">
                    What's New
                  </a>
                </li>
              </ul>
            </div>
            {!userId ? (
              <div className="navbar-right flex items-center justify-end z-10">
                <button
                  className="mr-2 sm:mr-5 text-white nav-link"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
                <button
                  className="started bg-[#5E17EB] hover:bg-indigo-800 text-white h-8 sm:h-10 w-20 sm:w-24 md:w-28 rounded-[10px] ml-2 sm:ml-3 Gilroy-Medium transition duration-300 ease-in-out"
                  onClick={() => navigate("/login")}
                >
                  Get Started
                </button>
              </div>
            ) : subscriptionStatus === "active" ? (
              <div className="navbar-right flex items-center justify-end z-10">
                <button
                  className=" bg-[#5E17EB] hover:bg-indigo-800 text-white h-8 sm:h-10 w-28 sm:w-32 md:w-36 rounded-[10px] ml-2 sm:ml-3 Gilroy-Medium transition duration-300 ease-in-out"
                  onClick={() =>
                    navigate(userRole === "youtuber" ? "/youtuber" : "/editor")
                  }
                >
                  Workspace
                </button>
                <button
                  className="nav-link  text-white ml-3 sm:ml-5"
                  onClick={() => firebase.auth().signOut()}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="navbar-right flex items-center justify-end z-10">
                <button
                  className="mr-2 sm:mr-5 text-white nav-link"
                  onClick={() => navigate("/pricing")}
                >
                  Upgrade
                </button>
                <button
                  className="started bg-[#5E17EB] hover:bg-indigo-800 text-white h-8 sm:h-10 w-20 sm:w-24 md:w-28 rounded-[10px] ml-2 sm:ml-3 Gilroy-Medium transition duration-300 ease-in-out"
                  onClick={() => firebase.auth().signOut()}
                >
                  Logout
                </button>
              </div>
            )}
          </>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
