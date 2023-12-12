import LostAndFound from "@renderer/model/LostAndFound";
import { onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { lostAndFoundCollection } from "@renderer/library/Collection";
import { useNavigate } from "react-router-dom";

function LostItemList() {
  const [lostItemData, setLostItemData] = useState<LostAndFound[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(lostAndFoundCollection, (snapshot) => {
      const updatedData = snapshot.docs.map(doc => {
        const data = doc.data();
        const lostItem: LostAndFound = {
          id : doc.id,
          overview: data.overview || '',
          description: data.description || '',
          photoUrl: data.photoUrl || '',
          status: data.status || '',
        };
        return lostItem;
      });

      setLostItemData(updatedData);
    });

    return () => {
      unsubscribe();
    };
  },[]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'unclaimed':
        return 'text-yellow-500';
      case 'returned to owner':
        return 'text-green-600';
      default:
        return '';
    }
  };

  const handleUpdateButtonClick = async(itemId) => {
    navigate(`/updateLostItem/${itemId}`);
  }

  const buildDiv = (data: LostAndFound) => {
    return (
      <div className="border p-5 mb-5 bg-white relative h-28 w-full rounded-md flex flex-row items-center" key={data.id}>
        <img src={data.photoUrl} className="w-20 h-20 object-cover rounded-md" alt="" />
        <div className="flex flex-col ml-5">
          <p className="font-semibold text-xl">{data.overview}</p>
          <p className={`font-semibold text-xl ${getStatusColor(data.status)}`}>
            {data.status}
          </p>
        </div>
        <div className="absolute bottom-1 right-1 flex flex-row">
        <button
        onClick={() => handleUpdateButtonClick(data.id)}
        className="font-semibold rounded-md w-28 border bg-yellow-600 p-2 mr-2 text-white">
          Update
        </button>
        </div>
      </div>
    )
  };

  return (
    <>
    <div className="bg-sky-200 flex flex-col max-h-full min-h-screen justify-center items-center w-full overflow-y-auto">
      <h1 className="text-3xl font-bold my-10">View Lost Item</h1>
      <div className="bg-sky-200 mt-5 w-9/12">
        {lostItemData.map((item) => buildDiv(item))}
      </div>
    </div>
    </>
  )
}

export default LostItemList;
