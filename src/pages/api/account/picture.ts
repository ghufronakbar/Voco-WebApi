import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/db/prisma";
import formidable from "formidable";
import cloudinary from "@/config/cloudinary";
import fs from "fs";
import { UploadApiResponse } from "cloudinary";
import adminAuth from "@/middleware/adminAuth";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const adminId = req.decoded?.id;

  if (req.method === "POST") {
    const check = await prisma.admin.count({ where: { id: adminId } });
    if (!check) {
      return res.status(400).json({ status: 400, message: "Admin tidak ada" });
    }

    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Formidable Error:", err);
        return res.status(200).json({
          status: 500,
          message: "Terjadi kesalahan sistem",
        });
      }

      const picture = files.image;
      if (!picture) {
        return res.status(400).json({
          status: 400,
          message: "Tidak ada gambar yang diunggah",
        });
      }

      const uploadToCloudinary = (): Promise<UploadApiResponse> => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "voco/profile" },
            (error, result) => {
              if (error) {
                console.error("Cloudinary Error:", error);
                reject(error);
              } else {
                if (result) {
                  resolve(result);
                }
              }
            }
          );

          const stream = fs.createReadStream(picture[0].filepath);
          stream.pipe(uploadStream);
        });
      };

      try {
        const uploadResult = await uploadToCloudinary();

        const adminUpdated = await prisma.admin.update({
          where: { id: adminId },
          data: { picture: uploadResult.secure_url },
        });
        return res.status(200).json({
          status: 200,
          message: "Berhasil mengubah gambar",
          data: adminUpdated,
        });
      } catch (error) {
        console.error("Upload Error:", error);
        return res.status(500).json({
          status: 500,
          message: "Terjadi kesalahan saat mengupload gambar",
        });
      }
    });
  }
  if (req.method === "DELETE") {
    const check = await prisma.admin.count({ where: { id: adminId } });
    if (!check) {
      return res.status(400).json({ status: 400, message: "Admin tidak ada" });
    }

    const adminUpdated = await prisma.admin.update({
      where: { id: adminId },
      data: { picture: null },
    });

    return res.status(200).json({
      status: 200,
      message: "Berhasil menghapus gambar",
      data: adminUpdated,
    });
  }
}

export default adminAuth(handler);
