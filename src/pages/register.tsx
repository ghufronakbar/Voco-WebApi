import { Button, Input } from "@chakra-ui/react";
import { useState } from "react";
import Image from "next/image";
import axiosInstance from "@/config/axiosInstance";
import { ResErr } from "@/models/Api";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Toaster } from "@/components/ui/toaster";
import toast from "@/helper/toast";
import Link from "next/link";
import { InputGroup } from "@/components/ui/input-group";
import { LuUsers } from "react-icons/lu";
import { BiLock } from "react-icons/bi";
import { PiIdentificationCardLight } from "react-icons/pi";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      toast.loading();
      const { data } = await axiosInstance.post("/register", {
        name,
        email,
        password,
      });
      Cookies.set("accessToken", data?.data?.accessToken);
      toast.success("Berhasil register");
      router.push("/dashboard");
    } catch (error) {
      const err = error as ResErr;
      toast.error(err.response?.data.message);
      console.log(error);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center relative bg-neutral-300">
      <Image
        src="/bg2.png"
        alt=""
        width={3840}
        height={2160}
        className="w-auto h-full fixed z-10 object-cover right-0"
      />

      <div className="w-full flex flex-row gap-4 px-8 py-4 items-center justify-center">
        <div className="flex items-center justify-center px-4 py-4 md:w-1/2 lg:w-1/3 w-full z-10">
          <form
            onSubmit={(e) => onSubmit(e)}
            className="w-full flex flex-col gap-4"
          >
            <div className="flex flex-row items-center justify-center gap-2 w-full my-4">
              <Image
                src="/regis.png"
                alt=""
                width={1200}
                height={800}
                className="w-[90%] h-auto object-cover"
              />
            </div>
            <InputGroup
              flex="1"
              startElement={<PiIdentificationCardLight />}
              className="w-full px-4 py-2 mb-2 text-black rounded-3xl shadow-md bg-neutral-100"
            >
              <Input
                className="border-0 focus:outline-none"
                value={name}
                placeholder="Nama"
                onChange={(e) => setName(e.target.value)}
              />
            </InputGroup>
            <InputGroup
              flex="1"
              startElement={<LuUsers />}
              className="w-full px-4 py-2 mb-2 text-black rounded-3xl shadow-md bg-neutral-100"
            >
              <Input
                className="border-0 focus:outline-none"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputGroup>
            <InputGroup
              flex="1"
              startElement={<BiLock />}
              className="w-full px-4 py-2 mb-2 text-black rounded-3xl shadow-md bg-neutral-100"
            >
              <Input
                type="password"
                className="border-0 focus:outline-none"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </InputGroup>
            <div className="text-sm">
              Sudah punya akun?{" "}
              <span>
                <Link href="/login" className="text-primary">
                  Login
                </Link>
              </span>{" "}
            </div>
            <Button
              type="submit"
              className="w-full bg-primary text-white font-semibold rounded-3xl shadow-lg py-6"
            >
              Register
            </Button>
          </form>
        </div>
        <div className="w-1/3 hidden lg:flex" />
      </div>
      <Toaster />
    </div>
  );
};

export default RegisterPage;
