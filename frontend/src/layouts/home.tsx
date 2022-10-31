import React from 'react'
import { SideBar } from '../components/sidebar'

type Props = {
    children: React.ReactNode
    title: string
}

const HomeLayout = (props: Props) => {
  return (
    <div className="h-screen w-screen flex">
    <SideBar />
    <div className="b-cont w-screen h-screen bg-gray-700 ">
        <div className="ml-24 h-screen">
            <div className="pt-[1em] pl-[1em] text-[60px] font-black">
                {props.title}
            </div>
            {props.children}
        </div>
    </div>
</div>
  )
}

export default HomeLayout