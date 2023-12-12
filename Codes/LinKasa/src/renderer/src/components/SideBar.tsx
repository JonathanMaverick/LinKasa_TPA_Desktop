import { useUserAuth } from "@renderer/library/UserAuthContext";
import arrow from "../../../../resources/arrow.png"
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../../resources/icon_nobg.png"
import HRDComponent from "./SideBarComponent/HRDComponent";
import LostAndFoundComponent from "./SideBarComponent/LostAndFoundComponent";
import StaffComponent from "./SideBarComponent/StaffComponent";
import ChiefOperationsOfficerComponent from "./SideBarComponent/ChiefOperationsOfficerComponent";
import InformationDeskStaffComponent from "./SideBarComponent/InformationDeskStaffComponent";
import CivilEngineeringManagerComponent from "./SideBarComponent/CivilEngineeringManagerComponent";
import ChiefFinancialOfficerComponent from "./SideBarComponent/ChiefFinancialOfficerComponent";
import MaintenanceManagerComponent from "./SideBarComponent/MaintenanceManagerComponent";
import GroundHandlingManagerComponent from "./SideBarComponent/GroundHandlingManagerComponent";
import PassengerComponent from "./SideBarComponent/PassengerComponent";
import FlightOperationManager from "./SideBarComponent/FlightOperationManagerComponent";
import GroundHandlingStaffComponent from "./SideBarComponent/GroundHandlingStaffComponent";
import { auth } from "@renderer/config/firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import CheckInStaffComponent from "./SideBarComponent/CheckInStaffComponent";

function SideBar()
{
  const { username , roles , logout } = useUserAuth();
  const [open, setOpen] = useState(true);

  const isHRD = roles === "Human Resources Director";
  const isLostAndFoundStaff = roles === "Lost and Found Staff";
  const isCOO = roles === "Chief Operation Officer (COO)";
  const isInformationDeskStaff = roles === "Information Desk Staff";
  const isCivilEngineeringManager = roles === "Civil Engineering Manager";
  const isChiefFinancialOfficer = roles === "Chief Financial Officer (CFO)";
  const isMaintenanceManager = roles === "Maintenance Manager";
  const isGroundHandlingManager = roles === "Ground Handling Manager";
  const isGroundHandlingStaff = roles === "Ground Handling Staff";
  const isFlightOperationsManager = roles === "Flight Operations Manager";
  const isCheckInStaff = roles === "Check-in Staff";
  const isNotPassenger = roles !== "Passenger";
  const isPassenger = roles === "Passenger";

  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const goToUserProfile = () => {
    if (user) {
      const userUid = user.uid;
      navigate(`/user/${userUid}`);
    }
  };

  return(
    <>
    <div className={`bg-sky-300 ${open ? "w-52" : "w-0 p-0"} relative duration-700`}>
      <img
        src={arrow}
        className={`bg-white rounded-full w-8 cursor-pointer absolute -right-8 top-0 ${
          open ? "rotate-180 p-0" : "w-20 rotate-0 p-10"
        }`}
        onClick={() => {
          setOpen(!open);
        }}
        alt=""
      />
      <div className={`${open ? "flex justify-center items-center flex-col" : "hidden"}`}>
        <Link to="/home">
          <img src={logo} alt="" className="w-32" />
        </Link>
        {isHRD && <HRDComponent />}
        {isLostAndFoundStaff && <LostAndFoundComponent />}
        {isCOO && <ChiefOperationsOfficerComponent />}
        {isInformationDeskStaff && <InformationDeskStaffComponent />}
        {isCivilEngineeringManager && <CivilEngineeringManagerComponent />}
        {isChiefFinancialOfficer && <ChiefFinancialOfficerComponent />}
        {isMaintenanceManager && <MaintenanceManagerComponent />}
        {isGroundHandlingManager && <GroundHandlingManagerComponent />}
        {isFlightOperationsManager && <FlightOperationManager />}
        {isCheckInStaff && <CheckInStaffComponent />}
        {isGroundHandlingStaff && <GroundHandlingStaffComponent />}
        {isNotPassenger && <StaffComponent />}
        {isPassenger && <PassengerComponent />}
      </div>
      <div
        className={`${open ? "flex-col" : "hidden"} flex bg-white absolute justify-center items-center bottom-0 duration-700 rounded-t-lg w-full`}
        >
        <p className="text-center font-bold mt-2">Hello, {username}!</p>
        <p className="text-center font-bold mb-3">{roles}</p>
        <button
          onClick={goToUserProfile}
          className="bg-yellow-500 mb-3 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          View Profile
        </button>
        <button
          onClick={logout}
          className="bg-red-500 mb-3 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
    </div>
    </>
  )
}

export default SideBar;
