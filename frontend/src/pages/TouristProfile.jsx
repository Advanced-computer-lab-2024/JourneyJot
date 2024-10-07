import { useEffect, useState } from "react";
import { fetchTouristProfile, updateTouristProfile } from "../api";

const TouristProfile = () => {
  const [profile, setProfile] = useState({
    email: "",
    username: "",
    mobileNumber: "",
    nationality: "",
    dob: "",
    occupation: "",
    wallet: {
      balance: 0,
      currency: "USD",
    },
  });

  const [isEditing, setIsEditing] = useState(false);

  // Fetch the tourist's profile when the component loads
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetchTouristProfile();
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("wallet.")) {
      const walletField = name.split(".")[1];
      setProfile((prevProfile) => ({
        ...prevProfile,
        wallet: { ...prevProfile.wallet, [walletField]: value },
      }));
    } else {
      setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTouristProfile(profile);
      setIsEditing(false);
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Error updating profile");
    }
  };

  return (
    <div className="max-w-lg mx-auto my-10">
      <h2 className="text-3xl font-bold mb-6">Tourist Profile</h2>
      <form onSubmit={handleSubmit}>
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
          <label className="block text-gray-700">Nationality</label>
          <input
            type="text"
            name="nationality"
            value={profile.nationality}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={profile.dob}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Occupation</label>
          <select
            name="occupation"
            value={profile.occupation}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
          >
            <option value="Job">Job</option>
            <option value="Student">Student</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Wallet Balance</label>
          <input
            type="number"
            name="wallet.balance"
            value={profile.wallet.balance}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Wallet Currency</label>
          <input
            type="text"
            name="wallet.currency"
            value={profile.wallet.currency}
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

export default TouristProfile;
