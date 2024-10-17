import { useState, useEffect } from "react";
import axios from "axios";

const Admins = () => {
  const [categories, setCategories] = useState([]); // List of activity categories
  const [tags, setTags] = useState([]); // List of preference tags
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
  }); // Form data for activity categories
  const [tagFormData, setTagFormData] = useState({
    name: "",
  }); // Form data for preference tags
  const [editingCategoryId, setEditingCategoryId] = useState(null); // ID of the category being edited
  const [editingTagId, setEditingTagId] = useState(null); // ID of the tag being edited

  // Fetch categories and tags on component mount
  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get("http://localhost:3000/pref-tags");
      setTags(response.data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  // Handle input changes for category form
  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryFormData({
      ...categoryFormData,
      [name]: value,
    });
  };

  // Handle input changes for tag form
  const handleTagInputChange = (e) => {
    const { name, value } = e.target;
    setTagFormData({
      ...tagFormData,
      [name]: value,
    });
  };

  // Add or Update Category
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (editingCategoryId) {
      // Update existing category
      await axios.put(
        `http://localhost:3000/categories/${editingCategoryId}`,
        categoryFormData
      );
    } else {
      // Create new category
      await axios.post("http://localhost:3000/categories", categoryFormData);
    }
    fetchCategories();
    resetCategoryForm();
  };

  // Add or Update Tag
  const handleTagSubmit = async (e) => {
    e.preventDefault();
    if (editingTagId) {
      // Update existing tag
      await axios.put(
        `http://localhost:3000/pref-tags/${editingTagId}`,
        tagFormData
      );
    } else {
      // Create new tag
      await axios.post("http://localhost:3000/pref-tags", tagFormData);
    }
    fetchTags();
    resetTagForm();
  };

  // Edit Category
  const handleCategoryEdit = (category) => {
    setEditingCategoryId(category._id);
    setCategoryFormData({
      name: category.name,
    });
  };

  // Edit Tag
  const handleTagEdit = (tag) => {
    setEditingTagId(tag._id);
    setTagFormData({
      name: tag.name,
    });
  };

  // Delete Category
  const handleCategoryDelete = async (id) => {
    await axios.delete(`http://localhost:3000/categories/${id}`);
    fetchCategories();
  };

  // Delete Tag
  const handleTagDelete = async (id) => {
    await axios.delete(`http://localhost:3000/pref-tags/${id}`);
    fetchTags();
  };

  // Reset form after submit for categories
  const resetCategoryForm = () => {
    setEditingCategoryId(null);
    setCategoryFormData({
      name: "",
    });
  };

  // Reset form after submit for tags
  const resetTagForm = () => {
    setEditingTagId(null);
    setTagFormData({
      name: "",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Admin - Manage Categories & Preference Tags
      </h1>

      {/* Form for adding or editing categories */}
      <form
        onSubmit={handleCategorySubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <h2 className="text-xl font-bold mb-4">Manage Activity Categories</h2>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="categoryName"
          >
            Category Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter category name (e.g., food, concert, sports)"
            value={categoryFormData.name}
            onChange={handleCategoryInputChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {editingCategoryId ? "Update" : "Create"} Category
          </button>
          {editingCategoryId && (
            <button
              onClick={resetCategoryForm}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Form for adding or editing tags */}
      <form
        onSubmit={handleTagSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <h2 className="text-xl font-bold mb-4">Manage Preference Tags</h2>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="tagName"
          >
            Tag Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter tag name (e.g., historic areas, beaches, family-friendly)"
            value={tagFormData.name}
            onChange={handleTagInputChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {editingTagId ? "Update" : "Create"} Tag
          </button>
          {editingTagId && (
            <button
              onClick={resetTagForm}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Display list of categories */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
        <h2 className="text-xl font-bold mb-4">Activity Categories</h2>
        {categories.length === 0 ? (
          <p>No categories available.</p>
        ) : (
          <ul className="divide-y divide-gray-300">
            {categories.map((category) => (
              <li key={category._id} className="py-4 flex justify-between">
                <span className="font-medium">{category.name}</span>
                <div>
                  <button
                    onClick={() => handleCategoryEdit(category)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleCategoryDelete(category._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Display list of tags */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-4">
        <h2 className="text-xl font-bold mb-4">Preference Tags</h2>
        {tags.length === 0 ? (
          <p>No tags available.</p>
        ) : (
          <ul className="divide-y divide-gray-300">
            {tags.map((tag) => (
              <li key={tag._id} className="py-4 flex justify-between">
                <span className="font-medium">{tag.name}</span>
                <div>
                  <button
                    onClick={() => handleTagEdit(tag)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleTagDelete(tag._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Admins;
