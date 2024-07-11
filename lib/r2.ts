import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

// Initialize R2 Client
const s3Client = new S3Client({
  region: "auto",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
  forcePathStyle: true,
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
});

// Define the R2 bucket name
const bucketName = process.env.R2_BUCKET_NAME || "";

/**
 * Uploads multiple files to Cloudflare R2.
 * @param {Array<UploadedFile>} files - Array of file objects to upload.
 * @returns {Promise<string[]>} - Array of URLs of uploaded files.
 */
export async function uploadToR2(
  files: UploadedFile[]
): Promise<{ id: string; createdAt: Date; url: string; mimeType: string }[]> {
  if (!bucketName) {
    throw new Error("R2_BUCKET_NAME is not defined");
  }

  // console.log("Files to upload:", files); // Debugging line

  // console.log("Uploading...");
  // Upload files to R2
  const uploadPromises = files.map(async (file) => {
    const params = {
      Bucket: bucketName,
      Key: file.key, // Use the provided key as the filename
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    // Upload file to R2
    await s3Client.send(new PutObjectCommand(params));

    // Construct the URL of the uploaded file
    const url = `https://${process.env.R2_DOMAIN}/${file.key}`;

    // console.log(`File uploaded: ${url}`); // Debugging line

    return {
      id: file.id,
      createdAt: new Date(),
      url,
      mimeType: file.mimetype,
    };
  });

  // Resolve all promises and return an array of URLs
  const urls = await Promise.all(uploadPromises);

  // console.log("Uploaded URLs:", urls); // Debugging line

  return urls;
}

export async function deleteFromR2(
  mediaFiles: { url: string; id: string }[]
): Promise<{ id: string }[]> {
  if (!bucketName) {
    throw new Error("R2_BUCKET_NAME is not defined");
  }

  // console.log("Files to upload:", files); // Debugging line

  // console.log("Uploading...");
  // Upload files to R2
  const uploadPromises = mediaFiles.map(async (media) => {
    const params = {
      Bucket: bucketName,
      Key: `${media.url.replace(`https://${process.env.R2_DOMAIN}/`, "")}`,
    };

    // Upload file to R2
    await s3Client.send(new DeleteObjectCommand(params));

    // console.log(`File uploaded: ${url}`); // Debugging line

    return {
      id: media.id,
    };
  });

  // Resolve all promises and return an array of URLs
  const urls = await Promise.all(uploadPromises);

  // console.log("Uploaded URLs:", urls); // Debugging line

  return urls;
}
