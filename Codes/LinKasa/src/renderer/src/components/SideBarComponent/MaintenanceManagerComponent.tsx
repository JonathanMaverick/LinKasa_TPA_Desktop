import { Link } from "react-router-dom";

function MaintenanceManagerComponent(){
  return(
    <>
      <Link to="/insertMaintenanceSchedule">
        <button className="w-36 h-12 bg-white rounded-md mt-5">
          Insert Maintenance Schedule
        </button>
      </Link>
      <Link to="/viewMaintenanceSchedule">
        <button className="w-36 h-12 bg-white rounded-md mt-5">
          View Maintenance Schedule
        </button>
      </Link>
    </>

  )
}
export default MaintenanceManagerComponent;
