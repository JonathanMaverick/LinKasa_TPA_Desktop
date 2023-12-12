import { db } from "@renderer/config/firebase";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import User from "@renderer/model/User";
import SideBar from "@renderer/components/SideBar";
import { useUserAuth } from "@renderer/library/UserAuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialEmployee: User = {
  documentId: '',
  email: '',
  name: '',
  birthdate: '',
  roles: '',
  profilePicture: '',
  department: '',
}

function ViewEmployeeDetail() {
  const { userId } = useParams();
  const [employee, setEmployee] = useState<User>(initialEmployee);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId) {
          return;
        }
        const userDocRef = doc(db, 'Users', userId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data() as User;
          setEmployee(userData);
        }
      } catch (error) {
        toast.error('Error fetching data');
      }
    };

    fetchUserData();
  }, []);

  const {roles} = useUserAuth();
  const isNotPassenger = roles !== "Passenger";
  const isHRD = roles === "Human Resources Director";

  const handleUpdate = () => {
    navigate(`/updateUser/${userId}`);
  };

  const deleteStaff = async () => {
    if (!userId) {
      return;
    }
    try {
      const userDocRef = doc(db, 'users', userId);
      await deleteDoc(userDocRef);
      toast.success('Data deleted successfully');
      navigate('/viewemployee');
    } catch (error) {
      toast.error('Error deleting data');
    }
  };

  return (
    <>
    <div className='flex bg-sky-200 w-full'>
      <SideBar />
      <div className="bg-sky-200 flex flex-col max-h-full min-h-screen justify-center items-center w-full overflow-y-auto">
        <h1 className="text-3xl font-bold mt-20">View {employee.name}</h1>
        <img src={employee.profilePicture} className="w-96 h-96 object-cover rounded-full mt-10" alt="" />
        <p className="text-3xl mt-10">Name: {employee.name}</p>
        <p className="text-2xl mt-5" >Email: {employee.email}</p>
        <p className="text-2xl mt-5">Roles : {employee.roles}</p>
        <p className="text-2xl mt-5">BirthDate : {employee.birthdate} </p>
      </div>
      <div className="fixed bottom-1 right-1 flex flex-row gap-2">
        {isNotPassenger &&
        <>
          {isHRD ? (
            <>
              <button onClick={handleUpdate} className="font-semibold rounded-md w-40 border bg-blue-700 text-white p-2">Update Staff</button>
              <button onClick={deleteStaff} className="font-semibold rounded-md w-40 border bg-red-600 text-white p-2">Delete Staff</button>
            </>
          ) :
          (
            <button onClick={handleUpdate} className="font-semibold rounded-md w-40 border bg-blue-700 text-white p-2">Update Profile</button>
          )
          }
        </>
        }
      </div>
      <ToastContainer />
    </div>
    </>
  );
}

export default ViewEmployeeDetail;
