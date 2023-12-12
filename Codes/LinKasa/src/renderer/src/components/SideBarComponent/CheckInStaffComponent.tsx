import { Link } from "react-router-dom";

function CheckInStaffComponent(){
  return(
    <>
    <Link to="/createBoardingPass ">
      <button className="w-36 h-12 bg-white rounded-md mt-5">
        Create Boarding Pass
      </button>
    </Link>
    <Link to="/viewBoardingPass ">
      <button className="w-36 h-10 bg-white rounded-md mt-5">
        View Boarding Pass
      </button>
    </Link>
    </>
  )
}

export default CheckInStaffComponent;
