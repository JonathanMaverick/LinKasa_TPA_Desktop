import SideBar from "@renderer/components/SideBar";
import TrainingList from "@renderer/components/Training/TrainingList";

function ViewTraining(){
  return (
    <div className='bg-sky-200 flex'>
      <SideBar />
      <TrainingList />
    </div>
  );
}

export default ViewTraining;
