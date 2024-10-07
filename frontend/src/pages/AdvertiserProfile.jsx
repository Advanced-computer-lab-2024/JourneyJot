import { useEffect, useState } from "react";
import { fetchAdvertiserProfile, updateAdvertiserProfile } from "../api";


const AdvertiserProfile = () => {
  const [profile, setProfile] = useState({
    companyName: "",
    email: "",
    hotline: "",
    companyWebsite: "",
    companyProfile: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // Fetch the advertiser's profile when the component loads
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetchAdvertiserProfile();
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAdvertiserProfile(profile);
      setIsEditing(false);
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Error updating profile");
    }
  };

  return (
    <div className="max-w-lg mx-auto my-10">
      <h2 className="text-3xl font-bold mb-6">Advertiser Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Company Name</label>
          <input
            type="text"
            name="companyName"
            value={profile.companyName}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Hotline</label>
          <input
            type="text"
            name="hotline"
            value={profile.hotline}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Company Website</label>
          <input
            type="text"
            name="companyWebsite"
            value={profile.companyWebsite}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Company Profile</label>
          <textarea
            name="companyProfile"
            value={profile.companyProfile}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
          />
        </div>

        {isEditing ? (
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded-md"
          >
            Save
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            Edit Profile
          </button>
        )}
      </form>
    </div>
  );
};

export default AdvertiserProfile;
