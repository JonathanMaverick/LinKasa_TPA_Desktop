import SideBar from "@renderer/components/SideBar";
import maps from '../../../../../resources/TerminalMaps.png';

function ViewTerminalMaps() {
  return (
    <>
      <div className="flex flex-row h-screen bg-blue-200">
        <SideBar />
        <div className="flex flex-col justify-center items-center mt-8 w-full">
          <img src={maps} alt="Terminal Maps Overview" className="w-9/12 h-auto" />
          <p className="text-center text-2xl font-semibold text-gray-600 mt-2">
            Soekarno-Hatta International Airport (CGK) Terminal Maps
          </p>
        </div>
      </div>
    </>
  );
}

export default ViewTerminalMaps;
