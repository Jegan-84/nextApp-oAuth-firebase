import type { NextApiRequest, NextApiResponse } from "next";
import { db, storage } from "../../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { userId } = req.query;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        res.status(200).json(userData);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  } else if (req.method === "PUT") {
    try {
      const { userId, name, bio, image } = req.body;

      const userRef = doc(db, "users", userId);
      const updateData: { name: string; bio: string; imageUrl?: string } = {
        name,
        bio,
      };

      if (image) {
        const imageBuffer = Buffer.from(image.split(",")[1], "base64");
        const imageRef = ref(storage, `profile_images/${userId}`);
        await uploadBytes(imageRef, imageBuffer);
        const downloadURL = await getDownloadURL(imageRef);
        updateData.imageUrl = downloadURL;
      }

      await updateDoc(userRef, updateData);

      res
        .status(200)
        .json({ message: "Profile updated successfully", ...updateData });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
