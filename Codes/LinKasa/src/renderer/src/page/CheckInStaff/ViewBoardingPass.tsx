import BoardingPassList from "@renderer/components/BoardingPass/BoardingPassList";
import SideBar from "@renderer/components/SideBar";

function ViewBoardingPass()
{
    return (
      <div className="flex flex-row">
          <SideBar />
          <BoardingPassList />
        </div>
    );
}

export default ViewBoardingPass;
