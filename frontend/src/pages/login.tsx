import React, { FormEvent, useState } from "react";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputField from "../components/inputField";
import Router from "next/router";
import * as yup from 'yup';
import Loader from "../components/loading";

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required().min(6)
});


const Login: React.FC = () => {
  const widthAndHeight = 60;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [validated, setValidated] = useState(false);

  const login = (e:   FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    schema.isValid({ email, password })
    .then(async () => {
      await LoginUser(email, password, toast, setPassword, setLoading);
    })
    .catch(() => {
      toast.error("Invalid email or Password", { theme: "dark" });
      setPassword("");
    })
  }

  const validate = async () => {
      fetch("http://localhost:3001/auth/validate", {method: "POST", credentials: "include"} )
      .then(res => res.json())
      .then(data => {
        if (data.status === 200) {
          Router.push("/");
        } else {
          setLoading(false);
        }
      }
      )  
  }

  if (loading) {
    if(!validated) {
      validate();
      setValidated(true)
    }
    return(
      <Loader />
    )
  }

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
          <div className="w-screen center h-screen">
            <div className="items-center justify-center">
              <div className="bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 rounded">
                <div className="p-10">
                  <div id="Title" className="text-4xl font-bold mb-10">
                    Sign In
                  </div>
                  <div id="Form" className="center flex-col">
                    <form
                      className="flex-col center"
                      onSubmit={(e) => login(e)}
                    >
                      <InputField
                        type="email"
                        placeholder="Enter Your Email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className="mb-0.5"
                      />

                      <InputField
                        type="password"
                        placeholder="Enter Your Password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
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
            </div>
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
  );
};

export default Login;

async function LoginUser(email: string, password: string, toast: any, setPassword: Function, setLoading: Function) {
  await fetch("http://localhost:3001/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
    credentials: "include",
  })
    .then((r) => r.json())
    .then((data) => {
      if (data.status === 400) {
        toast.error(
          "Your Email or Password was not found.. Please check your details again.",
          { theme: "dark" }
        );     
      setPassword("")
      return;
      }    
      
      setLoading(true);
      setTimeout(() => {
        Router.push("/");
      }
      , 1500);      
    });
  }