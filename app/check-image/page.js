'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';  // Import the useRouter hook for navigation
import { supabase } from '../../lib/supabaseClient';  // Ensure the path to your Supabase client is correct
import { TrashIcon } from '@heroicons/react/24/outline';  // For the dustbin icon
import toast, { Toaster } from 'react-hot-toast';  // For toast notifications

export default function CheckImagePage() {
  const [imageFile, setImageFile] = useState(null);  // State to store the selected image file
  const [associatedText, setAssociatedText] = useState('');  // Associated text state
  const [loading, setLoading] = useState(false);  // Loading state
  const [imageChecked, setImageChecked] = useState(false);  // State to check if the image is checked
  const fileInputRef = useRef(null);  // Ref for the file input field
  const router = useRouter();  // Initialize the useRouter hook

  // Handle image upload and check for duplicates
  const handleImageCheck = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAssociatedText('');

    // Check if an image is selected
    if (!imageFile) {
      toast.error('Aree baba image toh add kriyee phir text generate hoga na ji!');
      setLoading(false);
      return;
    }

    // Get file name for lookup
    const fileName = imageFile.name;

    // Check for the same image in the database
    const { data: imageData, error: imageError } = await supabase
      .from('image_text_pairs')  // Replace with your table name
      .select('text_content')
      .like('image_url', `%${fileName}%`);

    if (imageError) {
      console.error('Error checking image:', imageError);
      toast.error('An error occurred while checking the image.');
      setLoading(false);
      return;
    }

    // If the image is found, display the associated text and hide the button
    if (imageData && imageData.length > 0) {
      setAssociatedText(imageData[0].text_content);
      setImageChecked(true);  // Image has been checked
      toast.success('Mil gayaaa textt!');
    } else {
      toast.error('Oyee ae toh system me nakooo! make sure to add the exact image haan ');
    }

    setLoading(false);
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
    setImageChecked(false);  // Reset the image check state when a new file is selected
  };

  // Remove the selected file
  const handleRemoveFile = () => {
    setImageFile(null);  // Clear the file from state
    if (fileInputRef.current) {
      fileInputRef.current.value = '';  // Clear the file input field
    }
    setAssociatedText('');  // Clear associated text
    setImageChecked(false);  // Reset the image check state
    toast.success('Han remove kr diya image ab phir se try kriyeeee.');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-100 via-purple-300 to-purple-500 p-4">
      <Toaster position="top-right" reverseOrder={false} /> {/* For toast notifications */}

      <h1 className="text-4xl font-extrabold text-white mb-8">
        Upload Image and Check for Associated Text
      </h1>
      <form
        onSubmit={handleImageCheck}
        className="bg-white p-8 rounded-lg shadow-lg space-y-6 w-full max-w-lg"
      >
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold mb-2">
            Choose an Image
          </label>
          <div className="relative flex items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}  // Attach the ref to the file input
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
            />

            {/* Show the dustbin icon to remove the file */}
            {imageFile && (
              <button
                type="button"
                onClick={handleRemoveFile}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {/* Trash Icon */}
                <TrashIcon className="h-6 w-6" />
              </button>
            )}
          </div>

          {/* Show the selected file name */}
          {imageFile && (
            <p className="text-gray-700 mt-2">
              {imageFile.name}
            </p>
          )}
        </div>

        {/* Check Image Button: Hide if the image has been checked */}
        {!imageChecked && (
          <button
            type="submit"
            className={`w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 hover:bg-purple-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Checking...' : 'Generate text'}
          </button>
        )}

        {/* Display the associated text inside the form with the same style as "Choose an Image" */}
        {associatedText && (
          <div className="mt-4">
            <label className="text-gray-700 font-semibold mb-2">
              Associated Text
            </label>
            <p className="text-gray-700">{associatedText}</p>
          </div>
        )}
      </form>

      {/* Back Button Below Form */}
      <button
        className="mt-6 bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 transition duration-300 ease-in-out"
        onClick={() => router.push('/')}  // Redirect to the homepage
      >
        Back to Home
      </button>
    </div>
  );
}
