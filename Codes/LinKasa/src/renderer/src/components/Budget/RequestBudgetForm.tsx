import { useRef, useState } from "react";
import Budget from "@renderer/model/Budget"
import { addDoc } from "firebase/firestore";
import { budgetCollection } from "../../library/Collection";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RequestBudgetForm()
{

  const initialBudget : Budget = {
    id : "",
    overview : "",
    description : "",
    cost : 0,
    status : ""
  }

  const formRef = useRef<HTMLFormElement | null>(null);
  const [error, setError] = useState("");
  const [budget, setBudget] = useState<Budget>(initialBudget);

  const handleBudget = async (e) => {
    e.preventDefault();

    if (budget.overview === "" || budget.description === "" || budget.cost === 0) {
      setError('Please fill all the fields');
      return;
    }

    if(budget.cost < 0){
      setError('Please insert a valid price');
      return;
    }

    try{

      await addDoc(budgetCollection, {
        overview : budget.overview,
        description : budget.description,
        cost : budget.cost,
        status : 'pending'
      })
      toast.success('💰 Budget Requested!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }catch{
      setError('Failed to add flight schedule');
    }

    if (formRef.current) {
      formRef.current.reset();
    }
    setError('');
    setBudget(initialBudget);
  }

  return(
    <>
      <div className="bg-sky-200 flex flex-col max-h-full min-h-screen justify-center items-center w-full overflow-y-auto">
        <h1 className="text-3xl font-bold">Request Budget</h1>
        <form action="" onSubmit={handleBudget} className="flex flex-col mt-5 w-6/12 gap-2">
        <label htmlFor="projectOverview">Project Overview</label>
        <input id="projectOverview"
          placeholder='Project overview'
          className="border p-2 rounded-lg focus:outline-none"
          type="text"
          value={budget.overview}
          onChange={(e) => setBudget({ ...budget, overview: e.target.value })}
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
        <button type="submit" className="p-2 my-5 rounded-md bg-cyan-700 text-white hover:bg-cyan-900"> Request Budget </button>
        </form>
        <ToastContainer />
      </div>
    </>
  )
}

export default RequestBudgetForm;
