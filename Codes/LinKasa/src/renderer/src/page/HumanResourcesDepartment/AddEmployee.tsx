import AddEmployeeForm from '../../components/Employee/AddEmployeeForm'
import SideBar from '../../components/SideBar'

function HomePage (){
  return (
    <>
    <div className='bg-sky-200 flex'>
      <SideBar />
      <AddEmployeeForm />
    </div>
    </>
  )
}

export default HomePage;
