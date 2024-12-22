import Button from "@/components/Button";
import { Toaster } from "@/components/ui/toaster";
import axiosInstance from "@/config/axiosInstance";
import { ResErr, ResOk } from "@/models/Api";
import { useEffect, useState } from "react";
import Image from "next/image";
import { BiLogOutCircle } from "react-icons/bi";
import Link from "next/link";
import { FaBoxOpen } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { Admin } from "@prisma/client";
import { Box, Input, Stack } from "@chakra-ui/react";
import toast from "@/helper/toast";
import { Field } from "@/components/ui/field";
import { useRouter } from "next/router";

const AccountPage = () => {
  const [data, setData] = useState<Admin>();
  const router = useRouter();

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get<ResOk<Admin>>("/account");
      setData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async () => {
    try {
      toast.loading();
      await axiosInstance.put<ResOk<Admin>>("/account", data);
      toast.success("Berhasil mengubah profil");
    } catch (error) {
      const err = error as ResErr;
      toast.error(err.response?.data.message);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const formData = new FormData();
      formData.append("image", file as Blob);
      try {
        toast.loading();
        const res = await axiosInstance.post<ResOk<Admin>>(
          `/account/picture`,
          formData
        );
        setData(res.data.data);
        toast.success("Berhasil mengubah gambar");
      } catch (error) {
        const err = error as ResErr;
        toast.error(err.response?.data.message);
        console.log(error);
      }
    }
  };

  if (!data) {
    return (
      <div className="w-screen h-full flex justify-center items-center">
        <h1 className="text-3xl md:text-4xl font-semibold">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="w-20 min-h-screen bg-primary fixed left-0 flex flex-col items-center py-12 gap-8">
        <Link href="/dashboard">
          <FaBoxOpen className="w-10 h-10 text-white" />
        </Link>
        <Link href="/account">
          <IoPerson className="w-10 h-10 text-white" />
        </Link>
        <Link href="/logout">
          <BiLogOutCircle className="w-10 h-10 text-white" />
        </Link>
      </div>
      <div className="w-full pl-32 lg:pl-40 pr-8 py-8 flex flex-col">
        <h1 className="text-3xl md:text-4xl font-semibold mb-4 flex flex-row items-center gap-2">
          Profile
        </h1>
        <input
          type="file"
          className="hidden"
          onChange={handleImageChange}
          id="picture"
        />
        <Box
          className="flex items-center justify-center px-4 py-4 w-[90%] sm:w-[80%] md:w-[50%] lg:w-[40%] 2xl:w-[30%] max-w-[400px] bg-white z-10 self-center"
          p={8}
          borderRadius="lg"
          boxShadow="lg"
        >
          <div className="w-full">
            <Stack gap="4" align="flex-start" className="w-full">
              <div className="flex flex-row items-center justify-center gap-2 w-full my-4">
                <Image
                  src={data.picture || "/profile.jpg"}
                  alt=""
                  width={800}
                  height={800}
                  className="w-32 h-32 object-cover rounded-full cursor-pointer"
                  onClick={() => {
                    document.getElementById("picture")?.click();
                  }}
                />
              </div>
              <Field label="Email" className="text-black">
                <Input
                  className="bg-neutral-100 px-2 text-black"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />
              </Field>
              <Field label="Nama" className="text-black">
                <Input
                  className="bg-neutral-100 px-2 text-black"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                />
              </Field>
              <Button
                className="w-full bg-primary text-white font-semibold"
                onClick={handleEdit}
              >
                Simpan
              </Button>
              <Button status="danger" className="w-full  font-semibold ">
                <div onClick={() => router.push("/logout")}>Logout</div>
              </Button>
            </Stack>
          </div>
        </Box>
        <Toaster />
      </div>
    </div>
  );
};

export default AccountPage;
