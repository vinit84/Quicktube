import React, { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

function EditEditorDialog({
  isOpen,
  setIsOpen,
  editorDetails,
  onSave,
  onDelete,
}) {
  const [editor, setEditor] = useState(editorDetails || {});
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    setEditor(editorDetails || {});
  }, [editorDetails]);

  if (!isOpen || !editorDetails) return null;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => setIsOpen(false)}
      >
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-3xl p-7 Gilroy-SemiBold bg-neutral-900 drop-shadow-lg border-[1px] border-[#1f2734] shadow-2 hover:shadow-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="  pb-4 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    {/* <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon
                        className="h-6 w-6 text-indigo-600"
                        aria-hidden="true"
                      />
                    </div> */}
                    <div className="">
                      <Dialog.Title
                        as="h3"
                        className="text-lg leading-6 font-medium text-white"
                      >
                        Edit Editor Details
                      </Dialog.Title>
                      {/* Display Channel Name */}
                      <p className="text-sm text-gray-400 mt-2">
                        Channel: {editor.channelName}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 pt-7 pr-7">
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onClick={() => setIsOpen(false)}
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className=" flex flex-row justify-between items-center w-full  ">
                  <div>
                    {/* Email Input for Update */}
                    <input
                      type="email"
                      className="shadow-sm bg-neutral-900 text-white focus:ring-indigo-500 p-2 Gilroy-Medium text-md focus:border-indigo-500 block w-[15rem] sm:text-sm border-gray-300 border rounded-md"
                      value={editor.email || ""}
                      onChange={(e) =>
                        setEditor({
                          ...editor,
                          email: e.target.value,
                        })
                      }
                      placeholder="Editor's New Email"
                    />
                  </div>
                  <div className="py-2">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md  shadow-sm px-4 py-2 bg-indigo-600 text-base Gilroy-SemiBold text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => {
                        console.log(
                          "Saving editor with new email:",
                          editor.email
                        );
                        onSave(editor, editorDetails.email);
                        setIsOpen(false); // Optionally close the dialog
                      }}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md  shadow-sm px-4 py-2 bg-red-600 text-base Gilory-SemiBold text-white hover:bg-red-700 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => {
                        onDelete({
                          ...editor,
                          channelName: editor.channelName, // Ensure this is included
                        });
                        setIsOpen(false);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
export default EditEditorDialog;
