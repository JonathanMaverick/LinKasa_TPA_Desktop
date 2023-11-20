import { db, storage } from "@renderer/config/firebase";
import User from "@renderer/model/User";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SideBar from "@renderer/components/SideBar";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const initialEmployee: User = {
  documentId: '',
  email: '',
  name: '',
  birthdate: '',
  roles: '',
  profilePicture: '',
}

function UpdateEmployeeDetail(){

  const roles = [
    "Customer Service Manager",
    "Information Desk Staff",
    "Lost and Found Staff",
    "Check-in Staff",
    "Gate Agents",
    "Air Operations Manager",
    "Flight Operations Manager",
    "Ground Handling Manager",
    "Ground Handling Staff",
    "Landside Operations Manager",
    "Maintenance Manager",
    "Maintenance Staff",
    "Customs and Border Control Officers",
    "Baggage Security Supervisor",
    "Baggage Security Staff",
    "Cargo Manager",
    "Logistic Manager",
    "Fuel Manager",
    "Cargo Handlers",
    "Civil Engineering Manager",
    "Airport Director/CEO",
    "Chief Financial Officer (CFO)",
    "Chief Operation Officer (COO)",
    "Chief Security Officer (CSO)",
    "Human Resources Director",
  ];

  const { userId } = useParams();
  const [employee, setEmployee] = useState<User>(initialEmployee);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [maxDate, setMaxDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        return;
      }
      const userDocRef = doc(db, 'users', userId);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data() as User;
        setEmployee(userData);
      }
    };

    const today = new Date().toISOString().split('T')[0];
    setMaxDate(today);

    fetchUserData();
  }, []);

  const updateEmployee = async (e) =>{
    e.preventDefault();
    if (!userId) {
      return;
    }

    if  (!employee.name || !employee.roles || !employee.birthdate) {
      setError("Please fill all the fields")
      return;
    }

    try{
      let url = employee.profilePicture;
      if(profilePicture){
        const imageRef = ref(storage, `profile/${profilePicture.name}`);
        await uploadBytes(imageRef, profilePicture);
        url = await getDownloadURL(imageRef);
      }

      const userDocRef = doc(db, 'users', userId)

      setDoc(userDocRef, {
        name : employee.name,
        email : employee.email,
        roles: employee.roles,
        profilePicture: url,
        birthdate:employee.birthdate
      });
      navigate(`/user/${userId}`);
    }catch{
      setError('Error updating employee');
      return;
    }

  }

  return (
    <>
    <div className='flex bg-sky-200 w-full'>
      <SideBar />
      <div className="flex bg-sky-200 flex-col h-screen w-full mt-10 items-center justify-center">
        <img src={employee.profilePicture} className="w-40 h-40 object-cover rounded-full mt-10" alt="" />
        <h1 className="text-3xl font-bold">Update {employee.name}</h1>
        <form onSubmit={updateEmployee} className="flex bg-sky-200 flex-col w-full p-20 py-10">
          <div className="flex flex-col mt-5 gap-2">
            <label htmlFor="email" className="text-2xl">Email:</label>
            <input
              type="text"
              id="email"
              name="email"
              value={employee.email}
              className="border p-2 rounded-lg focus:outline-none"
              disabled
            />
          </div>
          <div className="flex flex-col mt-5 gap-2">
            <label htmlFor="name" className="text-2xl">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={employee.name}
              className="border p-2 rounded-lg focus:outline-none"
              onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
            />
          </div>
          <div className="flex flex-col mt-5 gap-2">
            <label htmlFor="roles" className="text-2xl">
              Roles:
            </label>
            <select
              id="roles"
              name="roles"
              value={employee.roles}
              className="border p-2 rounded-lg focus:outline-none"
              onChange={(e) => setEmployee({ ...employee, roles: e.target.value })}
            >
            <option value="">Select a role</option>
            {roles.map((role, index) => (
              <option key={index} value={role}>
                {role}
              </option>
            ))}
            </select>
          </div>
          <div className="flex flex-col mt-5 gap-2">
            <label htmlFor="birthdate" className="text-2xl">BirthDate:</label>
            <input
              type="date"
              id="birthdate"
              name="birthdate"
              max={maxDate}
              value={employee.birthdate}
              className="border p-2 rounded-lg focus:outline-none"
              onChange={(e) => setEmployee({ ...employee, birthdate: e.target.value })}
            />
          </div>
          <div className="flex flex-col mt-5 gap-2">
          <label htmlFor="profile">Profile Picture</label>
          <input
            id="profile"
            type="file"
            accept=".jpg, .jpeg, .png"
            className="p-2"
            onChange={(e) => {
              setProfilePicture(e.target.files && e.target.files[0]);
            }}
          />
          </div>
          <p className="pt-2 font-bold text-red-400">{error}</p>
          <button type="submit" className="p-2 mt-2 rounded-md bg-cyan-700 text-white hover:bg-cyan-900">Update Employee</button>
          </form>
        </div>
      </div>
    </>
  );

}

export default UpdateEmployeeDetail;
