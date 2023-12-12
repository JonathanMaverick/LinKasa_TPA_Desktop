import { Link } from "react-router-dom";

function StaffComponent(){
  return(
    <>
    <Link to="/chat">
      <button className="w-36 h-10 bg-white rounded-md mt-5">
        View Chat
      </button>
    </Link>
    <Link to="/viewTraining">
      <button className="w-36 h-10 bg-white rounded-md mt-5">
        View Training
      </button>
    </Link>
    </>
  )
}
export default StaffComponent;
