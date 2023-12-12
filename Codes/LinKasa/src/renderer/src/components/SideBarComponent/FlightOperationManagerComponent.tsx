import { Link } from "react-router-dom";

function FlightOperationManager()
{
    return (
      <>
        <Link to="/createFlightSchedule">
          <button className="w-36 h-12 bg-white rounded-md mt-5">
            Create Flight Schedule
          </button>
        </Link>
        <Link to="/viewFlightSchedule">
          <button className="w-36 h-12 bg-white rounded-md mt-5">
            View Flight Schedule
          </button>
        </Link>
        <Link to="/createCrew">
          <button className="w-36 h-10 bg-white rounded-md mt-5">
            Create Crew
          </button>
        </Link >
        <Link to="/viewCrew">
          <button className="w-36 h-10 bg-white rounded-md mt-5">
            View Crew
          </button>
        </Link>
      </>
    );
}

export default FlightOperationManager;
