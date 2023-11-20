import VacancyForm from "@renderer/components/Passenger/VacancyForm"
import SideBar from "@renderer/components/SideBar"

function OpenJobVacancy(){
  return(
    <>
    <div className='flex'>
      <SideBar />
      <VacancyForm />
    </div>
    </>
  )
}

export default OpenJobVacancy
