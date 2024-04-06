import React, { useState } from "react";
import firebase from "../firebase/firebaseconfig";
import { useLocation } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Switch } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const CheckoutForm = () => {
  const [agreed, setAgreed] = useState(false);
  const location = useLocation();
  const { plan, userId, planType } = location.state;
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    email: "",
    address: {
      line1: "",
      city: "",
      postal_code: "",
      country: "US",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in customerDetails.address) {
      // If the field is part of the address object, update it specifically
      setCustomerDetails({
        ...customerDetails,
        address: {
          ...customerDetails.address,
          [name]: value,
        },
      });
    } else {
      // For top-level fields like name and email
      setCustomerDetails({
        ...customerDetails,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Store customer details in Firebase under the user's ID
    const userRef = firebase.database().ref("users/" + userId);
    await userRef.update({
      customerDetails,
    });

    // Call backend endpoint to initiate the Stripe session
    console.log("Sending plan to backend:", plan);
    console.log(setCustomerDetails);
    fetch("http://localhost:5000/api/v1/create-subscription-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plan: plan, // or simply plan if you've destructured props
        customerId: userId,
        planType: planType,
        customerDetails: customerDetails,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Assuming data contains sessionId
        const sessionId = data.sessionId; // Make sure your backend sends this
        const userRef = firebase.database().ref("users/" + userId);
        userRef
          .update({
            subscription: {
              ...customerDetails.subscription, // Preserve existing subscription details
              sessionId: sessionId, // Store the new sessionId
            },
          })
          .then(() => {
            window.location.href = data.sessionUrl; // Redirect to Stripe Checkout
          })
          .catch((error) => {
            console.error("Error updating user with sessionId:", error);
          });
      });
  };

  return (
    <div className="flex flex-row justify-between overflow-hidden bg-black w-screen h-screen">
      <div className="bg-black py-[10rem] pl-10 max-w-[45rem] justify-start">
        <div className="flex flex-col mb-10 ">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Billing Details
          </h2>
          <p className="mt-2 text-lg text-gray-500 max-w-[30rem]">
            Please provide accurate billing information to ensure successful
            processing of your order."
          </p>
        </div>

        <h3 className="text-2xl font-bold text-white ">
          Why We Need Your Details
        </h3>
        <p className="text-md text-gray-400 mt-3 max-w-[26rem] justify-start">
          As per RBI guidelines and Stripe's policy in India, collecting
          personal details before processing payments ensures a transparent and
          safe transaction by verifying the identity of the customer.
        </p>
      </div>

      <div className="isolate bg-black px-6 md:py-10 sm:py-32 lg:px-8 font-['Gilroy'] border-l-[1px] border-[#2f3849]">
        <div
          className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
          aria-hidden="true"
        >
          <div
            className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        {/* <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Billing Details
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-500 max-w-[30rem]">
          Please provide accurate billing information to ensure successful processing of your order."
          </p>
        </div> */}
        <form
          action="#"
          method="POST"
          className="mx-auto mt-16 md:mt-8 max-w-xl sm:mt-20 overflow-hidden"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 p-2">
            <div>
              <label
                htmlFor="first-name"
                className="block text-sm font-semibold leading-6 text-white"
              >
                First name
              </label>
              <div className="mt-2.5">
                <input
                  type="text"
                  name="name"
                  id="first-name"
                  required
                  autoComplete="given-name"
                  placeholder="your name"
                  onChange={handleChange}
                  className="block w-full bg-black rounded-md border-0 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="last-name"
                className="block text-sm font-semibold leading-6 text-white"
              >
                Last name
              </label>
              <div className="mt-2.5">
                <input
                  type="text"
                  name="last-name"
                  id="last-name"
                  autoComplete="family-name"
                  placeholder="your lastname"
                  className="block w-full rounded-md bg-black  border-0 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold leading-6 text-white"
              >
                Email
              </label>
              <div className="mt-2.5">
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  placeholder="m@mail.com"
                  onChange={handleChange}
                  required
                  className="block w-full bg-black  rounded-md border-0 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            {/* <div className="">
              <label
                htmlFor="country"
                className="block text-sm font-semibold leading-6 text-white"
              >
                Country
              </label>
              <div className="mt-2.5">
                <select
                  name="country"
                  id="country"
                  required
                  onChange={handleChange}
                  className="block w-full bg-black rounded-md border-0 px-3.5 py-3 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="IN">India</option>
                  <option value="FR">France</option>
                  <option value="DE">Germany</option>
                  <option value="JP">Japan</option>
                  <option value="BR">Brazil</option>
                  <option value="ZA">South Africa</option>
                  <option value="CN">China</option>
                  <option value="IT">Italy</option>
                  <option value="ES">Spain</option>
                  <option value="RU">Russia</option>
                  <option value="NL">Netherlands</option>
                  <option value="BR">Brazil</option>
                  <option value="KR">South Korea</option>
                  <option value="MX">Mexico</option>
                  <option value="ID">Indonesia</option>
                  <option value="TR">Turkey</option>
                  <option value="SA">Saudi Arabia</option>
                  <option value="SE">Sweden</option>
                  <option value="NG">Nigeria</option>
                  <option value="PL">Poland</option>
                  <option value="AR">Argentina</option>
                  <option value="NO">Norway</option>
                  <option value="CH">Switzerland</option>
                  <option value="BE">Belgium</option>
                  <option value="TH">Thailand</option>
                  <option value="PH">Philippines</option>
                  <option value="FI">Finland</option>
                  <option value="DK">Denmark</option>
                  <option value="NZ">New Zealand</option>
                  <option value="SG">Singapore</option>
                  <option value="MY">Malaysia</option>
                  <option value="HK">Hong Kong</option>
                  <option value="AE">United Arab Emirates</option>
                  <option value="IE">Ireland</option>
                  <option value="QA">Qatar</option>
                  <option value="IL">Israel</option>
                  <option value="PT">Portugal</option>
                  <option value="VN">Vietnam</option>
                  <option value="GR">Greece</option>
                  <option value="CZ">Czech Republic</option>
                  <option value="RO">Romania</option>
                  <option value="HU">Hungary</option>
                  <option value="PK">Pakistan</option>
                  <option value="EG">Egypt</option>
                </select>
              </div>
            </div> */}
            <div className="sm:col-span-2">
              <label
                htmlFor="company"
                className="block text-sm font-semibold leading-6 text-white"
              >
                Address Line 1
              </label>
              <div className="mt-2.5">
                <input
                  type="text"
                  name="line1"
                  id="address"
                  autoComplete="address"
                  required
                  onChange={handleChange}
                  className="block w-full bg-black  rounded-md border-0 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="first-name"
                className="block text-sm font-semibold leading-6 text-white"
              >
                City
              </label>
              <div className="mt-2.5">
                <input
                  type="text"
                  name="city"
                  id="city"
                  required
                  onChange={handleChange}
                  className="block w-full bg-black  rounded-md border-0 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="last-name"
                className="block text-sm font-semibold leading-6 text-white"
              >
                Postal Code
              </label>
              <div className="mt-2.5">
                <input
                  type="number"
                  name="postal_code"
                  id="postal_code"
                  required
                  onChange={handleChange}
                  className="block w-full bg-black  rounded-md border-0 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <Switch.Group as="div" className="flex gap-x-4 sm:col-span-2">
              <div className="flex h-6 items-center">
                <Switch
                  checked={agreed}
                  onChange={setAgreed}
                  className={classNames(
                    agreed ? "bg-indigo-600" : "bg-gray-200",
                    "flex w-8 flex-none cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  )}
                >
                  <span className="sr-only">Agree to policies</span>
                  <span
                    aria-hidden="true"
                    className={classNames(
                      agreed ? "translate-x-3.5 bg-white" : "translate-x-0",
                      "h-4 w-4 transform rounded-full bg-black shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out"
                    )}
                  />
                </Switch>
              </div>
              <Switch.Label className="text-sm leading-6 text-gray-500">
                By selecting this, you agree to our{" "}
                <a href="#" className="font-semibold text-indigo-600">
                  privacy&nbsp;policy
                </a>
                .
              </Switch.Label>
            </Switch.Group>
          </div>
          <div className="mt-10">
            <button
              type="submit"
              className="block w-full rounded-md bg-[#5E17EB] px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Proceed to Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
