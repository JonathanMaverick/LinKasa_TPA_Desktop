import Budget from "@renderer/model/Budget";
import { onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { budgetCollection } from "@renderer/library/Collection";

function budgetList() {
  const [budgetData, setBudget] = useState<Budget[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(budgetCollection, (snapshot) => {
      const updatedData = snapshot.docs.map(doc => {
        const data = doc.data();
        const budget: Budget = {
          id : doc.id,
          overview : data.overview,
          description : data.description,
          cost : data.cost,
          status : data.status
        };
        return budget;
      });

      setBudget(updatedData);
    });

    return () => {
      unsubscribe();
    };
  },[]);

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

  const handleViewDetail = (id) => {
    navigate(`/detailBudgetList/${id}`);
  };

  const buildDiv = (data: Budget) => {
    return (
      <div className="border p-5 mb-5 bg-white relative h-28 w-full rounded-md flex flex-row items-center" key={data.id}>
        <div className="flex flex-col ml-5">
          <p className="font-bold text-xl">{data.overview}</p>
          <p className="font-semibold text">Rp. {data.cost}</p>
          <p className={`font-semibold text ${getStatusColor(data.status)}`}>
            {data.status}
          </p>
        </div>
            <button className="absolute bottom-1 font-semibold rounded-md right-1 w-40 border bg-red-600 p-2" onClick={() => handleViewDetail(data.id)}>View Detail</button>
      </div>
    )
  };

  return (
    <>
    <div className="bg-sky-200 flex flex-col max-h-full min-h-screen justify-center items-center w-full overflow-y-auto">
      <h1 className="text-3xl font-bold my-10">View Budget List</h1>
      <div className="bg-sky-200 mt-5 w-9/12">
        {budgetData.map((budget) => buildDiv(budget))}
      </div>
    </div>
    </>
  )
}

export default budgetList;
