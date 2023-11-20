import SideBar from "@renderer/components/SideBar";
import TaskList from "@renderer/components/Task/TaskList";

function AssignTask(){
  return (
    <>
    <div className='bg-sky-200 flex'>
      <SideBar />
      <TaskList />
    </div>
    </>
  )
}

export default AssignTask;

