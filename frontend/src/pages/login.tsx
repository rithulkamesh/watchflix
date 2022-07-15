import React from "react";
import Image from "next/image";
import Head from "next/head";
const Login: React.FC = () => {
  const widthAndHeight = 60;
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
              <div className="bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 rounded-lg">
                <div className="p-10">
                <div id="Title" className="text-4xl font-bold mb-10">Sign In</div>
                <div id="Form" className="">
                  <form>

                  </form>
                </div>
                <p className="text-center text-slate-100 text-xs">
                &copy;{new Date().getFullYear()} Rithul K & Apoorva YK. All
                rights reserved.
              </p>
                </div>
              </div>
  
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
