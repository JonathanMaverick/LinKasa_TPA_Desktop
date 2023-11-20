import SideBar from "@renderer/components/SideBar"
import TaskForm from "@renderer/components/Task/TaskForm"

function AddTask(){
  return (
    <>
    <div className='bg-sky-200 flex'>
      <SideBar />
      <TaskForm />
    </div>
    </>
  )
}

export default AddTask;
