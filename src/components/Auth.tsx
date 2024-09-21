"use client";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SignupType } from "../validators/validators";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const router = useRouter();

  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);
  const [postInputs, setPostInputs] = useState<SignupType>({
    name: "",
    email: "",
    password: "",
  });
  const showToastMessageSuccess = () => {
    toast.success("Success!");
  };
  const showToastMessageFail = () => {
    toast.error("Some Error occured!");
  };

  async function sendRequest() {
    if (type === "signin") {
      const res: any = await signIn("credentials", {
        email: postInputs.email,
        password: postInputs.password,
        redirect: false,
      });
      console.log(res);
      if (!res?.error) {
        router.push("/signin");
        router.refresh();
      }
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      console.log("Login Successful", res);
      router.push("/dashboard");
      showToastMessageSuccess();
    } else {
      try {
        const res = await axios.post(`/api/register`, postInputs);
        console.log(res);

        showToastMessageSuccess();
        setTimeout(() => {
          router.push("/signin");
        }, 2000);
      } catch (error) {
        showToastMessageFail();
        console.log(error);
      }
    }
  }
  return (
    <div className=" h-screen flex justify-center flex-col">
      <ToastContainer />
      <div className="flex justify-center ">
        <div>
          <div className="px-10">
            <div className=" text-3xl font-extrabold tracking-wide">
              Create an account
            </div>
            <div className="mt-2 text-xl font-sm text-slate-600">
              {type === "signin"
                ? "Don't have an account ? "
                : "Already have an account? "}{" "}
              <Link
                className="pl=1 italic font-semibold underline"
                href={type === "signin" ? "/signup" : "/signin"}
              >
                {type === "signin" ? "Sign up" : "Sign in"}
              </Link>
            </div>
          </div>
          <div className="mt-8 space-y-4">
            {type === "signup" && (
              <LabelledInput
                label="Name"
                placeholder="John Doe"
                onChange={(e) => {
                  setPostInputs({ ...postInputs, name: e.target.value });
                }}
              />
            )}
            <LabelledInput
              label="Email"
              placeholder="John@gmail.com"
              onChange={(e) => {
                setPostInputs({ ...postInputs, email: e.target.value });
              }}
            />
            <LabelledInput
              label="Password"
              placeholder="12345678"
              type="password"
              onChange={(e) => {
                setPostInputs({ ...postInputs, password: e.target.value });
              }}
            />
            <button
              type="button"
              onClick={sendRequest}
              className="mt-10  w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            >
              {type == "signup" ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface LabelledInputType {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function LabelledInput({
  label,
  placeholder,
  onChange,
  type,
}: LabelledInputType) {
  return (
    <>
      <div>
        <div>
          <label className="block mb-2 text-sm text-extrabold font-semibold text-gray-900 dark:text-white">
            {label}
          </label>
          <input
            onChange={onChange}
            type={type || "text"}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={placeholder}
            required
          />
        </div>
      </div>
    </>
  );
}

export default Auth;
