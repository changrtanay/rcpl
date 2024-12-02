// import React from "react";
// import { IoClose } from "react-icons/io5";

// const FullPhoto = ({ handleOnClose, photoUrl }) => {
//   return (
//     <div className="fixed top-14 right-0 left-0 flex justify-center items-center">
//       <div className="bg-white shadow-lg rounded max-w-5xl mx-auto p-4 relative">
//         <div
//           className="w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer -mr-1 mb-1"
//           onClick={handleOnClose}
//         >
//           <IoClose />
//         </div>

//         <div className="flex justify-center pr-4 py-0 max-w-[80vh] max-h-[80vh] overflow-y-scroll">
//           <img src={photoUrl} className="w-full h-full" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FullPhoto;
import React from "react";
import { IoClose } from "react-icons/io5";

const FullPhoto = ({ handleOnClose, photoUrl }) => {
  // Check if the URL points to a video or an image
  const isVideo =
    photoUrl?.endsWith(".mp4") ||
    photoUrl?.endsWith(".mov") ||
    photoUrl?.includes("video");

  return (
    <div className="fixed top-14 right-0 left-0 flex justify-center items-center">
      <div className="bg-white shadow-lg rounded max-w-5xl mx-auto p-4 relative">
        {/* Close Button */}
        <div
          className="w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer -mr-1 mb-1"
          onClick={handleOnClose}
        >
          <IoClose />
        </div>

        {/* Render Image or Video */}
        <div className="flex justify-center pr-4 py-0 max-w-[80vh] max-h-[80vh] overflow-y-scroll">
          {isVideo ? (
            <video controls className="w-full h-50%">
              <source src={photoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={photoUrl}
              className="w-full h-full"
              alt="Uploaded media"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FullPhoto;
