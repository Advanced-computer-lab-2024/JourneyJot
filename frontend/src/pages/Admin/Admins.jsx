import { useState, useEffect } from "react";
import axios from "axios";

const Admins = () => {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [categoryFormData, setCategoryFormData] = useState({ name: "" });
  const [tagFormData, setTagFormData] = useState({ name: "" });
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingTagId, setEditingTagId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories and tags data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [categoriesRes, tagsRes] = await Promise.all([
        axios.get("http://localhost:3000/categories"),
        axios.get("http://localhost:3000/pref-tags"),
      ]);
      setCategories(categoriesRes.data);
      setTags(tagsRes.data);
    } catch (err) {
      setError("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e, setter) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e, type) => {
    e.preventDefault();
    const isEditing = type === "category" ? editingCategoryId : editingTagId;
    const endpoint = `http://localhost:3000/${
      type === "category" ? "categories" : "pref-tags"
    }`;

    try {
      if (isEditing) {
        await axios.put(
          `${endpoint}/${isEditing}`,
          type === "category" ? categoryFormData : tagFormData
        );
      } else {
        await axios.post(
          endpoint,
          type === "category" ? categoryFormData : tagFormData
        );
      }
      fetchData();
      resetForm(type);
    } catch (err) {
      setError("Error submitting form.");
    }
  };

  const handleEdit = (item, type) => {
    if (type === "category") {
      setEditingCategoryId(item._id);
      setCategoryFormData({ name: item.name });
    } else {
      setEditingTagId(item._id);
      setTagFormData({ name: item.name });
    }
  };

  const handleDelete = async (id, type) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(
          `http://localhost:3000/${
            type === "category" ? "categories" : "pref-tags"
          }/${id}`
        );
        fetchData();
      } catch (err) {
        setError("Error deleting item.");
      }
    }
  };

  const resetForm = (type) => {
    if (type === "category") {
      setEditingCategoryId(null);
      setCategoryFormData({ name: "" });
    } else {
      setEditingTagId(null);
      setTagFormData({ name: "" });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Admin - Manage Categories & Preference Tags
      </h1>

      {/* Category Form */}
      <CategoryTagForm
        title="Manage Activity Categories"
        formData={categoryFormData}
        onChange={(e) => handleInputChange(e, setCategoryFormData)}
        onSubmit={(e) => handleFormSubmit(e, "category")}
        isEditing={!!editingCategoryId}
        resetForm={() => resetForm("category")}
      />

      {/* Tag Form */}
      <CategoryTagForm
        title="Manage Preference Tags"
        formData={tagFormData}
        onChange={(e) => handleInputChange(e, setTagFormData)}
        onSubmit={(e) => handleFormSubmit(e, "tag")}
        isEditing={!!editingTagId}
        resetForm={() => resetForm("tag")}
      />

      {/* Category List */}
      <ItemList
        title="Activity Categories"
        items={categories}
        onEdit={(item) => handleEdit(item, "category")}
        onDelete={(id) => handleDelete(id, "category")}
      />

      {/* Tag List */}
      <ItemList
        title="Preference Tags"
        items={tags}
        onEdit={(item) => handleEdit(item, "tag")}
        onDelete={(id) => handleDelete(id, "tag")}
      />
    </div>
  );
};

// Category & Tag Form Component
const CategoryTagForm = ({
  title,
  formData,
  onChange,
  onSubmit,
  isEditing,
  resetForm,
}) => (
  <form
    onSubmit={onSubmit}
    className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
  >
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={onChange}
        required
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Enter name"
      />
    </div>
    <div className="flex items-center justify-between">
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {isEditing ? "Update" : "Create"} {title.split(" ")[1]}
      </button>
      {isEditing && (
        <button
          type="button"
          onClick={resetForm}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
        >
          Cancel Edit
        </button>
      )}
    </div>
  </form>
);

// Item List Component
const ItemList = ({ title, items, onEdit, onDelete }) => (
  <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-4">
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    {items.length === 0 ? (
      <p>No items available.</p>
    ) : (
      <ul className="divide-y divide-gray-300">
        {items.map((item) => (
          <li key={item._id} className="py-4 flex justify-between">
            <span className="font-medium">{item.name}</span>
            <div>
              <button
                onClick={() => onEdit(item)}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(item._id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default Admins;
