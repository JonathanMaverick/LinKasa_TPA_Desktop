import SideBar from "../../components/SideBar";

function HomePage(){
  return (
    <>
    <div className="flex h-screen bg-gradient-to-r from-cyan-200 to-blue-700">
    <SideBar />
      <div className="flex flex-col ml-64 p-8 justify-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to LinKasa</h1>
        <p className="text-lg font-semibold mb-8">Created by VK23-2</p>
      </div>
    </div>
    </>
  )
}

export default HomePage;
