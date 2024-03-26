import { storage, ref, listAll, getDownloadURL } from "../config/firebase.js";

export const fetchImageUrls = async () => {
  try {
    const storageRef = ref(storage, "assets");
    const listResult = await listAll(storageRef);

    const imageUrls = {};

    for (const item of listResult.items) {
      const downloadUrl = await getDownloadURL(item);
      const fileName = item.name;
      imageUrls[fileName] = downloadUrl;
    }


    return imageUrls;
  } catch (error) {
    console.error("Error fetching image URLs:", error);
    throw error;
  }
};
