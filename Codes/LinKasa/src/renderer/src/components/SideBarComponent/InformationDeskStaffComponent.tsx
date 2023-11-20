import { Link } from "react-router-dom";

function InformationDeskStaffComponent(){
  return(
    <>
    <Link to="/viewTerminalMaps">
      <button className="w-36 h-10 bg-white rounded-md mt-5">
        View Terminal Maps
      </button>
    </Link>
    <Link to="/viewFlightSchedule">
      <button className="w-36 h-12 bg-white rounded-md mt-5">
        View Flight Schedule
      </button>
    </Link>
    </>
  )
}

export default InformationDeskStaffComponent;
