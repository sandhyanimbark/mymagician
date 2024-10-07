'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function TextFromImage() {
  const [file, setFile] = useState(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Start loading state

    if (!file || !text) {
      console.error('Validation Error: No file or text provided');
      alert('Please select an image and provide text');
      setLoading(false);  // Stop loading if validation fails
      return;
    }

    try {
      // Sanitize the file name, prefix with timestamp
      const sanitizedFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

      // Log file size for debugging
      console.log('File size:', file.size);
      console.log('Attempting to upload file:', sanitizedFileName);
      console.log('Associated text:', text);

      // Upload image to Supabase storage, without specifying 'public/' twice
      const { data: storageData, error: storageError } = await supabase.storage
        .from('images')
        .upload(sanitizedFileName, file);  // Remove 'public/' from here

      if (storageError) {
        console.error('Error uploading image:', storageError.message);
        setLoading(false);
        return;
      }

      console.log('Image uploaded successfully:', storageData);

      // The generated image URL, Supabase automatically includes the public folder
      const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${storageData.path}`;
      console.log('Generated Image URL:', imageUrl);

      // Insert image URL and associated text into the database
      const { error: insertError, data: insertData } = await supabase
        .from('image_text_pairs')
        .insert([{ image_url: imageUrl, text_content: text }]);

      if (insertError) {
        console.error('Error inserting data:', insertError.message);
      } else {
        console.log('Insert successful:', insertData);
        alert('Image and text saved successfully!');
      }
    } catch (error) {
      console.error('Unexpected error:', error.message);
    }

    setLoading(false);  // Stop loading state
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-100 via-purple-300 to-purple-500">
      <h1 className="text-4xl font-extrabold text-white mb-8">
        Upload Image and Associate Text
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg space-y-6 w-full max-w-lg"
      >
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold mb-2">
            Choose an Image
          </label>
          <input
            type="file"
            accept="image/*" // Ensure that only images are accepted
            onChange={(e) => setFile(e.target.files[0])}
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold mb-2">
            Enter Associated Text
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type the text associated with the image"
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          type="submit"
          className={`w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 hover:bg-purple-700 ${loading ? 'opacity-50' : ''
            }`}
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Image and Text'}
        </button>
      </form>
    </div>
  );
}
