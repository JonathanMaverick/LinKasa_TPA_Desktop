import { onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import MaintenanceSchedule from "@renderer/model/MaintenanceSchedule";
import { useNavigate } from "react-router-dom";
import { maintenanceScheduleCollection } from "@renderer/library/Collection";

function MaintenanaceScheduleList() {
  const [maintenanceScheduleData, setMaintenanceScheduleData] = useState<MaintenanceSchedule[]>([]);
  const navigate = useNavigate();

  function formatDateTime(dateTimeString: string) {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    };

    const dateTime = new Date(dateTimeString);
    const formattedDateTime = new Intl.DateTimeFormat('en-US', options).format(dateTime);

    return formattedDateTime;
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(maintenanceScheduleCollection, (snapshot) => {
      const updatedData = snapshot.docs.map(doc => {
        const data = doc.data();
        const maintenanceSchedule: MaintenanceSchedule = {
          id : doc.id,
          type: data.type || '',
          equipment: data.equipment || '',
          startDate: formatDateTime(data.startDate) || '',
          endDate: formatDateTime(data.endDate) || '',
          status: data.status || '',
          staff: {
            documentId: data.staff.documentId || '',
            email: data.staff.email || '',
            name: data.staff.name || '',
            birthdate: data.staff.birthdate || '',
            roles: data.staff.roles || '',
            profilePicture: data.staff.profilePicture || '',
          },
        };
        return maintenanceSchedule;
      });
      setMaintenanceScheduleData(updatedData);
    });

    return () => {
      unsubscribe();
    };
  },[]);

  const handleUpdate = (id) => {
    navigate(`/updateMaintenanceSchedule/${id}`);
  };

  const buildDiv = (data: MaintenanceSchedule) => {
    return (
      <div key={data.id} className="border p-4 mb-4 bg-white rounded-md shadow-md">
      <div className="flex flex-col justify-center text-center">
        <p className="text-lg font-semibold mb-2">{data.type}</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <p className="text-gray-600">Equipment:</p>
            <p className="font-semibold">{data.equipment}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-gray-600">Status:</p>
            <p className={"font-semibold"}>{data.status}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="flex flex-col">
            <p className="text-gray-600">Start Date:</p>
            <p>{data.startDate}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-gray-600">End Date:</p>
            <p>{data.endDate}</p>
          </div>
        </div>
        <p className="text-gray-600 mt-4">Staff: {data.staff.name}</p>
        <button
          onClick={() => handleUpdate(data.id)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-700"
        >
          Update
        </button>
      </div>
      </div>
    );
  };

  return (
    <>
     <div className="bg-sky-200 flex flex-col min-h-screen justify-center items-center w-full overflow-y-auto">
        <h1 className="text-3xl font-bold my-10">View Maintenance Schedule</h1>
        <div className="bg-sky-200 mt-5 w-9/12">
          {maintenanceScheduleData.map((item) => buildDiv(item))}
        </div>
      </div>
    </>
  );

}

export default MaintenanaceScheduleList;
