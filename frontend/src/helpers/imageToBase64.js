const imageToBase64 = async (image) => {
  const reader = new FileReader(); // Create a new FileReader instance
  reader.readAsDataURL(image); // Read the image file as a data URL (Base64 string)

  const data = await new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result); // Resolve the promise with the result (Base64 string) when reading is complete
    reader.onerror = (error) => reject(error); // Reject the promise if there's an error
  });

  return data; // Return the Base64-encoded string
};

export default imageToBase64;
