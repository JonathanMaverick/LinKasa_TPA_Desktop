import { useEffect, useState } from 'react';
import MaintenanceSchedule from '@renderer/model/MaintenanceSchedule';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { maintenanceScheduleCollection } from '@renderer/library/Collection';
import { db } from '@renderer/config/firebase';
import User from '@renderer/model/User';
import { useNavigate, useParams } from 'react-router-dom';
import SideBar from '@renderer/components/SideBar';

function UpdateMaintenanceSchedule() {

  const initialMaintenanceSchedule: MaintenanceSchedule = {
    id: '',
    type: '',
    equipment: '',
    startDate: '',
    endDate: '',
    status: '',
    staff: {
      documentId: '',
      email: '',
      name: '',
      birthdate: '',
      roles: '',
      profilePicture: '',
    },
  };

  const { maintenanceId } = useParams();
  const [maintenanceSchedule, setMaintenanceSchedule] = useState<MaintenanceSchedule>(initialMaintenanceSchedule);
  const [error, setError] = useState<string | null>(null);
  const [staffOptions, setStaffOptions] = useState<User[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (maintenanceId) {
          const maintenanceDocRef = doc(db, 'MaintenanceSchedule', maintenanceId);
          const maintenanceDocSnapshot = await getDoc(maintenanceDocRef);

          if (maintenanceDocSnapshot.exists()) {
            const maintenanceData = maintenanceDocSnapshot.data() as MaintenanceSchedule;
            setMaintenanceSchedule(maintenanceData);
          }
        }

        const staffList = await getMaintenanceStaff();
        setStaffOptions(staffList);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [maintenanceId]);

  const getMaintenanceStaff = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));

      return querySnapshot.docs
        .filter((doc) => doc.data().roles === 'Maintenance Staff')
        .map((doc) => {
          const { email, name, birthdate, roles, profilePicture } = doc.data();
          return { documentId: doc.id, email, name, birthdate, roles, profilePicture };
        });
    } catch (error) {
      return [];
    }
  };

  const areSchedulesOverlapping = (schedule1, schedule2) => {
    const startDate1 = new Date(schedule1.startDate);
    const endDate1 = new Date(schedule1.endDate);
    const startDate2 = new Date(schedule2.startDate);
    const endDate2 = new Date(schedule2.endDate);

    return (
      (startDate1 <= startDate2 && startDate2 <= endDate1) ||
      (startDate1 <= endDate2 && endDate2 <= endDate1) ||
      (startDate2 <= startDate1 && startDate1 <= endDate2) ||
      (startDate2 <= endDate1 && endDate1 <= endDate2)
    );
  };

  const handleUpdateSchedule = async (e) => {
    e.preventDefault();
    if(!maintenanceId)return;

    if (!maintenanceSchedule.type || !maintenanceSchedule.equipment || !maintenanceSchedule.startDate || !maintenanceSchedule.endDate || !maintenanceSchedule.staff.documentId) {
      setError('Please fill in all fields.');
      return;
    }

    const existingSchedulesSnapshot = await getDocs(maintenanceScheduleCollection);
    const existingSchedules = existingSchedulesSnapshot.docs
    .map((doc) => ({
      documentID: doc.id,
      ...(doc.data() as MaintenanceSchedule),
    }))
    .filter((schedule) => schedule.documentID !== maintenanceId);

    const schedulesSpecificStaff = existingSchedules.filter(
      (schedule) => schedule.staff.documentId === maintenanceSchedule.staff.documentId
    );

    if (!maintenanceSchedule.type || !maintenanceSchedule.equipment || !maintenanceSchedule.startDate || !maintenanceSchedule.endDate || !maintenanceSchedule.staff.documentId) {
      setError('Please fill in all fields.');
      return;
    }

    if (new Date(maintenanceSchedule.startDate) > new Date(maintenanceSchedule.endDate)) {
      setError('Start date cannot exceed end date.');
      return;
    }

    const overlappingSchedule = schedulesSpecificStaff.find((schedule) =>
      areSchedulesOverlapping(schedule, maintenanceSchedule)
    );

    if (overlappingSchedule) {
      setError('The selected staff has an overlapping schedule.');
      return;
    }

    try{
      const maintenanceDocRef = doc(db, 'MaintenanceSchedule', maintenanceId)
      await setDoc(maintenanceDocRef, {
        type: maintenanceSchedule.type,
        equipment: maintenanceSchedule.equipment,
        startDate: maintenanceSchedule.startDate,
        endDate: maintenanceSchedule.endDate,
        status : maintenanceSchedule.status,
        staff: {
          name: maintenanceSchedule.staff.name,
          documentId: maintenanceSchedule.staff.documentId,
        },
      });
      navigate('/viewMaintenanceSchedule')
    }
    catch{
      setError('Error updating maintenance schedule')
      return
    }

  };

  const handleStaffChange = (event) => {
    const selectedStaff = staffOptions.find((staff) => staff.documentId === event.target.value);
    setMaintenanceSchedule((prevSchedule) => ({
      ...prevSchedule,
      staff: {
        documentId: selectedStaff?.documentId || '',
        email: selectedStaff?.email || '',
        name: selectedStaff?.name || '',
        birthdate: selectedStaff?.birthdate || '',
        roles: selectedStaff?.roles || '',
        profilePicture: selectedStaff?.profilePicture || '',
      },
    }));
  };

  return (
  <div className="flex bg-sky-200 h-screen">
    <SideBar />
    <div className="bg-sky-200 flex flex-col max-h-full min-h-screen justify-center items-center w-full overflow-y-auto">
      <h1 className="text-4xl font-bold mb-8">Insert Maintenance Schedule</h1>
      <form action="" onSubmit={handleUpdateSchedule} className="bg-white p-6 rounded-md shadow-md w-1/2">
        <div className="mb-4">
          <label htmlFor="type" className="block text-sm font-medium text-gray-600">
            Select Type:
          </label>
          <input
            id="type"
            name="type"
            value={maintenanceSchedule.type}
            disabled
            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-sky-500"
            >
          </input>
        </div>
        <div className="mb-4">
          <label htmlFor="equipment" className="block text-sm font-medium text-gray-600">
            Select Equipment:
          </label>
          <input
            id="equipment"
            name="equipment"
            value={maintenanceSchedule.equipment}
            disabled
            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-sky-500"
            >
          </input>
        </div>
        <div className="mb-4">
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-600">
            Start Date and Time:
          </label>
          <input
            type="datetime-local"
            id="startDate"
            name="startDate"
            value={maintenanceSchedule.startDate}
            disabled
            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-sky-500"
            />
        </div>
        <div className="mb-4">
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-600">
            End Date and Time:
          </label>
          <input
            type="datetime-local"
            id="endDate"
            name="endDate"
            value={maintenanceSchedule.endDate}
            onChange={(e) => setMaintenanceSchedule((prevSchedule) => ({ ...prevSchedule, endDate: e.target.value }))}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-sky-500"
            />
        </div>
        <div className="mb-4">
        <label htmlFor="staff" className="block text-sm font-medium text-gray-600">
          Select Staff:
        </label>
          <select
            id="staff"
            name="staff"
            value={maintenanceSchedule.staff.documentId}
            onChange={handleStaffChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-sky-500"
          >
          <option value="">Select Staff</option>
          {staffOptions.map((staff) => (
            <option key={staff.documentId} value={staff.documentId}>
              {staff.name}
            </option>
          ))}
        </select>
        </div>
        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-medium text-gray-600">
            Update Status:
          </label>
          <select
            id="status"
            name="status"
            value={maintenanceSchedule.status}
            onChange={(e) => setMaintenanceSchedule((prevSchedule) => ({ ...prevSchedule, status: e.target.value }))}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-sky-500"
            >
            <option value="">Select Status</option>
            <option value="Fully Operational">Fully Operational</option>
            <option value="Scheduled Maintenance">Scheduled Maintenance</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </select>
        </div>
        <div className="flex flex-col justify-center text-center">
          <p className="pt-2 font-bold text-red-400 mb-3">{error}</p>
          <button
            type="submit"
            className="bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-sky-600 focus:outline-none focus:ring focus:border-sky-700"
            >
            Update
          </button>
        </div>
      </form>
    </div>
  </div>
  );
}

export default UpdateMaintenanceSchedule;
