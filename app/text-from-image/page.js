'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';  // Import the useRouter hook from Next.js
import { supabase } from '../../lib/supabaseClient';  // Ensure the path to your Supabase client is correct
import { TrashIcon } from '@heroicons/react/24/outline';  // Heroicons for the dustbin icon
import toast, { Toaster } from 'react-hot-toast';  // For toast notifications

export default function UploadImage() {
  const [imageFile, setImageFile] = useState(null);  // State to store the selected image file
  const [text, setText] = useState('');  // State to store associated text
  const [loading, setLoading] = useState(false);  // Loading state
  const fileInputRef = useRef(null);  // Ref for the file input field

  const router = useRouter();  // Initialize the useRouter hook

  // Handle image upload
  const handleImageUpload = async (e) => {
    e.preventDefault();
    setLoading(true);  // Start loading

    // Check if both the image and text are provided
    if (!imageFile || text.trim() === '') {
      toast.error('Please provide both an image and associated text.');
      setLoading(false);
      return;
    }

    // Check for duplicate image or text
    const fileName = `${Date.now()}_${imageFile.name}`;
    const duplicateCheck = await checkForDuplicates(fileName, text.trim());

    if (duplicateCheck) {
      toast.error(duplicateCheck);  // Display duplicate error message
      setLoading(false);
      return;
    }

    // Upload the image to Supabase storage (ensure you have the storage bucket set up in Supabase)
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('images')  // Replace 'images' with your storage bucket name
      .upload(`public/${fileName}`, imageFile);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      toast.error('Failed to upload image. Please try again.');
      setLoading(false);
      return;
    }

    // Get the public URL of the uploaded image
    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${uploadData.path}`;

    // Save the image URL and associated text in the Supabase database
    const { error: insertError } = await supabase
      .from('image_text_pairs')  // Replace with your actual table name
      .insert([{ image_url: imageUrl, text_content: text.trim() }]);

    if (insertError) {
      console.error('Error inserting data:', insertError);
      toast.error('Failed to save image and text. Please try again.');
      setLoading(false);
      return;
    }

    toast.success('Image and text uploaded successfully!');
    setImageFile(null);  // Clear the file input after successful upload
    setText('');  // Clear the text input
    setLoading(false);  // Stop loading
    if (fileInputRef.current) {
      fileInputRef.current.value = '';  // Clear the file input field
    }
  };

  // Function to check for duplicates in the database
  const checkForDuplicates = async (fileName, textContent) => {
    try {
      // Check for duplicate image in the database
      const { data: imageData } = await supabase
        .from('image_text_pairs')
        .select('image_url')
        .like('image_url', `%${fileName}%`);

      if (imageData.length > 0) {
        return 'We have the same image already uploaded in our DB.';
      }

      // Check for duplicate text in the database
      const { data: textData } = await supabase
        .from('image_text_pairs')
        .select('text_content')
        .eq('text_content', textContent);

      if (textData.length > 0) {
        return 'We already have the associated text in our DB.';
      }

      return null;  // No duplicates found
    } catch (error) {
      console.error('Error checking for duplicates:', error);
      return 'Error occurred while checking for duplicates. Please try again.';
    }
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
    toast.success('Image removed successfully.');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-100 via-purple-300 to-purple-500 p-4">
      <Toaster position="top-right" reverseOrder={false} />  {/* Toast notifications */}

      <h1 className="text-4xl font-extrabold text-white mb-8">
        Upload Image and Associate Text
      </h1>
      <form
        onSubmit={handleImageUpload}
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

        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold mb-2">
            Enter Associated Text
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter associated text"
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          type="submit"
          className={`w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 hover:bg-purple-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Image and Text'}
        </button>
      </form>
        {/* Back Button Below Form */}
        <button
        className="mt-6 bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 transition duration-300 ease-in-out"
        onClick={() => router.push('/super-admin')}  // Redirect to the homepage
      >
        Back to Super Admin Dashboard
      </button>
    </div>
  );
}
