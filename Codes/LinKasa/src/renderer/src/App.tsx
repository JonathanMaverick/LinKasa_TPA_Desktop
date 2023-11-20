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
import AssignStaff from "./page/GroundHandlingManager/AssignStaff";
import Register from "./page/Passenger/Register";
import OpenJobVacancy from "./page/HumanResourcesDepartment/OpenJobVacancy";
import ViewVacancy from "./page/HumanResourcesDepartment/ViewVacancy";
import ViewApplicant from "./page/HumanResourcesDepartment/ViewApplicant";
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
            <Route path="/createFlightSchedule" element={<CreateFlightSchedule />} />
            <Route path="/viewFlightSchedule" element={<ViewFlightSchedule />} />
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
            <Route path="/assignStaff/:taskId" element={<AssignStaff />} />
            <Route path="/register" element={<Register />} />
            <Route path="/openJobVacancy" element={<OpenJobVacancy />} />
            <Route path="/viewJobVacancy" element={<ViewVacancy />} />
            <Route path="/viewApplicant" element={<ViewApplicant />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
