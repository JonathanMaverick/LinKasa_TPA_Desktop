import { onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import Task from "@renderer/model/Task";
import { useNavigate } from "react-router-dom";
import { taskCollection } from "@renderer/library/Collection";

function TaskList() {
  const [taskData, setTaskData] = useState<Task[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(taskCollection, (snapshot) => {
      const updatedData = snapshot.docs.map(doc => {
        const data = doc.data();
        const task: Task = {
          id: doc.id,
          name: data.name || '',
          deadlineDate: data.deadlineDate || '',
          location: data.location || '',
          staff: {
            documentId: data.staff.documentId || '',
            email: data.staff.email || '',
            name: data.staff.name || '',
            birthdate: data.staff.birthdate || '',
            roles: data.staff.roles || '',
            profilePicture: data.staff.profilePicture || '',
          }
        }
        return task;
      });
      setTaskData(updatedData);
    });

    return () => {
      unsubscribe();
    };
  },[]);

  const handleAssignStaff = (id) => {
    navigate(`/assignStaff/${id}`);
  };

  const buildDiv = (data: Task) => {
    return (
      <div key={data.id} className="border p-4 mb-4 bg-white rounded-md shadow-md">
      <div className="flex flex-col justify-center text-center">
        <p className="text-lg font-semibold mb-2">{data.name}</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <p className="text-gray-600">Deadline:</p>
            <p className="font-semibold">{data.deadlineDate}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-gray-600">Location:</p>
            <p className={"font-semibold"}>{data.location}</p>
          </div>
        </div>
        {!data.staff.name ? (
          <p className="text-gray-600 font-bold mt-4">Staff: Not Assigned</p>
        ) : (
          <p className="text-gray-600 mt-4">Staff: {data.staff.name}</p>
        )}
        <button
          onClick={() => handleAssignStaff(data.id)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-700"
        >
          Assign Staff
        </button>
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
    </>
  );

}

export default TaskList;
