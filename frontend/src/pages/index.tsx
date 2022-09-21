import React, { useState } from "react";
import { useRouter } from "next/router";
import Loader from "../components/loading";
import "../styles/index.module.css";
import SideBar from "../components/sidebar";
const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("Rithul");
  const greetings = ["How are you doing today?",  "Pick something to watch...", "Are you feeling lucky?", "Dazzling categories..."]
  const router = useRouter();
  const validate = async () => {

    fetch("http://localhost:3001/auth/validate", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setLoading(false);
        } else {
          router.push("/login");
        }
      });

    fetch("http://localhost:3001/auth/user", {
      method: "GET",
      credentials: "include",
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 200) {
        setUser(JSON.parse(data.user).name.split(" ")[0]);
      }
    })
  
  };

  if (loading) {
    validate();
    return <Loader />;
  }
  return (
    <div className="h-screen w-screen flex">
      <SideBar />
      <div className="b-cont w-screen h-screen bg-gray-700 ">
        <div className="ml-24 h-screen">
            <div className="pt-[3em] pl-[1em] text-[100px] font-black">Welcome, {user}!</div>
            <div className="p-5 pl-[3em] text-[35px] font-light">{greetings[Math.floor(Math.random() * greetings.length)]}</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
