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
  const fileInputRef = useRef(null);  // Ref for the file input field
  const router = useRouter();  // Initialize the useRouter hook

  // Handle image upload and check for duplicates
  const handleImageCheck = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAssociatedText('');

    // Check if an image is selected
    if (!imageFile) {
      toast.error('Please upload an image to check.');
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

    // If the image is found, display the associated text
    if (imageData && imageData.length > 0) {
      setAssociatedText(imageData[0].text_content);
      toast.success('Associated text found!');
    } else {
      toast.error('No associated text found for this image.');
    }

    setLoading(false);
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Remove the selected file
  const handleRemoveFile = () => {
    setImageFile(null);  // Clear the file from state
    if (fileInputRef.current) {
      fileInputRef.current.value = '';  // Clear the file input field
    }
    setAssociatedText('');  // Clear associated text
    toast.success('Image removed successfully.');
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
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}  // Attach the ref to the file input
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {/* Show the selected file name and a remove button */}
          {imageFile && (
            <div className="flex items-center justify-between mt-2">
              <p className="text-gray-700">{imageFile.name}</p>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-red-600 font-semibold hover:underline flex items-center"
              >
                <TrashIcon className="h-6 w-6 text-red-600 hover:text-red-800" />
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          className={`w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 hover:bg-purple-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Checking...' : 'Check Image'}
        </button>
      </form>

      {/* Display the associated text */}
      {associatedText && (
        <div className="mt-4">
          <p className="text-green-600 font-semibold">
            Associated Text: {associatedText}
          </p>
        </div>
      )}
     
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
