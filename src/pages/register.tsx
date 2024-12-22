import { Button, Input, Stack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
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
        src="/bg.png"
        alt=""
        width={1920}
        height={1080}
        className="w-auto h-full fixed z-10 object-cover right-0"
      />

      <div className="flex items-center justify-center px-4 py-4 w-[90%] sm:w-[80%] md:w-[50%] lg:w-[40%] 2xl:w-[30%] max-w-[400px] z-10 lg:self-start md:ml-20">
        <form onSubmit={(e) => onSubmit(e)} className="w-full">
          <Stack gap="4" align="flex-start" className="w-full">
            <div className="flex flex-row items-center justify-center gap-2 w-full my-4">
              <Image
                src="/logo.png"
                alt=""
                width={800}
                height={400}
                className="w-auto h-40 object-cover"
              />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-primary self-center">
              REGISTER
            </h2>
            <Field label="Nama" className="text-black">
              <InputGroup
                flex="1"
                startElement={<PiIdentificationCardLight />}
                className="w-full"
              >
                <Input
                  className="bg-neutral-100 px-2 text-black"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </InputGroup>
            </Field>
            <Field label="Email" className="text-black">
              <InputGroup
                flex="1"
                startElement={<LuUsers />}
                className="w-full"
              >
                <Input
                  className="bg-neutral-100 px-2 text-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </InputGroup>
            </Field>
            <Field label="Password" className="text-black">
              <InputGroup
                flex="1"
                startElement={<BiLock />}
                className="w-full"
              >
                <Input
                  type="password"
                  className="bg-neutral-100 px-2 text-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </InputGroup>
            </Field>
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
              className="w-full bg-primary text-white font-semibold"
            >
              Register
            </Button>
          </Stack>
        </form>
      </div>
      <Toaster />
    </div>
  );
};

export default RegisterPage;
