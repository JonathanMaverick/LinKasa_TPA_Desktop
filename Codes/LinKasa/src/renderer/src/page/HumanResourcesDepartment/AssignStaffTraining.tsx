import SideBar from "@renderer/components/SideBar"
import TrainingForm from "@renderer/components/Training/TrainingForm"

function AssignStaffTraining(){
    return (
      <div className='bg-sky-200 flex'>
        <SideBar />
        <TrainingForm />
      </div>
    )
}

export default AssignStaffTraining
