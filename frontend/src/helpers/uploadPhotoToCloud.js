// const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_IMAGE_UPLOAD}/image/upload`;
// const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_IMAGE_UPLOAD}/video/upload`;
// const uploadPhotoToCloud = async (image) => {
//   const formData = new FormData();
//   formData.append("file", image);
//   formData.append("upload_preset", "mern_product");
//   const dataResponse = await fetch(url, {
//     method: "post",
//     body: formData,
//   });

//   return dataResponse.json()
// };

// export default uploadPhotoToCloud;

const cloudinaryImageUrl = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_IMAGE_UPLOAD}/image/upload`;
const cloudinaryVideoUrl = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_IMAGE_UPLOAD}/video/upload`;

const uploadPhotoToCloud = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "mern_product");

  // Determine if the file is an image or video
  const isImage = file.type.startsWith("image");
  const isVideo = file.type.startsWith("video");

  // Choose the correct URL based on the file type
  const url = isImage ? cloudinaryImageUrl : isVideo ? cloudinaryVideoUrl : null;

  if (!url) {
    throw new Error("Unsupported file type");
  }

  // Make the API request to Cloudinary
  const dataResponse = await fetch(url, {
    method: "post",
    body: formData,
  });

  return dataResponse.json();
};

export default uploadPhotoToCloud;
