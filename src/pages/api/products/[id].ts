import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/db/prisma";
import userAuth from "@/middleware/userAuth";
import formidable from "formidable";
import cloudinary from "@/config/cloudinary";
import fs from "fs";
import { UploadApiResponse } from "cloudinary";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };

  const check = await prisma.product.count({ where: { id } });
  if (!check) {
    return res
      .status(400)
      .json({ success: false, message: "Produck tidak ditemukan" });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Formidable Error:", err);
      return res.status(200).json({
        success: false,
        message: "Terjadi kesalahan sistem",
      });
    }

    const picture = files.image;
    if (!picture) {
      return res.status(400).json({
        success: false,
        message: "Tidak ada gambar yang diunggah",
      });
    }

    const uploadToCloudinary = (): Promise<UploadApiResponse> => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "voco/order" },
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

      const checkout = await editPicture(id, uploadResult.secure_url);
      return res.status(200).json({
        success: true,
        message: "Berhasil mengubah gambar",
        data: checkout,
      });
    } catch (error) {
      console.error("Upload Error:", error);
      return res.status(200).json({
        success: false,
        message: "Terjadi kesalahan saat mengupload gambar",
      });
    }
  });
}

const editPicture = async (id: string, image: string) => {
  return await prisma.product.update({
    where: { id },
    data: { image },
  });
};

export default userAuth(handler);
