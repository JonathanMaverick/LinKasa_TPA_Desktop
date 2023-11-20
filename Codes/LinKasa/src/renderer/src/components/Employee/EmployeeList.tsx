import { db } from "@renderer/config/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

import User from "@renderer/model/User";
import { useNavigate } from "react-router-dom";

function EmployeeList() {
  const [userData, setUserData] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const updatedData = snapshot.docs.map(doc => {
        const data = doc.data();
        const user: User = {
          documentId: doc.id,
          name: data.name || '',
          roles : data.roles || '',
          birthdate: data.birthdate || '',
          profilePicture: data.profilePicture || '',
          email: data.email || '',
        };
        return user;
      });

      setUserData(updatedData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleViewDetail = (id) => {
    navigate(`/user/${id}`);
  };

  const buildDiv = (data) => {
    return (
      <div className="border p-5 mb-5 bg-white relative h-28 w-full rounded-md flex flex-row items-center" key={data.documentId}>
        <img src={data.profilePicture} className="w-20 h-20 object-cover rounded-full" alt="" />
        <div className="flex flex-col ml-5">
          <p className="font-semibold text-2xl">{data.name}</p>
          <p className="font-bold">{data.roles}</p>
          <p>{data.email}</p>
        </div>
        <button className="absolute bottom-1 font-semibold rounded-md right-1 w-40 border bg-red-600 p-2" onClick={() => handleViewDetail(data.documentId)}>View Detail</button>
      </div>
    );
  };

  return (
    <div className="bg-sky-200 flex flex-col max-h-full min-h-screen justify-center items-center w-full overflow-y-auto">
      <h1 className="text-3xl font-bold mt-10">View Employee</h1>
      <div className="bg-sky-200 mt-5 w-9/12">
        {userData.map((user) => buildDiv(user))}
      </div>
    </div>
  );
}

export default EmployeeList;
