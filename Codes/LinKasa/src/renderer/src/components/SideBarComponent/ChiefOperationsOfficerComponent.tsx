import { Link } from "react-router-dom";

function ChiefOperationsOfficerComponent(){
  return(
    <>
    <Link to="/viewFlightSchedule">
      <button className="w-36 h-12 bg-white rounded-md mt-5">
        View Flight Schedule
      </button>
    </Link>
    </>
  )
}

export default ChiefOperationsOfficerComponent;
