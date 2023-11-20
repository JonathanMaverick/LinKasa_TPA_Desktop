import EmployeeList from '@renderer/components/Employee/EmployeeList';
import SideBar from '../../components/SideBar'

function ViewEmployee() {

  return (
    <div className='bg-sky-200 flex'>
      <SideBar />
      <EmployeeList />
    </div>
  );
}

export default ViewEmployee;
