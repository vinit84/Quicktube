import React from "react";
import payment from "../assets/payment.png";
import firebase from "../firebase/firebaseconfig";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HoverBorderGradient from "./UI/HoverBorderGradient";
import BackgroundBeams from "./UI/backgroundBeams";

const Success = () => {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid); // Ensure this is correctly setting the userId
        const userRef = firebase.database().ref("users/" + user.uid);
        userRef.on("value", (snapshot) => {
          const userData = snapshot.val();
          if (
            userData &&
            userData.subscription &&
            userData.subscription.sessionId
          ) {
            setSessionId(userData.subscription.sessionId);
          }
        });
      } else {
        setUserId(""); // Reset userId if no user is logged in
      }
    });
  }, []);

  console.log("Current userId:", userId);

  //Successful payment api creation.
  const handlePaymentSuccess = () => {
    if (!userId) {
      console.error("No userId found");
      return; // Exit the function if userId is not set
    }

    fetch("http://localhost:5000/api/v1/payment-success", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId: sessionId,
        firebaseId: userId,
      }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        return res.json().then((json) => Promise.reject(json));
      })
      .then((data) => {
        // User role update logic
        const userRef = firebase.database().ref("users/" + userId);
        userRef
          .update({
            role: "youtuber",
            subscriptionStatus: "active",
          })
          .then(() => {
            console.log("User role updated to youtuber");
            navigate("/youtuber");
          })
          .catch((error) => {
            console.error("Error updating user role:", error);
          });
      })
      .catch((error) => {
        console.error("Error in payment success:", error);
      });
  };

  return (
    <div className="w-full bg-black  h-screen flex flex-col  pt-40 ">
      <div className="max-w-4xl mx-auto p-4 justify-center items-center flex flex-col">
        <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-indigo-600  text-center Gilroy-Bold">
          Payment Successfull
        </h1>
        <p></p>
        <p className="text-neutral-500 max-w-lg mx-auto my-2 text-md text-center relative z-10">
        Thank you for choosing QuickTube! Let's grow together and enhance your YouTube journey. We're here to make your experience even better.
        </p>
        <button
          onClick={() => handlePaymentSuccess()} //
          className="mt-5"
        >
          <HoverBorderGradient>
            <span className="flex text-lg Gilroy-Medium">
              Proceed to Workspace
            </span>
          </HoverBorderGradient>
        </button>
      </div>
      <BackgroundBeams/>
    </div>
  );
};

export default Success;
