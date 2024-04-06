import { CheckCircleIcon,XCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import firebase from "../firebase/firebaseconfig";
import BackgroundBeams from "./UI/backgroundBeams";

const tiers = [
  // Basic Plan
  {
    name: "Basic",
    href: "#",
    priceMonthly: 249,
    priceYearly: 1988, // Assuming 2 months free on yearly plan
    description: "A plan that scales with your rapidly growing youtube.",
    includedFeatures: [
      "Upto 2 Channels",
      "Upto 2 Editors",
      "Upto 50 Videos",
      "Normal Analytics",
      "24-hour support response time",
    ],
    ExcludedFeatures: [
     "No Multiple Editors for Single Channel",
     "No Priority Support",
     "No Custom Integration",
    ],
  },
 
  {
    name: "Standard",
    href: "#",
    priceMonthly: 349,
    priceYearly: 3188, // Assuming 2 months free on yearly plan
    description: "A plan that scales with your rapidly growing youtube.",
    includedFeatures: [
      "Upto 10 Channels",
      "Upto 10 Editors",
      "Upto 150 Videos",
      "Advance Analytics",
      "1-hour support response time",
      "Priority support",
    ],
    ExcludedFeatures: [
      "No Multiple Editors for Single Channel",
      "No Custom Integration",
     ],
  },
  // Enterprise Plan
  {
    name: "Premium",
    href: "#",
    priceMonthly: 599,
    priceYearly: 6188, // Assuming 2 months free on yearly plan
    description: "A plan for youtubers with advanced requirements.",
    includedFeatures: [
      "Unlimited Channels",
      "Unlimited Editors",
      "Unlimited Videos",
      "Advance Analytics",
      "30-minute support response time",
      "Priority support",
      "Dedicated account manager",
      "Custom integrations",
    ],
    ExcludedFeatures: [
   
     ],
  },
];

export default function Pricing() {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [planType, setPlanType] = useState("");

  useEffect(() => {
    // Inbuilt function to check if user is logged in or not
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid); // setting userID and userName if user is present
        setUserName(user.displayName);

        const userRef = firebase.database().ref("users/" + user.uid);
        userRef.on("value", (snapshot) => {
          const userVal = snapshot.val();
          if (userVal) {
            // Use optional chaining and nullish coalescing to avoid errors
            const planType = userVal.subscription?.planType ?? "";
            setPlanType(planType);
          }
        });
      } else {
        // setting userID and userName if user is not present
        setUserId("");
        setUserName("");
        setPlanType(""); // Ensure planType is reset when there is no user
      }
    });
  }, [userId]);

  

  const navigate = useNavigate();

  const [isYearlyBilling, setIsYearlyBilling] = useState(false);
  const toggleBilling = () => setIsYearlyBilling(!isYearlyBilling);

  return (
    <div className="bg-black dark:bg-gray-800 font-['Gilroy']  z-10">
      <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center md:items-center">
          <h1 className="text-5xl font-extrabold text-white dark:text-white sm:text-center">
            Pricing plans for teams of all sizes
          </h1>
          <p className="mt-5 text-xl text-[#e5e7eb] dark:text-gray-300 sm:text-center max-w-[45rem]">
            Choose an affordable plan that’s packed with the best features for
            engaging your audience and managing your youtube channels efficiently.
          </p>
          <div className="relative self-center mt-6  dark:bg-gray-700  p-1 flex sm:mt-8 rounded-full text-sm bg-neutral-950 drop-shadow-lg border-[1px] border-[#1f2734] shadow-2 hover:shadow-lg dark:bg-dark-2 z-10" >
            <button
              type="button"
              className={`relative  w-[5px] rounded-full shadow-sm py-1 md:px-5 text-[13px] Gilroy-SemiBold bg-[#5E17EB]  sm:w-auto sm:px-8 ${
                isYearlyBilling
                  ? "bg-transparent text-white dark:text-gray-300"
                  : "bg-[#5E17EB] dark:bg-gray-800 text-white dark:text-white"
              }`}
              onClick={toggleBilling}
            >
              Monthly
            </button>
            <button
              type="button"
              className={`ml-0.5  relative w-[5px] rounded-full py-1 md:px-5 text-[13px]  Gilroy-SemiBold sm:w-auto sm:px-8  ${
                isYearlyBilling
                  ? "bg-[#5E17EB] dark:bg-gray-800 text-white dark:text-white"
                  : "bg-transparent text-white dark:text-gray-300"
              }`}
              onClick={toggleBilling}
            >
              Yearly
            </button>
          </div>
        </div>
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3 ">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="  rounded-3xl shadow-sm   p-5 Gilroy-SemiBold   bg-neutral-950 drop-shadow-lg border-[1px] border-[#1f2734] shadow-2 hover:shadow-lg dark:bg-dark-2"
            >
              <div className="p-6">
                <h2 className="text-xl leading-6 text-white dark:text-white Gilroy-SemiBold">
                  {tier.name}
                </h2>
                <p className="mt-4 text-sm text-[#b1b8c0] dark:text-gray-300">
                  {tier.description}
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-white dark:text-white">
                    ₹{isYearlyBilling ? tier.priceYearly : tier.priceMonthly}
                  </span>{" "}
                  <span className="text-base font-medium text-[#e5e7eb] dark:text-gray-300">
                    /{isYearlyBilling ? "yr" : "mo"}
                  </span>
                </p>
                <a
                  onClick={() => {
                    if (userId) {
                      navigate("/checkout", {
                        state: {
                          plan: isYearlyBilling ? tier.priceYearly : tier.priceMonthly,
                          planType: isYearlyBilling ? "yearly" : "monthly",
                          userId,
                        },
                      });
                    } else {
                      navigate("/login");
                    }
                  }}
                  className="mt-8 block cursor-pointer w-full bg-[#5E17EB] dark:bg-gray-900 border border-gray-800 dark:border-gray-900 rounded-[10px] py-2 text-md Gilroy-SemiBold text-white hover:text-gray-300 text-center hover:bg-indigo-800 transition duration-300 ease-in-out"
                >
                  Buy {tier.name}
                </a>
              </div>
              <div className="pt-1 pb-8 px-6">
                {/* <h3 className="text-xs font-medium text-gray-900 dark:text-white tracking-wide uppercase">
                  What's included
                </h3> */}
                <ul role="list" className="mt-6 space-y-4">
                  {tier.includedFeatures.map((feature) => (
                    <li key={feature} className="flex space-x-3">
                      <CheckCircleIcon
                        className="flex-shrink-0 h-5 w-5 text-[#b1b8c0]"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-[#b1b8c0]">{feature}</span>
                    </li>
                  ))}
                  {tier.ExcludedFeatures.map((feature) => (
                    <li key={feature} className="flex space-x-3">
                      <XCircleIcon
                        className="flex-shrink-0 opacity-50 h-5 w-5 text-[#b1b8c0]"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-[#b1b8c0] opacity-50 line-through">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BackgroundBeams/>
    </div>
  );
}
