import React, { useEffect } from "react";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/router";
import Image from "next/image";

const Verify: React.FC = () => {
  const router = useRouter();
  const code = router.query.code;
  if (router.query.code) {
    setCookie("code", code, { path: "/verify" });
    router.push("/verify");
  }

  if (getCookie("code")) {
    fetch(`http://localhost:3001/auth/verify/${getCookie("code")}`, {
      method: "POST",
      credentials: "include",
    })
    .then(r => r.json())
    .then(data => {
      if (data.status === 400 || data.status === 200) {
        deleteCookie("code");

      } 

      router.push("/login")
    })
    ;
  }

  return (
    <div>
      <div className="h-screen w-screen loginBackground">
        <div className="loginLayer">{code}</div>
        <Image src={"/Mail.svg"} layout={"fill"}/>
      </div>
    </div>
  );
};

export default Verify;
