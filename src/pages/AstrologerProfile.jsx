import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

function AstrologerProfile() {
  const { astrologer, axios } = useAppContext();
  const [file, setFile] = useState();

  const [formData, setFormData] = useState({
    phoneNumber: astrologer?.phoneNumber,
    experience: astrologer?.experience,
    languages: astrologer?.languages,
    bio: astrologer?.bio,
    oneDay: astrologer?.subscriptionPlans?.oneDay,
    oneWeek: astrologer?.subscriptionPlans?.oneWeek,
    oneMonth: astrologer?.subscriptionPlans?.oneMonth,
  });

  const { phoneNumber, languages, bio, oneDay, oneWeek, oneMonth, experience } = formData;
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleOnChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) return;

    setLoading(true);
    const loadingToast = toast.loading("Updating Profile...");

    const data = new FormData();
    data.append("phoneNumber", phoneNumber);
    data.append("experience", experience);
    data.append("languages", languages);
    data.append("bio", bio);
    data.append("oneDay", oneDay);
    data.append("oneWeek", oneWeek);
    data.append("oneMonth", oneMonth);
    if (file) data.append("profileImage", file);

    try {
      const res = await axios.put("/api/astrologer/astrologer-profile-update", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.dismiss(loadingToast);
      setLoading(false);

      if (res.data.success) {
        toast.success("Profile updated!");
        setIsEditing(false);
        setFile(null);
      } else {
        toast.error(res.data.message || "Update failed.");
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      setLoading(false);
      toast.error(err.response?.data?.message || "Something went wrong.");
    }
  };

  const handleCancel = () => {
    setFormData({
      phoneNumber: astrologer.phoneNumber,
      languages: astrologer.languages,
      bio: astrologer.bio,
      oneDay: astrologer.subscriptionPlans.oneDay,
      oneWeek: astrologer.subscriptionPlans.oneWeek,
      oneMonth: astrologer.subscriptionPlans.oneMonth,
    });
    setFile(null);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-4xl bg-gray-800 rounded-2xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-white">Astrologer Profile</h1>
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="submit"
                form="astrologerForm"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <form id="astrologerForm" onSubmit={handleOnSubmit} className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={file ? URL.createObjectURL(file) : astrologer?.profileImage}
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-purple-500 object-cover"
              />
              <label className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full cursor-pointer hover:bg-purple-700 transition">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files[0])}
                  disabled={!isEditing}
                />
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </label>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {astrologer?.firstName} {astrologer?.lastName}
              </h2>
              <p className="text-gray-400">{astrologer?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-medium text-gray-300 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={phoneNumber}
                onChange={handleOnChange}
                disabled={!isEditing}
                className="w-full bg-gray-700 border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-300 mb-2">Experience (in years)</label>
              <input
                type="text"
                name="experience"
                value={experience}
                onChange={handleOnChange}
                disabled={!isEditing}
                className="w-full bg-gray-700 border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-base mb-2 font-medium text-gray-300">Languages</label>
            <input
              type="text"
              name="languages"
              value={languages}
              onChange={handleOnChange}
              disabled={!isEditing}
              className="w-full bg-gray-700 border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-base mb-2 font-medium text-gray-300">Bio</label>
            <textarea
              name="bio"
              value={bio}
              onChange={handleOnChange}
              disabled={!isEditing}
              className="w-full bg-gray-700 border-gray-600 text-white px-4 py-2 rounded-lg h-28 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Subscription Plans
              </h3>
              <div className="h-0.5 flex-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["oneDay", "oneWeek", "oneMonth"].map((plan) => (
                <div key={plan} className="bg-gray-800/50 rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                  <label className="block text-lg font-medium text-white mb-2">
                    {plan === "oneDay"
                      ? "1 Day Plan"
                      : plan === "oneWeek"
                        ? "1 Week Plan"
                        : "1 Month Plan"}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400">₹</span>
                    <input
                      type="number"
                      name={plan}
                      value={formData[plan]}
                      onChange={handleOnChange}
                      disabled={!isEditing}
                      className="w-full bg-gray-700/50 border border-gray-600 text-white pl-8 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AstrologerProfile;
