import { Link } from "react-router-dom";

function CivilEngineeringManagerComponent(){
  return(
    <>
    <Link to="/requestBudget">
      <button className="w-36 h-10 bg-white rounded-md mt-5">
        Request Budget
      </button>
    </Link>
    <Link to = "/budgetList">
      <button className="w-36 h-12 bg-white rounded-md mt-5">
        View Request Budget
      </button>
    </Link>
    </>
  )
}

export default CivilEngineeringManagerComponent;
