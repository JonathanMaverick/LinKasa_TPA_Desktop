import SideBar from "@renderer/components/SideBar";
import MaintenanaceScheduleList from "@renderer/components/MaintenanceSchedule/MaintenanceScheduleList";

function ViewMaintenanceSchedule() {
  return(
    <div className="flex bg-sky-200">
      <SideBar />
      <MaintenanaceScheduleList />
    </div>
  )
}

export default ViewMaintenanceSchedule;
