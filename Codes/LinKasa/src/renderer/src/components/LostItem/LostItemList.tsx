import { db } from "@renderer/config/firebase";
import LostAndFound from "@renderer/model/LostAndFound";
import { deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useUserAuth } from "@renderer/library/UserAuthContext";
import { lostAndFoundCollection } from "@renderer/library/Collection";
import { toast , ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LostItemList() {
  const [lostItemData, setLostItemData] = useState<LostAndFound[]>([]);
  const { roles } = useUserAuth();

  useEffect(() => {
    const unsubscribe = onSnapshot(lostAndFoundCollection, (snapshot) => {
      const updatedData = snapshot.docs.map(doc => {
        const data = doc.data();
        const lostItem: LostAndFound = {
          id : doc.id,
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
      case 'lost':
        return 'text-red-600';
      case 'unclaimed':
        return 'text-yellow-500';
      case 'returned to owner':
        return 'text-green-600';
      default:
        return '';
    }
  };

  const handleFoundButtonClick = async(itemId) => {
    const foundItem = lostItemData.find((item) => item.id === itemId);

    if (foundItem) {
      const updatedItem = { ...foundItem, status: "unclaimed" };

      setLostItemData((prevData) =>
        prevData.map((item) => (item.id === itemId ? updatedItem : item))
      );

      try {
        const itemRef = doc(db, "LostAndFound", itemId);
        await updateDoc(itemRef, { status: "unclaimed" });
        toast.success('🧢 Status Updated!', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } catch (error) {
        toast.error('🧢 Failed to update Status!', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };

  const handleReturnedButtonClick = async(itemId) => {
    const foundItem = lostItemData.find((item) => item.id === itemId);

    if (foundItem) {
      const updatedItem = { ...foundItem, status: "returned to owner" };

      setLostItemData((prevData) =>
        prevData.map((item) => (item.id === itemId ? updatedItem : item))
      );

      try {
        const itemRef = doc(db, "LostAndFound", itemId);
        await updateDoc(itemRef, { status: "returned to owner" });
        toast.success('🧢 Status Updated!', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } catch (error) {
        toast.error('🧢 Failed to update Status!', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };

  const handleRemoveButtonClick = async(itemId) => {
    try {
      const itemRef = doc(db, "LostAndFound", itemId);
      await deleteDoc(itemRef);
      toast.success('🧢 Item Deleted!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      toast.error('🧢 Failed to update Status!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };


  const buildDiv = (data: LostAndFound) => {
    return (
      <div className="border p-5 mb-5 bg-white relative h-28 w-full rounded-md flex flex-row items-center" key={data.id}>
        <img src={data.photoUrl} className="w-20 h-20 object-cover rounded-md" alt="" />
        <div className="flex flex-col ml-5">
          <p className="font-semibold text-xl">{data.description}</p>
          <p className={`font-semibold text-xl ${getStatusColor(data.status)}`}>
            {data.status}
          </p>
        </div>
        <div className="absolute bottom-1 right-1 flex flex-row">
        {roles === "Lost and Found Staff" && (
          (data.status === "unclaimed" && (
            <button
            onClick={() => handleReturnedButtonClick(data.id)}
            className="font-semibold rounded-md w-40 border bg-green-600 p-2 text-white">
              Returned
            </button>
          )) ||
          (data.status === "returned to owner" && (
            <button
            onClick={() => handleRemoveButtonClick(data.id)}
            className="font-semibold rounded-md w-40 border bg-red-600 p-2 text-white">
              Remove
            </button>
          ))
        )}
        {data.status === "lost" && (
        <button
          onClick={() => handleFoundButtonClick(data.id)}
          className="font-semibold rounded-md w-40 border bg-yellow-600 p-2 text-white">Found</button>
        )}
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
    <ToastContainer />
    </>
  )
}

export default LostItemList;
