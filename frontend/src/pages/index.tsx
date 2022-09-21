import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Loader from "../components/loading";

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);
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
      })
      };

  if (loading) {
    validate();
    return <Loader />;
  }
  return (
    <div className="text-black">
      <Image src="/logo-blue.svg" alt="logo" width={60} height={60} />
      <br />
      Successfully Logged in!
      <br />
      Valid Session
    </div>
  );
};

export default Home;
