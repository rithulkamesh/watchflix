import React from "react";
import Image from 'next/image';

const Home: React.FC = () => {
  return (
    <div>
      <Image src="/logo-white.svg" alt="logo" width={200} height={200} />
    </div>
  )
}

export default Home