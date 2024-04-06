import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth'; // Import getAuth
import firebase from '../firebase/firebaseconfig'; // Adjust the path as necessary
import { HiOutlineDocumentText, HiOutlineDownload, HiOutlinePencil, HiOutlineCheck, HiOutlineLink } from 'react-icons/hi';



const InvoiceHeader = ({invoiceNumber}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mt-8 mb-6">
      <div className="flex items-center mb-4 md:mb-0">
        <div className="bg-indigo-600 text-white p-2 rounded-full mr-4">
          <HiOutlineDocumentText className="w-6 h-6" />
        </div>
        <div className='flex flex-col'>
          <span className="text-lg text-gray-300 Gilroy-SemiBold mr-2">Invoice #{invoiceNumber}</span>
          <span className="text-lg Gilroy-SemiBold text-white">Quicktube, Inc</span>
        </div>
      </div>
      {/* <div className="flex items-center space-x-2">
        <button className="text-white px-4 py-2 rounded-md flex items-center">
          <HiOutlineLink className="w-5 h-5 mr-2" />
          Copy URL
        </button>
        <button className="bg-gray-200 text-gray-500 px-4 py-2 rounded-md flex items-center">
          <HiOutlinePencil className="w-5 h-5 mr-2" />
          Edit
        </button>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md">
          Send
        </button>
      </div> */}
    </div>
  );
};

const InvoiceDetails = ({ planStartDate, planEndDate, planPrice, customerAddress, invoicePdf }) => {
  const { city, country, line1, postal_code } = customerAddress;

 
  return (
    <div className="rounded-2xl shadow-sm p-7 bg-neutral-950 drop-shadow-lg border-[1px] border-[#1f2734] shadow-2 hover:shadow-lg dark:bg-dark-2">
    <div className="mb-8">
      <h3 className="text-2xl Gilroy-SemiBold text-white mb-4">Invoice Details</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-white">Issued: <span className="Gilroy-Medium">{planStartDate}</span></p>
          <p className="text-white">Due: <span className="Gilroy-Medium">{planEndDate}</span></p>
        </div>
        <div className="text-right">
          <p className="text-white Gilroy-SemiBold text-lg">Amount : <span className="text-3xl Gilroy-Bold">₹ {planPrice}</span></p>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4 mb-8">
      <div>
        <h4 className="text-lg Gilroy-SemiBold text-gray-400 mb-2">Bill To</h4>
        <p className="text-white">{line1}</p>
          <p className="text-white">{city}</p>
          <p className="text-white">{postal_code}</p>
          <p className="text-white">{country}</p>
      </div>
    </div>
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        {/* <HiOutlineCheck className="w-8 h-8 text-green-500 mr-2" /> */}
        {/* <span className="text-green-500 Gilroy-SemiBold text-xl ">Paid</span> */}
        <span className="text-[#349158] Gilroy-SemiBold bg-[#f0fdf4] rounded-md  px-4 border-[#349158] border-[2px] ">Paid</span>
      </div>
      <button className="bg-indigo-600 hover:bg-indigo-700 text-white hover:text-gray-300 Gilroy-SemiBold px-5 py-2 rounded-lg flex items-center transition-colors duration-150 ease-in-out"
        onClick={() => window.open(invoicePdf, "_blank")}>
        <HiOutlineDownload className="w-5 h-5 mr-2" />
        Download Invoice
      </button>
    </div>
  </div>
  );
};

const App = () => {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [planStartDate, setPlanStartDate] = useState('');
  const [planEndDate, setPlanEndDate] = useState('');
  const [planPrice, setPlanPrice] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [invoicePdf, setInvoicePdf] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid; // Fetching the user ID from the current user
      const fetchData = async () => {
        const userRef = firebase.database().ref(`users/${userId}/subscription`);
        const snapshot = await userRef.once('value');
        const data = snapshot.val();
        setInvoiceNumber(data.invoiceNumber);
        setPlanStartDate(data.planStartDate);
        setPlanEndDate(data.planEndDate);
        setPlanPrice(data.planPrice);
        setInvoicePdf(data.invoicePdf);

        // Assuming customer details are stored at a different node
        const customerDetailsRef = firebase.database().ref(`users/${userId}/customerDetails`);
        const customerSnapshot = await customerDetailsRef.once('value');
        const customerData = customerSnapshot.val();
        setCustomerAddress(customerData.address); // Adjust according to your data structure
      };

      fetchData();
    }
  }, []);


  return (
    <div className=" bg-black w-screen h-screen mx-auto py-8 px-4">
    <div className="max-w-[40rem] flex flex-col justify-center mx-auto">

      <InvoiceHeader invoiceNumber={invoiceNumber} />
      <InvoiceDetails   planStartDate={planStartDate} 
          planEndDate={planEndDate} 
          planPrice={planPrice} 
          customerAddress={customerAddress} 
          invoicePdf={invoicePdf} />
    </div>
    </div>
  );
};

export default App;
