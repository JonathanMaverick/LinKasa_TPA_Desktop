import LoginPage from "./page/Staff/LoginPage";
import HomePage from "./page/Staff/HomePage";
import AddEmployee from "./page/HumanResourcesDepartment/AddEmployee";
import ViewEmployee from "./page/HumanResourcesDepartment/ViewEmployee";
import ViewEmployeeDetail from "./page/HumanResourcesDepartment/ViewEmployeeDetail";
import UpdateEmployeeDetail from "./page/HumanResourcesDepartment/UpdateEmployeeData";
import AddLostItem from "./page/LostAndFoundStaff/AddLostItem";
import ViewLostItem from "./page/LostAndFoundStaff/ViewLostItem";
import CreateFlightSchedule from "./page/ChiefOperationsOfficer/CreateFlightSchedule";
import ViewFlightSchedule from "./page/ChiefOperationsOfficer/ViewFlightSchedule";
import UpdateFlightSchedule from "./page/FlightOperationsManager/UpdateFlightSchedule";
import ViewTerminalMaps from "./page/InformationDeskStaff/ViewTerminalMaps";
import RequestBudget from "./page/CivilEngineeringManager/RequestBudget";
import ViewRequestBudget from "./page/CivilEngineeringManager/ViewRequestBudget";
import DetailBudget from "./page/ChiefFinancialOfficer/DetailBudget";
import ReviseBudget from "./page/ChiefFinancialOfficer/ReviseBudget";
import InsertMaintenanceSchedule from "./page/MaintenanceManager/InsertMaintenanceSchedule";
import ViewMaintenanceSchedule from "./page/MaintenanceManager/ViewMaintenanceSchedule";
import UpdateMaintenanceSchedule from "./page/MaintenanceManager/UpdateMaintenanceSchedule";
import AddTask from "./page/GroundHandlingManager/AddTask";
import ViewTask from "./page/GroundHandlingManager/ViewTask";
import UpdateTask from "./page/GroundHandlingManager/UpdateTask";
import Register from "./page/Passenger/Register";
import OpenJobVacancy from "./page/HumanResourcesDepartment/OpenJobVacancy";
import ViewVacancy from "./page/HumanResourcesDepartment/ViewVacancy";
import UpdateVacancy from "./page/HumanResourcesDepartment/UpdateVacancy";
import ViewApplicant from "./page/HumanResourcesDepartment/ViewApplicant";
import AssignStaffTraining from "./page/HumanResourcesDepartment/AssignStaffTraining";
import ViewTraining from "./page/HumanResourcesDepartment/ViewTraining";
import UpdateTraining from "./page/HumanResourcesDepartment/UpdateTraining";
import UpdateLostItem from "./page/LostAndFoundStaff/UpdateLostItem";
import CreateCrew from "./page/FlightOperationsManager/CreateCrew";
import ViewCrew from "./page/FlightOperationsManager/ViewCrew";
import CrewDetail from "./page/FlightOperationsManager/CrewDetail";
import CreateBoardingPass from "./page/CheckInStaff/CreateBoardingPass";
import ViewBoardingPass from "./page/CheckInStaff/ViewBoardingPass";
import UpdateBoardingPass from "./components/BoardingPass/UpdateBoardingPass";
import ChatPage from "./page/Staff/ChatPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./library/UserAuthContext";

function App() {

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/addEmployee" element={<AddEmployee />} />
            <Route path="/viewEmployee" element={<ViewEmployee />} />
            <Route path="/user/:userId" element={<ViewEmployeeDetail />} />
            <Route path="/updateUser/:userId" element={<UpdateEmployeeDetail />}/>
            <Route path="/addLostItem" element={<AddLostItem />} />
            <Route path="/viewLostItem" element={<ViewLostItem />} />
            <Route path="/updateLostItem/:lostItemId" element={<UpdateLostItem />} />
            <Route path="/createFlightSchedule" element={<CreateFlightSchedule />} />
            <Route path="/viewFlightSchedule" element={<ViewFlightSchedule />} />
            <Route path="/updateFlightSchedule/:flightId" element={<UpdateFlightSchedule />} />
            <Route path="/viewTerminalMaps" element={<ViewTerminalMaps />} />
            <Route path="/requestBudget" element={<RequestBudget />} />
            <Route path="/budgetList" element={<ViewRequestBudget />} />
            <Route path="/detailBudgetList/:budgetId" element={<DetailBudget />} />
            <Route path="/reviseBudget/:budgetId" element={<ReviseBudget />} />
            <Route path="/insertMaintenanceSchedule" element={<InsertMaintenanceSchedule />} />
            <Route path="/viewMaintenanceSchedule" element={<ViewMaintenanceSchedule />} />
            <Route path="/updateMaintenanceSchedule/:maintenanceId" element={<UpdateMaintenanceSchedule />} />
            <Route path="/addTask" element={<AddTask />} />
            <Route path="/viewTask" element={<ViewTask />} />
            <Route path="/updateTask/:taskId" element={<UpdateTask />} />
            <Route path="/register" element={<Register />} />
            <Route path="/openJobVacancy" element={<OpenJobVacancy />} />
            <Route path="/viewJobVacancy" element={<ViewVacancy />} />
            <Route path="/updateJobVacancy/:vacancyId" element={<UpdateVacancy />} />
            <Route path="/viewApplicant" element={<ViewApplicant />} />
            <Route path="/assignStaffTraining" element={<AssignStaffTraining />} />
            <Route path="/viewTraining" element={<ViewTraining />} />
            <Route path="/updateTraining/:trainingId" element={<UpdateTraining />} />
            <Route path="/createCrew" element={<CreateCrew />} />
            <Route path="/viewCrew" element={<ViewCrew />} />
            <Route path="/crewDetail/:crewId" element={<CrewDetail />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/createBoardingPass" element={<CreateBoardingPass />} />
            <Route path="/viewBoardingPass" element={<ViewBoardingPass />} />
            <Route path="/updateBoardingPass/:boardingPassId" element={<UpdateBoardingPass />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
