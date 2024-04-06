import firebase from "../../firebase/firebaseconfig"; // Adjust the path as necessary
import { useEffect, useState } from "react";
/* This example requires Tailwind CSS v2.0+ */
// const people = [
//     {
//       name: 'Lindsay Walton',
//       title: 'Front-end Developer',
//       department: 'Optimization',
//       email: 'lindsay.walton@example.com',
//       role: 'Member',
//       image:
//         'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
//     },

//   ]

export default function Example() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersRef = firebase.database().ref("users");
      usersRef.on("value", (snapshot) => {
        const usersData = snapshot.val();
        const usersList = Object.keys(usersData).map((key) => {
          return {
            ...usersData[key],
            // Adjust this line if the structure of your subscription data is different
            planType:
              usersData[key].subscriptionStatus === "Inactive"
                ? "None"
                : usersData[key].subscription?.planType, // Fallback to 'Basic' if planType is not specified
          };
        });
        setUsers(usersList);
      });
    };

    fetchUsers();
  }, []);

  return (
    <div className="mt-10 bg-black">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-white">Users</h1>
          <p className="mt-2 text-sm text-gray-500">
            A list of all the users in your account including their name, title,
            email and role.
          </p>
        </div>
        {/* <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm Gilroy-Medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Add user
            </button>
          </div> */}
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8 bg-black pb-20">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-[#1f2734]">
                <thead className="bg-neutral-950">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6"
                    >
                      Users
                    </th>
                    {/* <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                        Status
                      </th> */}
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Plan
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Role
                    </th>
                    {/* <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                        Created
                      </th> */}
                    {/* <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Edit</span>
                      </th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f2734] bg-neutral-950">
                  {users.map((user) => (
                    <tr key={user.email} className="text-gray-400">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          {/* <div className="h-10 w-10 flex-shrink-0">
                              <img className="h-10 w-10 rounded-full" src={person.image} alt="" />
                            </div> */}
                          <div className="">
                            <div className="Gilroy-Medium text-white">
                              {user.username}
                            </div>
                            <div className="text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="text-white">{person.title}</div>
                          <div className="text-gray-500">{person.department}</div>
                        </td> */}
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">
                        <span
                          className={`inline-flex rounded-[6px] border-[2px] ${
                            user.subscriptionStatus === "Inactive"
                              ? "border-red-500 bg-red-100"
                              : "border-[#c4ecd2] bg-[#f1fcf4]"
                          } px-2 text-xs Gilroy-SemiBold leading-5 ${
                            user.subscriptionStatus === "Inactive"
                              ? "text-red-800"
                              : "text-green-800"
                          }`}
                        >
                          {user.subscriptionStatus.charAt(0).toUpperCase() +
                            user.subscriptionStatus.slice(1)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">
                        {user.planType.charAt(0).toUpperCase() +
                          user.planType.slice(1)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">
                        {user.role}
                      </td>
                      {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">{person.role}</td> */}
                      {/* <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm Gilroy-Medium sm:pr-6">
                          <a href="#" className="text-indigo-600 hover:text-indigo-900">
                            Edit<span className="sr-only">, {person.name}</span>
                          </a>
                        </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
