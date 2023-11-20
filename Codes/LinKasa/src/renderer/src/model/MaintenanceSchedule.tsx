import User from "./User";

interface MaintenanceSchedule {
  id : string;
  type : string;
  equipment : string;
  startDate : string;
  endDate : string;
  status : string;
  staff : User;
}

export default MaintenanceSchedule;
