import { Link } from "react-router-dom";

function StaffComponent(){
  return(
    <Link to="/viewLostItem">
      <button className="w-36 h-10 bg-white rounded-md mt-5">
        View Lost Item
      </button>
    </Link>
  )
}
export default StaffComponent;
