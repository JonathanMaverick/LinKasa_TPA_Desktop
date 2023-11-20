import SideBar from "@renderer/components/SideBar";
import BudgetList from "@renderer/components/Budget/BudgetList";

function ViewRequestBudget()
{
    return (
      <div className='bg-sky-200 flex'>
        <SideBar />
        <BudgetList />
      </div>
    );
}

export default ViewRequestBudget;
