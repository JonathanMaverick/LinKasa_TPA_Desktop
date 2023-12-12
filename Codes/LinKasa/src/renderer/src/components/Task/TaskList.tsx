import { deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import Task from "@renderer/model/Task";
import { useNavigate } from "react-router-dom";
import { taskCollection } from "@renderer/library/Collection";
import { auth, db } from "@renderer/config/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { useUserAuth } from "@renderer/library/UserAuthContext";

function TaskList() {
  const [taskData, setTaskData] = useState<Task[]>([]);
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const userId = user?.uid;
  const {roles} = useUserAuth();

  useEffect(() => {
    const unsubscribe = onSnapshot(taskCollection, (snapshot) => {
      const updatedData = snapshot.docs.map(doc => {
        const data = doc.data();
        const task: Task = {
          id: doc.id,
          name: data.name || '',
          startDate: data.startDate || '',
          deadlineDate: data.deadlineDate || '',
          location: data.location || '',
          description: data.description || '',
          status : data.status || '',
          staff: {
            documentId: data.staff.documentId || '',
            email: data.staff.email || '',
            name: data.staff.name || '',
            birthdate: data.staff.birthdate || '',
            roles: data.staff.roles || '',
            profilePicture: data.staff.profilePicture || '',
            department : data.staff.department || '',
          }
        }
        return task;
      });
      if (roles === "Ground Handling Manager") {
        setTaskData(updatedData);
      } else {
        const userTasks = updatedData.filter(task => task.staff.documentId === userId);
        setTaskData(userTasks);
      }
    });

    return () => {
      unsubscribe();
    };
  },[]);

  const handleUpdateTask = (id) => {
    navigate(`/updateTask/${id}`);
  };

  const handleRemoveTask = async (id) => {
    if(!id){
      return;
    }
    const taskDocRef = doc(db, 'Task', id);
    await deleteDoc(taskDocRef);
    toast.success('🛠️ Task deleted!', {
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

  const isGroundHandlingManager = roles === "Ground Handling Manager";

  const buildDiv = (data: Task) => {
    return (
    <div key={data.id} className="border p-4 mb-4 bg-white rounded-md shadow-md">
      <div className="flex flex-col justify-center text-center">
        <p className="text-lg font-semibold mb-2">{data.name}</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col">
            <p className="text-gray-600">Date:</p>
            <p className="font-semibold">{data.startDate} - {data.deadlineDate}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-gray-600">Location:</p>
            <p className={"font-semibold"}>{data.location}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-gray-600">Status:</p>
            <p className={"font-semibold"}>{data.status}</p>
          </div>
        </div>
        <p className="text-gray-600 mt-4">Staff: {data.staff.name}</p>
        {isGroundHandlingManager &&

        <div className="flex flex-row gap-5">
          <button
            onClick={() => handleUpdateTask(data.id)}
            className="flex-grow bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-700"
          >
            Update Task
          </button>
          <button
            onClick={() => handleRemoveTask(data.id)}
            className="flex-grow bg-red-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-red-600 focus:outline-none focus:ring focus:border-blue-700"
          >
            Remove Task
          </button>
        </div>
        }
      </div>
      </div>
    );
  };

  return (
    <>
     <div className="bg-sky-200 flex flex-col min-h-screen justify-center items-center w-full overflow-y-auto">
        <h1 className="text-3xl font-bold my-10">View Task</h1>
        <div className="bg-sky-200 mt-5 w-9/12">
          {taskData.map((task) => buildDiv(task))}
        </div>
      </div>
      <ToastContainer />
    </>
  );

}

export default TaskList;
