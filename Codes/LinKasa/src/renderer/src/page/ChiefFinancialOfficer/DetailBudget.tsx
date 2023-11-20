import SideBar from "@renderer/components/SideBar";
import { db } from "@renderer/config/firebase";
import { useUserAuth } from "@renderer/library/UserAuthContext";
import Budget from "@renderer/model/Budget";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function DetailBudget()
{
  const { roles } = useUserAuth();
  const intialBudget : Budget = {
    id : '',
    overview : '',
    description : '',
    cost : 0,
    status : ''
  }

  const { budgetId } = useParams();
  const [budget, setBudget] = useState<Budget>(intialBudget);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        if (!budgetId) {
          return;
        }
        const budgetDocRef = doc(db, 'Budget', budgetId);
        const budgetDocSnapshot = await getDoc(budgetDocRef);

        if (budgetDocSnapshot.exists()) {
          const budgetData = budgetDocSnapshot.data() as Budget;
          setBudget(budgetData);
        }
      } catch (error) {
      }
    };

    fetchBudgetData();
  }, []);

  const handleRevise = () => {
    navigate(`/reviseBudget/${budgetId}`);
  };

  const rejectBudget = async () => {
    if (!budgetId) {
      return;
    }
    try {
      const budgetDocRef = doc(db, 'Budget', budgetId);
      await updateDoc(budgetDocRef, { status: 'rejected' });
      navigate('/budgetList');
    } catch (error) {

    }
  };

  const approveBudget= async () => {

    if (!budgetId) {
      return;
    }
    try {
      const budgetDocRef = doc(db, 'Budget', budgetId);
      await updateDoc(budgetDocRef, { status: 'approved' });
      navigate('/budgetList');
    } catch (error) {

    }
  };

  const removeBudget = async () => {
    if (!budgetId) {
      return;
    }
    try {
      const budgetDocRef = doc(db, 'Budget', budgetId);
      await deleteDoc(budgetDocRef);
      navigate('/budgetList');
    } catch (error) {

    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-300';
      case 'revise':
        return 'text-orange-500';
      case 'rejected':
        return 'text-red-600';
      case 'approved':
          return 'text-green-600';
      default:
        return '';
    }
  };

  return (
    <>
    <div className='flex bg-sky-200 w-full'>
      <SideBar />
      <div className="bg-sky-200 flex flex-col min-h-screen justify-center items-center w-full overflow-y-auto">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4">{budget.overview}</h1>
          <p className={`text-xl font-semibold ${getStatusColor(budget.status)}`}>
            {budget.status}
          </p>
          <div className="mt-2">
            <p className="text-lg font-semibold">Rp. {budget.cost}</p>
          </div>
          <p className="mt-4">{budget.description}</p>
        </div>
      </div>
        <div className="fixed bottom-1 right-1 flex flex-row gap-2">
        {roles === 'Chief Financial Officer (CFO)' && budget.status === "pending" && (
          <>
            <button onClick={approveBudget} className="font-semibold rounded-md w-40 border bg-green-700 text-white p-2">Approve Budget</button>
            <button onClick={rejectBudget} className="font-semibold rounded-md w-40 border bg-red-600 text-white p-2">Reject Budget</button>
            <button onClick={handleRevise} className="font-semibold rounded-md w-40 border bg-yellow-600 text-white p-2">Revise Budget</button>
          </>
        )}
        {roles === 'Civil Engineering Manager' && ['approved', 'rejected', 'revise'].includes(budget.status) && (
          <>
            <button onClick={removeBudget}className="font-semibold rounded-md w-40 border bg-red-700 text-white p-2">Remove Button</button>
          </>
        )}
        </div>
    </div>
    </>
  );
}

export default DetailBudget;
