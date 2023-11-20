import SideBar from "@renderer/components/SideBar";
import VacancyList from "@renderer/components/Passenger/VacancyList";

function ViewVacancy()
{
  return(
    <>
    <div className="flex">
      <SideBar />
      <VacancyList />
    </div>
    </>
  )
}

export default ViewVacancy;
