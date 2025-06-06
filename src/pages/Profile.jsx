import React from 'react'
import { useAppContext } from '../context/AppContext'

function Profile() {

    const { user, navigate, currentSubscription } = useAppContext();

    return (
        <div className="w-full min-h-screen bg-gray-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <div className="flex flex-col items-center md:items-start mb-12">
                    <h1 className="text-2xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 uppercase tracking-wide">
                        My Profile
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mt-1"></div>
                </div>

                <div className="max-w-3xl mx-auto">
                    {/* Profile Information */}
                    <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-8 mb-8">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-3xl font-bold">
                                {user?.firstName?.[0]}{user?.lastName?.[0]}
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold text-white mb-2">
                                    {user?.firstName} {user?.lastName}
                                </h2>
                                <p className="text-gray-400">{user?.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-700/50 rounded-xl p-4">
                                <h3 className="text-lg font-medium text-gray-300 mb-2">Account Type</h3>
                                <p className="text-purple-400 capitalize">{user?.accountType}</p>
                            </div>
                            <div className="bg-gray-700/50 rounded-xl p-4">
                                <h3 className="text-lg font-medium text-gray-300 mb-2">Member Since</h3>
                                <p className="text-purple-400">
                                    {new Date(user?.createdAt).toLocaleDateString("en-GB")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Subscriptions */}
                    <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-8">
                        <h2 className="text-2xl font-semibold text-white mb-6">My Subscriptions</h2>

                        {currentSubscription?.length > 0 ? (
                            <div className="space-y-4">
                                {currentSubscription.map((subscription) => (
                                    <div key={subscription._id} className="bg-gray-700/50 rounded-xl p-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="text-lg font-medium text-white">
                                                    {subscription?.astrologerId?.firstName + " " + subscription?.astrologerId?.lastName || "N/A"}
                                                </h3>
                                                <p className="text-gray-400">
                                                    {subscription?.planName || "N/A"}
                                                </p>
                                                <p className="text-gray-400">
                                                    Valid until: {new Date(subscription.expiryDate).toLocaleDateString("en-GB")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-400">No active currentSubscription found.</p>
                                <button onClick={() => {navigate("/home-astrologer")}} className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                                    Browse Plans
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile