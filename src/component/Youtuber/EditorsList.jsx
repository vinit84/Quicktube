import React, { useState, useEffect } from "react";
import { ref, get, child, remove, set } from "firebase/database"; // Import Firebase database functions
import firebase from "../../firebase/firebaseconfig"; // Adjust the path as necessary
import InviteDialog from "./InviteDialog"; // Adjust the path as necessary
import { auth } from "../../firebase/firebaseconfig";
import EditEditorDialog from "./EditEditorDialog";

export default function EditorsList() {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [editors, setEditors] = useState([]); // State to hold editors' data
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentEditor, setCurrentEditor] = useState(null);

  const openEditDialog = (editor) => {
    setCurrentEditor(editor);
    setIsEditDialogOpen(true);
  };

  const handleSaveEditor = (updatedEditor, oldEmail) => {
    console.log("Updated Editor:", updatedEditor);
    console.log("Old Email:", oldEmail);
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      const channelsPath = `users/${userId}/youtubechannels`;

      // Fetch all channels
      get(ref(firebase.database(), channelsPath))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const channels = snapshot.val();
            Object.keys(channels).forEach((channelKey) => {
              const channel = channels[channelKey];
              // Check if the channel name matches
              if (channel.name === updatedEditor.channelName) {
                const editors = channel.editors || {};

                // Check if the old email exists under this channel's editors
                Object.keys(editors).forEach((editorKey) => {
                  const editor = editors[editorKey];
                  if (editor.email === oldEmail) {
                    // Found the editor, now prepare to update the email
                    const editorPath = `${channelsPath}/${channelKey}/editors/${editorKey}`;

                    // Update the editor entry with the new details
                    set(ref(firebase.database(), editorPath), {
                      ...editor,
                      email: updatedEditor.email, // Update with the new email
                    })
                      .then(() => {
                        console.log(
                          "Editor email updated successfully for the specific channel."
                        );
                        // Update local state to reflect the change
                        setEditors((prevEditors) => {
                          return prevEditors.map((ed) => {
                            if (
                              ed.email === oldEmail &&
                              ed.channelName === updatedEditor.channelName
                            ) {
                              return { ...ed, email: updatedEditor.email };
                            }
                            return ed;
                          });
                        });
                      })
                      .catch((error) => {
                        console.error(
                          "Error updating editor email for the specific channel: ",
                          error
                        );
                      });
                  }
                });
              }
            });
          } else {
            console.log("No channels found.");
          }
        })
        .catch((error) => {
          console.error("Error fetching channels: ", error);
        });
    } else {
      console.log("No user is logged in");
    }
  };

  const handleDeleteEditor = (editorToDelete) => {
    setIsLoading(true);
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const channelsPath = `users/${userId}/youtubechannels`;

      get(ref(firebase.database(), channelsPath))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const channels = snapshot.val();
            Object.keys(channels).forEach((channelKey) => {
              const channel = channels[channelKey];
              if (channel.name === editorToDelete.channelName) {
                // Construct the path to the channel
                const channelPath = `${channelsPath}/${channelKey}`;
                // Delete the entire channel
                remove(ref(firebase.database(), channelPath))
                  .then(() => {
                    console.log("Channel deleted successfully.");
                    // After deletion, filter out the editors from the deleted channel
                    const updatedEditors = editors.filter(
                      (editor) =>
                        editor.channelName !== editorToDelete.channelName
                    );
                    setEditors(updatedEditors); // Update the state to trigger a re-render
                  })
                  .catch((error) =>
                    console.error("Error deleting channel: ", error)
                  );
              }
            });
          } else {
            console.log("No channels found.");
          }
        })
        .catch((error) => {
          console.error("Error fetching channels: ", error);
        });
    } else {
      console.log("No user is logged in");
    }
  };

  // Function to open the dialog
  const openInviteDialog = () => {
    setIsInviteDialogOpen(true);
  };

  // Function to add an editor to the state
  const addEditor = (newEditor) => {
    setEditors((prevEditors) => [...prevEditors, newEditor]);
  };

  // Fetch editors' data from Firebase Realtime Database
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid; // Get the current user's ID
      const dbRef = ref(firebase.database());
      get(child(dbRef, `users/${userId}/youtubechannels`)) // Adjust the path to directly access the user's channels
        .then((snapshot) => {
          if (snapshot.exists()) {
            const channels = snapshot.val();
            const loadedEditors = [];
            Object.keys(channels).forEach((channelKey) => {
              const channel = channels[channelKey];
              const channelName = channel.name;
              const editors = channel.editors;
              if (editors) {
                Object.values(editors).forEach((editor) => {
                  loadedEditors.push({
                    // name: editor.name,
                    Role: "Editor",
                    email: editor.email,
                    channelName: channelName,
                    status: editor.status || "Pending", // Add the channel name to each editor
                  });
                });
              }
            });
            setEditors(loadedEditors);
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      // Handle the case where there is no user logged in
      console.log("No user is logged in");
    }
  }, []);

  return (
    <div className="sm:px-6 lg:px-8 font-['Gilroy']">
      <EditEditorDialog
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        editorDetails={currentEditor}
        onSave={handleSaveEditor}
        onDelete={handleDeleteEditor}
      />
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold ">Editors</h1>
          <p className="mt-2 text-sm ">
            A list of all the Editors in your account including their name,
            Role, email and role.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={openInviteDialog}
            className="inline-flex items-center justify-center rounded-lg border border-transparent bg-[#5E17EB] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto transition duration-300 ease-in-out"
          >
            Add Editor
          </button>
        </div>
      </div>
      <InviteDialog
        isOpen={isInviteDialogOpen}
        setIsOpen={setIsInviteDialogOpen}
        onEditorInvited={addEditor}
      />

      {editors.length > 0 ? (
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-2xl border border-[#1f2734]">
                <table className="min-w-full divide-y divide-[#1f2734]">
                  <thead className="bg-[#09090b]">
                    <tr>
                      {/* <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6 flex-1"
                    >
                      Name
                    </th> */}
                      <th
                        scope="col"
                        className="px-5 py-3.5 text-left text-sm font-semibold flex-1"
                      >
                        Channels
                      </th>
                      <th
                        scope="col"
                        className="px-5 py-3.5 text-left text-sm font-semibold flex-1"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-5 py-3.5 text-left text-sm font-semibold flex-1"
                      >
                        Role
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6 flex-1"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#09090b]">
                    {editors.map((editor, editorIdx) => (
                      <tr
                        key={editor.email}
                        className={
                          editorIdx % 2 === 0 ? undefined : "bg-[#09090b]"
                        }
                      >
                        <td className="whitespace-nowrap px-5 py-4 text-sm ">
                          {editor.channelName}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm ">
                          {editor.email}{" "}
                          {editor.status === "Pending" && (
                            <span className="text-red-500 border border-gray-500 rounded-lg p-1 ml-1">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-white">
                          {editor.Role}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <a
                            onClick={() => openEditDialog(editor)}
                            className="text-indigo-600 hover:text-indigo-800 cursor-pointer select-none"
                          >
                            Edit
                            <span className="sr-only">, {editor.email}</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="text-center py-10 ">
            <p className="text-md text-gray-500">
              You have no editors. Invite them to create awesome content!
            </p>
          </div>
        </>
      )}
    </div>
  );
}
