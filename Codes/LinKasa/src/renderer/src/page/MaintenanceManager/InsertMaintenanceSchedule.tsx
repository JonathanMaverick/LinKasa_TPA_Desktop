import SideBar from "@renderer/components/SideBar";
import MaintenanceScheduleForm from "@renderer/components/MaintenanceSchedule/MaintenanceScheduleForm";

function InsertMaintenanceSchedule()
{
  return(
    <>
    <div className="flex bg-sky-200 h-screen">
      <SideBar />
      <MaintenanceScheduleForm />
    </div>
    </>
  )
}

export default InsertMaintenanceSchedule;
