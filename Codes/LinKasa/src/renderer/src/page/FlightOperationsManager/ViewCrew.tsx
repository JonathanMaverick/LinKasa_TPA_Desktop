import CrewList from "@renderer/components/Crew/CrewList";
import SideBar from "@renderer/components/SideBar";

function ViewCrew()
{
  return (
      <>
        <div className='bg-sky-200 flex'>
          <SideBar />
          <CrewList />
        </div>
      </>
  );
}

export default ViewCrew;
