import React, { useEffect, useState } from "react";
import firebase from "../firebase/firebaseconfig"; // Adjust the path as necessary

import { CheckCircleIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { ArrowPathRoundedSquareIcon } from "@heroicons/react/24/outline";

const DomainInfo = () => {
  const [planType, setPlanType] = useState("");
  const [planId, setPlanId] = useState("");
  const [planPrice, setPlanPrice] = useState("");
  const [planEndDate, setPlanEndDate] = useState("");
  const [planDuration, setPlanDuration] = useState("");

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      const userRef = firebase
        .database()
        .ref("users/" + user.uid + "/subscription");
      userRef.on("value", (snapshot) => {
        const subscription = snapshot.val();
        if (subscription) {
          setPlanType(subscription.planType);
          setPlanId(subscription.planId);
          setPlanPrice(subscription.planPrice);
          setPlanEndDate(subscription.planEndDate);
          setPlanDuration(subscription.planDuration);
        }
      });
    }
  }, []);

  const planFeatures = {
    basic: [
      "Upto 2 Channels",
      "Upto 2 Editors",
      "Upto 50 Videos",
      "Normal Analytics",
      "24-hour support response time",
    ],
    standard: [
      "Upto 10 Channels",
      "Upto 10 Editors",
      "Upto 150 Videos",
      "Advance Analytics",
      "1-hour support response time",
      "Priority support",
    ],
    premium: [
      "Unlimited Channels",
      "Unlimited Editors",
      "Unlimited Videos",
      "Advance Analytics",
      "30-minute support response time",
      "Priority support",
      "Dedicated account manager",
      "Custom integrations",
    ],
  };

  // Function to split the basic array into chunks of 5
  const chunkArray = (arr, size) =>
    arr.length > size
      ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)]
      : [arr];

  // Dynamically select features based on planType
  const currentFeatures = planFeatures[planType] || [];
  const featuresInColumns = chunkArray(currentFeatures, 3);

  return (
    <div className=" rounded-2xl shadow-sm mt-10    p-5  bg-neutral-950 drop-shadow-lg border-[1px] border-[#1f2734] shadow-2 hover:shadow-lg dark:bg-dark-2">
      <div className="flex-1 mb-2 border-b-[1px] border-[#1f2734] pb-5">
        <h2 className="text-lg Gilroy-SemiBold mb-2  text-white">
          {planType.charAt(0).toUpperCase() + planType.slice(1)} Plan
        </h2>
        <div className="flex flex-col  gap-1">
          <p className="text-sm text-gray-400">
            {planDuration === 30
              ? "1 Month"
              : planDuration === 365
              ? "1 Year"
              : `${planDuration} Days`}
          </p>
          <p className="text-sm text-gray-400">ID : {planId.slice(6)}</p>
        </div>
        <div className="mt-5 flex md:flex-row flex-col gap-5  justify-between md:items-center">
          <span className=" text-green-500 text-sm  Gilroy-SemiBold flex flex-row md:justify-center items-center  mr-2 py-0.5 rounded">
            <div className="w-6 mr-2">
              <ArrowPathRoundedSquareIcon />
            </div>
            Auto-renewal on
          </span>
          <div className="md:mr-4  ">
            <div className="flex md:flex-col flex-row justify-between">
              <p className="md:text-md text-sm  Gilroy-Regular text-gray-400">
                Expiration date
              </p>
              <p className="Gilroy-Medium text-white md:text-md text-sm">
                {planEndDate}
              </p>
            </div>
          </div>
          <div className="flex md:flex-col flex-row justify-between">
            <p className="md:text-md text-sm Gilroy-Regular text-gray-400">
              Renewal price
            </p>
            <p className="Gilroy-Medium md:text-md text-sm text-white">
              ₹ {planPrice}
            </p>
          </div>
          <div className="md:ml-4 flex flex-col md:flex-row justify-center items-center">
            <div className="mt-4 md:mt-0 md:ml-auto">
              <button className="bg-indigo-600 Gilroy-SemiBold text-white py-2 md:px-4 px-10 rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center">
                Upgrade
                {/* <div className="w-4 ml-2 ">
                  <ChevronRightIcon />
                </div> */}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 mt-5">
        {featuresInColumns.map((column, columnIndex) => (
          <div key={columnIndex}>
            {column.map((feature, featureIndex) => (
              <div key={featureIndex} className="flex space-x-3">
                <CheckCircleIcon
                  className="flex-shrink-0 h-5 w-5 text-[#b1b8c0]"
                  aria-hidden="true"
                />
                <span className="text-sm text-[#b1b8c0]">{feature}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DomainInfo;
