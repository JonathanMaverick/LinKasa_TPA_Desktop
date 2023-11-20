import { Link } from "react-router-dom";

function PassengerComponent()
{
  return (
    <>
    <Link to="/viewJobVacancy">
      <button className="w-36 h-10 bg-white rounded-md mt-5">
        View Vacancy
      </button>
    </Link>
    </>
    )
}

export default PassengerComponent;
