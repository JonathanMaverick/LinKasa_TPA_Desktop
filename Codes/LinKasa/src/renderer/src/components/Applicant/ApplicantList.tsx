import { useEffect, useState } from "react";
import Applicant from "@renderer/model/Applicant";
import { deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { applicantCollection } from "@renderer/library/Collection";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "@renderer/config/firebase";

function ApplicantList(){

  const [applicantData, setApplicant] = useState<Applicant[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(applicantCollection, (snapshot) => {
      const updatedData = snapshot.docs.map(doc => {
        const data = doc.data();
        const applicant: Applicant = {
          id : doc.id,
          name : data.name,
          userID : data.userID,
          role : data.role,
          vacancyID : data.vacancyID
        };
        return applicant;
      });
      setApplicant(updatedData);
    });

    return () => {
      unsubscribe();
    };
  },[]);

  const rejectApplicant = async(applicantId) => {
    try{
      const applicantRef = doc(db, "Applicant", applicantId);
      await deleteDoc(applicantRef);
      toast.success('👨‍✈️ Applicant Rejected!', {
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
      toast.error('Error!', {
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

  const acceptApplicant = async(applicant) => {
    try{
      const userRef = doc(db, "Users", applicant.userID);
      await updateDoc(userRef, { roles: applicant.role });
      const applicantRef = doc(db, "Applicant", applicant.id);
      await deleteDoc(applicantRef);
      toast.success('👨‍✈️ Applicant Accepted!', {
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
      toast.error('Error!', {
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

  const buildDiv = (data: Applicant) => {
    return (
      <div className="border p-5 mb-5 bg-white relative h-28 w-full rounded-md flex flex-row items-center" key={data.id}>
        <div className="flex flex-col ml-5">
          <p className="text-xl font-semibold">{data.name}</p>
          <p className="text-gray-600">{data.role}</p>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <button
           onClick={() => rejectApplicant(data.id)}
           className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 focus:outline-none">
            Reject
          </button>
          <button
            onClick={() => acceptApplicant(data)}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none">
            Accept
          </button>
        </div>
      </div>
    );
  };

  return(
    <>
    <div className="bg-sky-200 flex flex-col max-h-full min-h-screen justify-center items-center w-full overflow-y-auto">
      <h1 className="text-3xl font-bold my-10">View Applicant</h1>
      <div className="bg-sky-200 mt-5 w-9/12">
        {applicantData.map((applicant) => buildDiv(applicant))}
      </div>
    </div>
    <ToastContainer />
    </>
  )
}

export default ApplicantList;
