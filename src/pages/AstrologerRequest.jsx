import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast';


function AstrologerRequest() {
    const { axios } = useAppContext();
    const [allAstrologerRequest, setAllAstrologerRequest] = useState([]);
    const [loadingId, setLoadingId] = useState(null);

    const fetchAstrologerRequest = async () => {
        try {
            const resData = await axios.get("/api/admin/astrologer-request");
            console.log("ALL ASTROLOGER REQUEST RES :", resData);

            if (resData.data.success) {
                toast.success("All Astrologer Request")
                setAllAstrologerRequest(resData.data.data);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Something went wrong.");
            return;
        }
    }

    const handleApprove = async (astrologerId) => {
        setLoadingId(astrologerId);
        const toastId = toast.loading("Approving Astrologer request...");
        try {
            const resData = await axios.post(`/api/admin/approve-astrologer-request/${astrologerId}`);
            toast.dismiss(toastId);

            if (resData.data.success) {
                toast.success("Astrologer Request Approved!");
                fetchAstrologerRequest();
            }
        } catch (error) {
            console.error(error);
            toast.dismiss(toastId);
            toast.error(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoadingId(null);
        }
    };

    const handleReject = async (astrologerId) => {
        setLoadingId(astrologerId);
        const toastId = toast.loading("Rejecting Astrologer request...");
        try {
            const resData = await axios.post(`/api/admin/reject-astrologer-request/${astrologerId}`);
            toast.dismiss(toastId);

            if (resData.data.success) {
                toast.success("Astrologer Request Rejected!");
                fetchAstrologerRequest();
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
        fetchAstrologerRequest();
    }, []);

    return (
        <div className="w-full min-h-screen bg-gray-900">
            {(allAstrologerRequest.length > 0) ? (
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                    <div className="flex flex-col items-center md:items-start mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 uppercase tracking-wide">
                            All Astrologer Request
                        </h1>
                        <div className="w-32 h-1.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mt-4"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-7xl mx-auto">
                        {allAstrologerRequest.map((astrologerRequest) => (
                            <div
                                key={astrologerRequest._id}
                                className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 transform hover:scale-[1.02] transition-all duration-300 overflow-hidden md:p-5 p-2 hover:shadow-2xl"
                            >
                                <div className="flex flex-col gap-5">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="md:w-10 md:h-10 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold">
                                                {astrologerRequest.firstName[0]}{astrologerRequest.lastName[0]}
                                            </div>
                                            <h3 className="md:text-xl text-base font-semibold text-gray-300">
                                                {`${astrologerRequest.firstName} ${astrologerRequest.lastName}`}
                                            </h3>
                                        </div>
                                        <span className="md:px-4 py-1.5 px-2 bg-gray-700 text-purple-400 rounded-full text-sm font-medium inline-block w-fit">
                                            ID: {astrologerRequest._id}
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-2 text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-sm">Email:</span>
                                            <span className='md:text-sm text-xs'>{astrologerRequest.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-sm">Experience:</span>
                                            <span className="capitalize md:text-sm text-xs">{astrologerRequest.experience} years</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-sm">Contact Number:</span>
                                            <span className='md:text-sm text-xs'>{astrologerRequest.phoneNumber}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4 md:flex-row">
                                        <button
                                            onClick={() => handleApprove(astrologerRequest._id)}
                                            disabled={loadingId === astrologerRequest._id}
                                            className={`flex-1 py-3 rounded-xl font-medium shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl
                                                ${loadingId === astrologerRequest._id
                                                    ? 'bg-gray-600 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'}`}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(astrologerRequest._id)}
                                            disabled={loadingId === astrologerRequest._id}
                                            className={`flex-1 py-3 rounded-xl font-medium shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl
                                                ${loadingId === astrologerRequest._id
                                                    ? 'bg-gray-600 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700'}`}
                                        >
                                            Reject
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
                        No Request Found
                    </h1>
                </div>
            )}
        </div>
    )
}

export default AstrologerRequest