import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(
  file: string,
  folder: string = "radhe-boutique"
): Promise<{ url: string; publicId: string }> {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: "auto",
      transformation: [
        { width: 1200, height: 1200, crop: "limit" },
        { quality: "auto:good" },
        { fetch_format: "auto" },
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image");
  }
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete image");
  }
}

export async function uploadMultipleToCloudinary(
  files: string[],
  folder: string = "radhe-boutique"
): Promise<{ url: string; publicId: string }[]> {
  try {
    const uploadPromises = files.map((file) => uploadToCloudinary(file, folder));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Cloudinary multiple upload error:", error);
    throw new Error("Failed to upload images");
  }
}

export default cloudinary;
