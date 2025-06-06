import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext';
import profileImage from "../assets/IMG_20241104_125822_copy_823x793.jpg"

function HomeAstrologers() {

    const { navigate, allHomeAstrologer } = useAppContext();

    return (
        <div className="w-full min-h-screen bg-gray-900">
            {(allHomeAstrologer.length > 0) ? (
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {allHomeAstrologer.map((astrologer) => (
                            <div key={astrologer._id}
                                onClick={() => navigate(`/astrologer-detail/${astrologer._id}`)}
                                className="bg-gray-800 rounded-lg shadow-md border border-purple-500/20 transform hover:scale-[1.01] transition-all duration-300 overflow-hidden p-4 hover:shadow-lg cursor-pointer">
                                <img
                                    src={astrologer.profileImage}
                                    alt="astrologerImage"
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-xl text-white font-semibold">{`${astrologer.firstName} ${astrologer.lastName}`}</h3>
                                    <p className="text-gray-400">Vedic Astrology Expert</p>
                                    <div className="flex items-center mt-2 text-white">
                                        <span className="ml-1">Experience</span>
                                        <span className="ml-1">{astrologer.experience}</span>
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

export default HomeAstrologers