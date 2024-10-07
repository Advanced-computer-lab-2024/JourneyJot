import { useEffect, useState } from "react";
import { fetchTourGuideProfile, updateTourGuideProfile } from "../api";
const TourGuideProfile = () => {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    mobileNumber: "",
    yearsOfExperience: "",
    previousWork: "",
    // If you have additional fields like bio or experience
  });

  const [isEditing, setIsEditing] = useState(false);

  // Fetch the tour guide's profile when the component loads
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetchTourGuideProfile();
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
      await updateTourGuideProfile(profile);
      setIsEditing(false);
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Error updating profile");
    }
  };

  return (
    <div className="max-w-lg mx-auto my-10">
      <h2 className="text-3xl font-bold mb-6">Tour Guide Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={profile.username}
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
          <label className="block text-gray-700">Mobile Number</label>
          <input
            type="text"
            name="mobileNumber"
            value={profile.mobileNumber}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">yearsOfExperience</label>
          <input
            type="text"
            name="yearsOfExperience"
            value={profile.yearsOfExperience}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Date previousWork Birth</label>
          <input
            type="text"
            name="previousWork"
            value={profile.previousWork}
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

export default TourGuideProfile;
