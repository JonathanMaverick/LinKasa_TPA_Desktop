import { db } from "@renderer/config/firebase";
import Budget from "@renderer/model/Budget";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function ReviseBudget() {

  const initialBudget : Budget = {
    id : '',
    overview : '',
    description : '',
    cost : 0,
    status : ''
  }

  const { budgetId } = useParams();
  const [budget, setBudget] = useState<Budget>(initialBudget);
  const [error, setError]= useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBudgetData = async () => {
      if (!budgetId) {
        return;
      }
      const budgetDocRef = doc(db, 'Budget', budgetId);
      const budgetDocSnapshot = await getDoc(budgetDocRef);

      if (budgetDocSnapshot.exists()) {
        const budgetData = budgetDocSnapshot.data() as Budget;
        setBudget(budgetData);
      }
    };

    fetchBudgetData();
  }, []);

  const updateBudget = async (e) =>{
    e.preventDefault();
    if(!budgetId){
      return;
    }

    if  (!budget.overview || !budget.cost || !budget.description) {
      setError("Please fill all the fields")
      return;
    }

    try{
      const budgetDocRef = doc(db, 'Budget', budgetId)

      setDoc(budgetDocRef, {
        overview : budget.overview,
        cost : budget.cost,
        description : budget.description,
        status : 'revise'
      });
      navigate(`/detailBudgetList/${budgetId}`);
    }catch{
      setError('Error updating employee');
      return;
    }

  }

  return(
    <>
      <div className="bg-sky-200 flex flex-col max-h-full min-h-screen justify-center items-center w-full overflow-y-auto">
        <h1 className="text-3xl font-bold">Request Budget</h1>
        <form action="" onSubmit={updateBudget} className="flex flex-col mt-5 w-6/12 gap-2">
        <label htmlFor="projectOverview">Project Overview</label>
        <input id="projectOverview"
          placeholder='Project overview'
          className="border p-2 rounded-lg focus:outline-none"
          type="text"
          value={budget.overview}
          onChange={(e) => setBudget({ ...budget, overview: e.target.value })}
          disabled
          />
        <label htmlFor="cost">Cost</label>
        <input id="cost"
          placeholder='Project estimated cost'
          className="border p-2 rounded-lg focus:outline-none"
          type="number"
          value={budget.cost.toString()}
          onChange={(e) => setBudget({ ...budget, cost: Number(e.target.value) })}
        />
        <label htmlFor="description">Project Description</label>
        <textarea
          id="description"
          rows={6}
          className="p-2 resize-none"
          value={budget.description}
          onChange={(e) => setBudget({ ...budget, description: e.target.value })}
        ></textarea>
        <p className="pt-2 font-bold text-red-400">{error}</p>
        <button type="submit" className="p-2 my-5 rounded-md bg-cyan-700 text-white hover:bg-cyan-900"> Revise Budget </button>
        </form>
        <ToastContainer />
      </div>
    </>
  )

}

export default ReviseBudget;
