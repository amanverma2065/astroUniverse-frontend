import React from 'react'
import banner from "../assets/astrology-zodiac-signs-circle.png"
import aboutImg from "../assets/LS20250602120759.png"
import { NavLink } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { Navbar } from 'react-bootstrap'

function Home() {

  const { navigate, user, astrologer, allHomeAstrologer } = useAppContext();

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      {/* Hero Banner Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row-reverse items-center justify-between">
          <div className="md:w-[40%]">
            <img
              src={banner}
              alt="Astrology Banner"
              className="w-full h-[400px] object-contain animate-[spin_15s_linear_infinite]"
            />
          </div>
          <div className="md:w-[60%] space-y-6 px-6 font-thin">
            <h1 className="lg:text-5xl text-3xl font-semibold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Discover Your Cosmic Path with AstroUniverse
            </h1>
            <p className="lg:text-lg text-sm text-gray-300 pr-10">
              Unlock the mysteries of the universe and find guidance through the ancient wisdom of astrology.
            </p>
            {(user || astrologer) ? (
              <button onClick={() => navigate("/all-astrologers")} className="bg-purple-600 hover:bg-purple-700 text-white font-medium lg:py-3 lg:px-8 py-2 px-5 transition-all duration-300">
                Explore
              </button>
            ) : (
              <button onClick={() => navigate("/user-login")} className="bg-purple-600 hover:bg-purple-700 text-white font-medium lg:py-3 lg:px-8 py-2 px-5 transition-all duration-300">
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 py-20">
        <div className="container mx-auto lg:px-10 px-6">
          <h2 className="text-4xl font-semibold text-center mb-16">
            About AstroUniverse
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
              {/* <div className="bg-purple-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <i className="ri-star-fill text-3xl text-purple-400"></i>
              </div> */}
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">Expert Astrologers</h3>
              <p className="text-gray-300 leading-relaxed">Connect with certified astrologers who have years of experience in cosmic readings and spiritual guidance.</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
              {/* <div className="bg-purple-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <i className="ri-moon-fill text-3xl text-purple-400"></i>
              </div> */}
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">Accurate Predictions</h3>
              <p className="text-gray-300 leading-relaxed">Get precise astrological predictions based on your birth chart and planetary positions for better life decisions.</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
              {/* <div className="bg-purple-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <i className="ri-heart-fill text-3xl text-purple-400"></i>
              </div> */}
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">Personal Guidance</h3>
              <p className="text-gray-300 leading-relaxed">Receive personalized guidance for love, career, and life decisions from our experienced astrologers.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Astrologers Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-semibold text-center mb-12">Our Top Astrologers</h2>
        <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-6">
          {allHomeAstrologer.slice(0, 4).map((astrologer) => (
            <div key={astrologer} className="bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={astrologer.profileImage}
                alt="AstrologerImage"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{astrologer.firstName + " " + astrologer.lastName}</h3>
                <p className="text-gray-400">Vedic Astrology Expert</p>
                <div className="flex items-center mt-2">
                  <span>Experience:</span>
                  <span className='ml-2'>{astrologer.experience} years</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">AstroUniverse</h3>
              <p className="text-gray-400">Your cosmic journey begins here.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Home</li>
                <li>About</li>
                <li>Services</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Birth Chart Reading</li>
                <li>Love Compatibility</li>
                <li>Career Guidance</li>
                <li>Relationship Advice</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@astrouniverse.com</li>
                <li>Phone: +1 234 567 890</li>
                <li>Address: 123 Cosmic Street</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Astro Universe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div >
  )
}

export default Home