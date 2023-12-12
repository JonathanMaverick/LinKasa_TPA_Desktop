import CrewMember from "./CrewMember";

interface Crew {
  id : string;
  crewName: string;
  pilot1: CrewMember;
  pilot2: CrewMember;
  attendants: CrewMember[];
}

export default Crew
