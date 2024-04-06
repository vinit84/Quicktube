import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { getDatabase, ref, push, set, get } from "firebase/database";
import { app } from "../../firebase/firebaseconfig";
import { getAuth } from "firebase/auth";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Notify from "../UI_Components/Notify";


const InviteDialog = ({ isOpen, setIsOpen, onEditorInvited }) => {
  const [editorEmail, setEditorEmail] = useState("");
  const [channelName, setChannelName] = useState(""); // State for the channel name input
  const [existingEditors, setExistingEditors] = useState([]);
  const [showNotification, setShowNotification] = useState(false); 
  const db = getDatabase(app);
  const auth = getAuth(app);

  useEffect(() => {
    if (isOpen) {
      fetchExistingEditors();
    }
  }, [isOpen]);

  const fetchExistingEditors = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const channelsRef = ref(db, `users/${user.uid}/youtubechannels`);
    get(channelsRef).then((snapshot) => {
      if (snapshot.exists()) {
        const channelsData = snapshot.val();
        const editors = [];
        Object.values(channelsData).forEach((channel) => {
          if (channel.editors) {
            Object.values(channel.editors).forEach((editor) => {
              if (
                editor.status === "Active" &&
                !editors.some((e) => e.email === editor.email)
              ) {
                editors.push(editor);
              }
            });
          }
        });
        setExistingEditors(editors);
      }
    });
  };

  const handleEditorSelection = (editorEmail) => {
    setEditorEmail(editorEmail);
    // You can also pre-fill other details if needed
  };

  const sendInvite = async () => {
    if (!editorEmail || !channelName) {
      alert("Please enter both the editor's email and the channel name.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("No authenticated user found.");
      return;
    }

    const userRef = ref(db, "users/" + user.uid);
    get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          if (userData.role !== "youtuber") {
            alert("Only Youtubers can send invites.");
            return;
          }

          const channelsRef = ref(db, `users/${user.uid}/youtubechannels`);
          get(channelsRef).then((channelsSnapshot) => {
            let channelId;
            if (channelsSnapshot.exists()) {
              const channelsData = channelsSnapshot.val();
              const channelEntry = Object.entries(channelsData).find(
                ([key, value]) => value.name === channelName
              );
              channelId = channelEntry
                ? channelEntry[0]
                : push(channelsRef).key;
            } else {
              channelId = push(channelsRef).key;
            }

            if (!channelsSnapshot.child(channelId).exists()) {
              set(ref(db, `users/${user.uid}/youtubechannels/${channelId}`), {
                name: channelName,
              });
            }

            // Check for existing editor across all channels
            get(ref(db, `users/${user.uid}/youtubechannels`)).then(
              (allChannelsSnapshot) => {
                let existingEditorRef = null;
                allChannelsSnapshot.forEach((channelSnapshot) => {
                  const editors = channelSnapshot.child("editors").val();
                  if (editors) {
                    Object.entries(editors).forEach(
                      ([editorKey, editorValue]) => {
                        if (
                          editorValue.email === editorEmail &&
                          editorValue.status === "Active"
                        ) {
                          existingEditorRef = {
                            key: editorKey,
                            ...editorValue,
                          };
                        }
                      }
                    );
                  }
                });

                if (existingEditorRef) {
                  // Reuse the existing editor ID and data for the new channel
                  const editorRef = ref(
                    db,
                    `users/${user.uid}/youtubechannels/${channelId}/editors/${existingEditorRef.key}`
                  );
                  set(editorRef, existingEditorRef)
                    .then(() => {
                   
                      onEditorInvited({
                        email: editorEmail,
                        Role: "Editor",
                        channelName: channelName,
                        status: existingEditorRef.status,
                      });
                      setIsOpen(false);
                    })
                    .catch((error) => {
                      console.error(
                        "Error re-inviting editor with existing details:",
                        error
                      );
                      alert(
                        "Failed to re-invite editor with existing details."
                      );
                    });
                } else {
                  // Add new editor if not found
                  const newEditorRef = push(
                    ref(
                      db,
                      `users/${user.uid}/youtubechannels/${channelId}/editors`
                    )
                  );
                  set(newEditorRef, {
                    email: editorEmail,
                    name: "",
                    status: "Pending",
                  })
                    .then(() => {
                     
                      onEditorInvited({
                        email: editorEmail,
                        Role: "Editor",
                        channelName: channelName,
                        status: "Pending",
                      });
                      setIsOpen(false);
                    })
                    .catch((error) => {
                      console.error("Error inviting new editor:", error);
                      alert("Failed to invite new editor.");
                    });
                }
              }
            );
          });
        } else {
          alert("User details not found.");
        }
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        alert("Failed to fetch user details.");
      });
      setShowNotification(true); // Show the notification on successful invite
      setTimeout(() => setShowNotification(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <>
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-3xl p-7 bg-neutral-900 drop-shadow-lg border-[1px] border-[#1f2734] shadow-2 hover:shadow-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="absolute top-0 right-0 pt-7 pr-6">
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onClick={() => setIsOpen(false)}
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <Dialog.Title as="h3" className="text-lg  leading-6 Gilroy-SemiBold text-white">
                  Invite an Editor
                </Dialog.Title>
                <div className="gap-3 mt-7 flex flex-col">
                  <input
                    type="text"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    placeholder="Channel name"
                    className="shadow-sm bg-neutral-900 text-white focus:ring-indigo-500 p-2 Gilroy-Medium text-md focus:border-indigo-500 block w-full sm:text-sm border-gray-300 border rounded-md"
                  />
                  {existingEditors.length > 0 && (
                  <select
                  className="shadow-sm bg-neutral-900 text-white focus:ring-indigo-500 p-[0.7rem] Gilroy-Medium text-md focus:border-indigo-500 block w-full sm:text-sm border-gray-300 border rounded-md"
                  onChange={(e) => handleEditorSelection(e.target.value)}
                  value={editorEmail}
                >
                  <option value="" className="hover:bg-gray-300 rounded-lg Gilroy-Medium">Select an existing editor</option>
                  {existingEditors.map((editor, index) => (
                    <option key={index} value={editor.email} className="Gilroy-Medium">
                      {editor.email} ({editor.name})
                    </option>
                  ))}
                </select>
                  )}
                  <input
                    type="email"
                    value={editorEmail}
                    onChange={(e) => setEditorEmail(e.target.value)}
                    placeholder="Editor's email"
                    className="shadow-sm bg-neutral-900 text-white focus:ring-indigo-500 p-2 Gilroy-Medium text-md focus:border-indigo-500 block w-full sm:text-sm border-gray-300 border rounded-md"
                  />
                </div>
                <div className="mt-5 flex justify-end">
                  {/* <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm Gilroy-Medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 mr-3"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button> */}
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm Gilroy-SemiBold text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
                    onClick={sendInvite}
                  >
                    Send Invite
                  </button>
                </div>
              </Dialog.Panel>
              
            </Transition.Child>
          </div>
        </div>
      </Dialog>
      

    </Transition.Root>
    <div className="high-z-index">
  {showNotification && <Notify />}
</div>
   
  </>
  );
};

export default InviteDialog;
