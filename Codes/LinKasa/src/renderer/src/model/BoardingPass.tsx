import FlightSchedule from "./FlightSchedule";
import User from "./User";

interface BoardingPass {
  id : string;
  flightScheduleID : string;
  passengerID : string;
  seat : string,
  gate: string,
  terminal : string
  userData?: User;
  flightData? : FlightSchedule;
}

export default BoardingPass;
