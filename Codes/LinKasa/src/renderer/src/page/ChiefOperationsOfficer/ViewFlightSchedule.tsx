import SideBar from "@renderer/components/SideBar";
import FlightScheduleList from "@renderer/components/FlightSchedule/FlightScheduleList";

function ViewFlightSchedule(){
  return (
    <div className="flex flex-row">
      <SideBar />
      <FlightScheduleList />
    </div>
  );
}

export default ViewFlightSchedule;
