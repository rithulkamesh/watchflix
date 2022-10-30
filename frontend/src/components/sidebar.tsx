import React from "react";
import { FaTv } from "react-icons/fa";
import { FiLogOut, FiHome } from "react-icons/fi";

const SideBar: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 h-screen w-24 flex flex-col bg-gray-900 text-white shadow-lg justify-center">
      <div>
        <SideBarIcon icon={<FiHome size="35" />} tooltip={"Home"} />
        <SideBarIcon icon={<FaTv size="35" />} tooltip={"Watch"} />
        <a href="/logout">
          <SideBarIcon icon={<FiLogOut size="35" />} tooltip={"Logout"} />
        </a>
      </div>
    </div>
  );
};

const SideBarIcon: React.FC<SideBarIconProps> = ({
  icon,
  tooltip = "Tooltip",
  main=false
}: SideBarIconProps) => {
  return (
    <div className={`sidebar-icon  group`}>
      {icon}
      <span className="sidebar-tooltip group-hover:scale-100">{tooltip}</span>
    </div>
  );
};

interface SideBarIconProps {
  icon: React.ReactNode;
  tooltip: string;
  main?: boolean;
}
export {SideBar, SideBarIcon};