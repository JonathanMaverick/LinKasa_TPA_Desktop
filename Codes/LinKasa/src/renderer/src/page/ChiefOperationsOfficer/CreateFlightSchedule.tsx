import SideBar from "../../components/SideBar";
import FlightScheduleForm from "../../components/FlightSchedule/FlightScheduleForm";

function CreateFlightSchedule(){
    return (
      <div className="flex flex-row">
        <SideBar />
        <FlightScheduleForm />
      </div>
    )
}

export default CreateFlightSchedule;
