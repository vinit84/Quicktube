import { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { ref, get, getDatabase } from "firebase/database";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

const tabs = [
  { name: "Paid History", href: "#", current: true },
  // { name: 'Password', href: '#', current: false },
  // { name: 'Notifications', href: '#', current: false },
  { name: "Refund History", href: "#", current: false },
//   { name: "Billing", href: "#", current: false },
  // { name: 'Team Members', href: '#', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Billing() {
  const navigate = useNavigate();

// Inside
 
  const [activeTab, setActiveTab] = useState("Paid History");

  // Initialize states for fetched data
  const [paymentId, setPaymentId] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [planType, setPlanType] = useState("");
  const [planStartDate, setPlanStartDate] = useState("");
  const [planPrice, setPlanPrice] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    const db = getDatabase();
    if (user) {
      const userRef = ref(db, `users/${user.uid}/subscription`);
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setPaymentId(data.paymentId || "");
          setInvoiceId(data.invoiceId || "");
          setPlanType(data.planType || "");
          setPlanStartDate(data.planStartDate || "");
          setPlanPrice(data.planPrice || "");
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
    }
  }, []);

  // Function to handle tab click
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

 

  return (
    <>

      <div>
        <div className="max-w-4xl  mx-auto flex flex-col md:px-8 xl:px-0">
         
          <main className="flex-1 bg-black h-screen">
            <div className="relative max-w-4xl mx-auto md:px-8 xl:px-0">
              <div className="pt-10 pb-16">
                <div className="px-10 sm:px-6 md:px-0">
                  <h1 className="text-3xl Gilroy-Bold text-white">Billing</h1>
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

                    {activeTab === "Paid History" && (
                    <>
                    <div  className="rounded-2xl shadow-sm mt-5   p-5   bg-neutral-950 drop-shadow-lg border-[1px] border-[#1f2734] shadow-2 hover:shadow-lg dark:bg-dark-2">
                      <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-col gap-2">
                          <p className="Gilroy-SemiBold text-sm text-gray-400">Payment ID</p>
                          <p  className="Gilroy-Medium text-sm">{paymentId.slice(3)}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <p className="Gilroy-SemiBold text-sm text-gray-400">Invoice ID</p>
                          <p  className="Gilroy-Medium text-sm">{invoiceId.slice(3)}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <p className="Gilroy-SemiBold text-sm text-gray-400">Subscription Plan</p>
                          <p  className="Gilroy-Medium text-sm"> {planType.charAt(0).toUpperCase() + planType.slice(1)} Plan</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <p className="Gilroy-SemiBold text-sm text-gray-400">Paid At</p>
                          <p  className="Gilroy-Medium text-sm">{planStartDate}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <p className="Gilroy-SemiBold text-sm text-gray-400">Amount</p>
                          <p  className="Gilroy-Medium text-sm">₹ {planPrice}</p>
                        </div>
                        <div className="text-white w-5 cursor-pointer" onClick={() => navigate('/invoice')}>
  <ChevronRightIcon/>
</div>
                    

                      </div>
                    </div>
                    </>
                    )}
                    {activeTab === "Refund History" && (
                      <div className="flex justify-center items-center text-white Gilroy-SemiBold mt-10">
                       No Refund History Yet
                      </div>
                    )}
                  

                 
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
