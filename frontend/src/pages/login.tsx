import React, { useState } from "react";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login: React.FC = () => {
  const widthAndHeight = 60;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = async (e: any) => {

    e.preventDefault();
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid Email", { theme: "dark" });
      setPassword("");
      return;
    }

    await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email:email,
        password:password,
      }),
    })
    .then(r => r.json())
    .then(data => {
      console.log(data);
  })
    
  };
  return (
    <div>
      <div className="h-screen w-screen loginBackground">
        <div className="loginLayer">
          <div className="fixed px-20 py-5">
            <Image
              src={"/logo-blue.svg"}
              alt={"Logo"}
              width={widthAndHeight}
              height={widthAndHeight}
              className={"px-1"}
            />
          </div>
          <div className="w-screen flex items-center justify-center h-screen">
            <div className="items-center justify-center">
              <div className="bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 rounded">
                <div className="p-10">
                  <div id="Title" className="text-4xl font-bold mb-10">
                    Sign In
                  </div>
                  <div
                    id="Form"
                    className=" flex items-center justify-center flex-col"
                  >
                    <form
                      className="flex-col flex justify-center items-center"
                      onSubmit={(e) => login(e)}
                    >
                      <input
                        type="email"
                        placeholder="Enter your Email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-black bg-opacity-70 rounded-sm mx-5 my-5 mb-0.5 w-80 h-12 indent-3"
                      />
                      <input
                        type="password"
                        placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className="bg-black bg-opacity-70 rounded-sm mx-5 my-5  mt-3 w-80 h-12 indent-3"
                      />
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-80 rounded-sm mb-10"
                        type="submit"
                      >
                        Submit
                      </button>
                    </form>
                  </div>
                  <p className="text-center text-slate-100 text-xs">
                    Class 12 Project | Rithul Kamesh and Apoorva YK
                  </p>
                </div>
              </div>
              <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
