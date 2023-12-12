import SideBar from "@renderer/components/SideBar";
import CreateCrewForm from "@renderer/components/Crew/CreateCrewForm";

function CreateCrew() {
  return (
    <div className="flex flex-row">
      <SideBar />
      <CreateCrewForm />
    </div>
  )
}

export default CreateCrew;
