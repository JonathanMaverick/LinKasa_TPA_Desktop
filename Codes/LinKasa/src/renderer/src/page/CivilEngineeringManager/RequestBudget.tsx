import SideBar from "@renderer/components/SideBar";
import RequestBudgetForm from "@renderer/components/Budget/RequestBudgetForm";

function RequestBudget(){
  return (
    <>
    <div className='bg-sky-200 flex'>
      <SideBar />
      <RequestBudgetForm />
    </div>
    </>
  )
}

export default RequestBudget;
