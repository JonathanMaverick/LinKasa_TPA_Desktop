import { Link } from "react-router-dom";

function GroundHandlingManagerComponent(){
  return(
    <>
    <Link to="/addTask">
      <button className="w-36 h-10 bg-white rounded-md mt-5">
        Add Task
      </button>
    </Link>
    <Link to="/viewTask">
      <button className="w-36 h-10 bg-white rounded-md mt-5">
        View Task
      </button>
    </Link>
    </>
  )
}

export default GroundHandlingManagerComponent;
