import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast';

function AllAstrologers() {
  const { axios } = useAppContext();
  const [allAstrologer, setAllAstrologer] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const fetchAstrologer = async () => {
    try {
      const resData = await axios.get("/api/admin/all-astrologer");
      console.log("ALL ASTROLOGER RES :", resData);

      if (resData.data.success) {
        toast.success("All Astrologers")
        setAllAstrologer(resData.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong.");
      return;
    }
  }


  const handleRemove = async (astrologerId) => {
    setLoadingId(astrologerId);
    const toastId = toast.loading("Removing Astrologer...");
    try {
      const resData = await axios.delete(`/api/admin/remove-astrologer/${astrologerId}`);
      toast.dismiss(toastId);

      if (resData.data.success) {
        toast.success("Astrologer Removed!");
        fetchAstrologer();
      }
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoadingId(null);
    }
  };

  useEffect(() => {
    fetchAstrologer();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-900">
      {(allAstrologer.length > 0) ? (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="flex flex-col items-center md:items-start mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 uppercase tracking-wide">
              All Astrologer
            </h1>
            <div className="w-32 h-1.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mt-4"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {allAstrologer.map((astrologer) => (
              <div
                key={astrologer._id}
                className="bg-gray-800 rounded-2xl shadow-xl border border-purple-500/20 transform hover:scale-[1.02] transition-all duration-300 overflow-hidden md:p-5 p-2 hover:shadow-2xl"
              >
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="md:w-10 md:h-10 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold">
                        {astrologer.firstName[0]}{astrologer.lastName[0]}
                      </div>
                      <h3 className="md:text-xl text-base font-semibold text-gray-300">
                        {`${astrologer.firstName} ${astrologer.lastName}`}
                      </h3>
                    </div>
                    <span className="md:px-4 py-1.5 px-2 bg-gray-700 text-purple-400 rounded-full text-sm font-medium inline-block w-fit">
                      ID: {astrologer._id}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">Email:</span>
                      <span className='md:text-sm text-xs'>{astrologer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">Experience:</span>
                      <span className="capitalize md:text-sm text-xs">{astrologer.experience} years</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">Contact Number:</span>
                      <span className='md:text-sm text-xs'>{astrologer.phoneNumber}</span>
                    </div>
                  </div>

                  <div className="flex">
                    <button
                      onClick={() => handleRemove(astrologer._id)}
                      disabled={loadingId === astrologer._id}
                      className={`flex-1 py-3 rounded-xl font-medium shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl
                        ${loadingId === astrologer._id
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700'}
                      `}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            No Record Found
          </h1>
        </div>
      )}
    </div>
  )
}

export default AllAstrologers