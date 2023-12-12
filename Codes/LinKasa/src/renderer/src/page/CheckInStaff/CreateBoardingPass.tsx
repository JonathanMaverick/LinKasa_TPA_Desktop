import BoardingPassForm from "@renderer/components/BoardingPass/BoardingPassForm";
import SideBar from "@renderer/components/SideBar";

function CreateBoardingPass()
{
  return (
    <div className="flex flex-row">
      <SideBar />
      <BoardingPassForm />
    </div>
  )
}

export default CreateBoardingPass;
