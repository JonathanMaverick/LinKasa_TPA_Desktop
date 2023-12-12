import { Link } from "react-router-dom";

function HRDComponent(){
  return(
    <>
    <Link to="/addEmployee">
      <button className="w-36 h-10 bg-white rounded-md mt-5">
        Add Employee
      </button>
    </Link>
    <Link to="/viewEmployee">
      <button className="w-36 h-10 bg-white rounded-md mt-5">
        View Employee
      </button>
    </Link>
    <Link to="/openJobVacancy">
      <button className="w-36 h-10 bg-white rounded-md mt-5">
        Create Job Vacancy
      </button>
    </Link>
    <Link to="/viewJobVacancy">
      <button className="w-36 h-10 bg-white rounded-md mt-5">
        View Vacancy
      </button>
    </Link>
    <Link to="/viewApplicant">
      <button className="w-36 h-10 bg-white rounded-md mt-5">
        View Applicant
      </button>
    </Link>
    <Link to="/assignStaffTraining">
      <button className="w-36 h-10 bg-white rounded-md mt-5">
        Assign Staff Training
      </button>
    </Link>
    </>
  )
}

export default HRDComponent;
