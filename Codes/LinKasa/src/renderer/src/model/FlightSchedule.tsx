
interface FlightSchedule {
  id : string;
  airplaneID : string;
  boardingTime : string;
  arrivalTime : string;
  pointsOrigin : string;
  pointsDestination : string;
  status: string,
  crewId: string,
}

export default FlightSchedule;
