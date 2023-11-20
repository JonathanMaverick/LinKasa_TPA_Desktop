import { Link } from "react-router-dom";

function ChiefFinancialOfficerComponent(){
  return(
    <>
    <Link to="/budgetList">
      <button className="w-36 h-12 bg-white rounded-md mt-5">
        View Request Budget
      </button>
    </Link>
    </>
  )
}

export default ChiefFinancialOfficerComponent;
