import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast';

function AllUsers() {
    const { axios } = useAppContext();
    const [allUser, setAllUser] = useState([]);
    const [loadingId, setLoadingId] = useState(null);

    const fetchUsers = async () => {
        try {
            const resData = await axios.get("/api/admin/all-user");
            // console.log("ALL USER RES :", resData);

            if (resData.data.success) {
                toast.success("All Users")
                setAllUser(resData.data.data);
                console.log("USER RES :", resData.data.data);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Something went wrong.");
            return;
        }
    }

    // const activeSubs = .subscribedAstrologers.filter(
    //     (subscription) => new Date(subscription.expiryDate) > new Date()
    // );

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="w-full min-h-screen bg-gray-900">
            {(allUser.length > 0) ? (
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                    <div className="flex flex-col items-center md:items-start mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 uppercase tracking-wide">
                            All Users
                        </h1>
                        <div className="w-32 h-1.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mt-4"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-7xl mx-auto">
                        {allUser.map((user) => (
                            <div
                                key={user._id}
                                className="bg-gray-800 rounded-2xl shadow-xl border border-purple-500/20 transform hover:scale-[1.02] transition-all duration-300 overflow-hidden md:p-6 p-2 hover:shadow-2xl"
                            >
                                <div className="flex flex-col gap-5">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="md:w-10 md:h-10 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold">
                                                {user.firstName[0]}{user.lastName[0]}
                                            </div>
                                            <h3 className="md:text-xl text-base font-semibold text-gray-300">
                                                {`${user.firstName} ${user.lastName}`}
                                            </h3>
                                        </div>
                                        <span className="md:px-4 py-1.5 px-2 bg-gray-700 text-purple-400 rounded-full text-xs md:text-sm font-medium inline-block w-fit">
                                            ID: {user._id}
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-2 text-gray-400">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-medium text-sm">Email:</span>
                                            <span className='md:text-sm text-xs'>{user.email}</span>
                                        </div>
                                        <div className="flex items-start gap-2 flex-col">
                                            <span className="font-medium text-sm">Subscription:</span>
                                            <span className='md:text-sm text-xs'>
                                                {(user?.subscribedAstrologers.length > 0) ? (
                                                    user.subscribedAstrologers.filter(
                                                        (subscription) => new Date(subscription.expiryDate) > new Date()
                                                    ).map((astrologer) => (
                                                        <div className='flex flex-col'>
                                                            <span className="text-green-400">
                                                                {astrologer.astrologerId.firstName} {astrologer.astrologerId.lastName} - {new Date(astrologer.expiryDate).toLocaleDateString("en-GB")}
                                                            </span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-red-400">No active subscription</span>
                                                )}
                                            </span>
                                        </div>
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

export default AllUsers