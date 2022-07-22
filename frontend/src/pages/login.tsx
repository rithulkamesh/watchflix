import React from "react";
import Image from "next/image";

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
              <div className="bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 rounded">
                <div className="p-10">
                  <div id="Title" className="text-4xl font-bold mb-10">
                    Sign In
                  </div>
                  <div id="Form" className=" flex items-center justify-center">
                    <form className="flex-col flex justify-center items-center">
                      <input
                        type="email"
                        placeholder="Enter your Email"
                        className="bg-black bg-opacity-70 rounded-sm mx-5 my-5 mb-0.5 w-80 h-12 indent-3"
                      />
                      <input
                        type="password"
                        placeholder="Enter your password"
                        className="bg-black bg-opacity-70 rounded-sm mx-5 my-5  mt-3 w-80 h-12 indent-3"
                      />

                      {/* submit button */}
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-80 rounded-sm mb-10"
                      >
                        Sign In
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
      </div>
    </div>
  );
};

export default Login;
