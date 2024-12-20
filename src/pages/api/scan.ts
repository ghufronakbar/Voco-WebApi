import prisma from "@/db/prisma";
import formatDate from "@/utils/format/formatDate";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const { qrCode } = req.body;
      const product = await prisma.product.findFirst({ where: { qrCode } });
      if (!product) {
        return res
          .status(200)
          .json({ success: false, message: "Produk tidak ditemukan" });
      } else {
        const response = {
          ...product,
          text: `${product.brand}, ${
            product.variant
          }. Kadaluarsa pada tanggal ${formatDate(product.expiredDate)}. ${
            product.desc
          }`,
        };
        return res.status(200).json({ success: true, data: response });
      }
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan sistem" });
  }
}
