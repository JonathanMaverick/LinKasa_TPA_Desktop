import ApplicantList from "@renderer/components/Applicant/ApplicantList";
import SideBar from "@renderer/components/SideBar";

function ViewApplicant(){
  return(
    <div className="flex bg-blue-200">
      <SideBar />
      <ApplicantList />
    </div>
  );
}

export default ViewApplicant;
