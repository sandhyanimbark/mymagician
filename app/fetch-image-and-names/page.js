'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';  // Import the useRouter hook from Next.js
import { supabase } from '../../lib/supabaseClient';  // Ensure the path to your Supabase client is correct

export default function ImageList() {
  const [imageData, setImageData] = useState([]);  // State to store the fetched image and text data
  const [loading, setLoading] = useState(true);  // Loading state
  const router = useRouter();  // Initialize the useRouter hook for navigation

  // Fetch image and text data from Supabase
  useEffect(() => {
    const fetchImageData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('image_text_pairs')  // Replace with your table name
        .select('image_url, text_content');  // Fetch image URL and associated text

      if (error) {
        console.error('Error fetching image data:', error);
        setLoading(false);
        return;
      }

      setImageData(data);
      setLoading(false);
    };

    fetchImageData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-2xl font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-100 via-purple-300 to-purple-500 p-6">
      <h1 className="text-4xl font-extrabold text-purple-700 mb-8">
        Uploaded Images and Associated Texts
      </h1>

      <div className="overflow-x-auto w-full max-w-5xl">
        <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <thead>
            <tr className="bg-purple-600 text-white text-left">
              <th className="px-6 py-4 font-semibold">Image</th>
              <th className="px-6 py-4 font-semibold">Associated Text</th>
            </tr>
          </thead>
          <tbody>
            {imageData.length > 0 ? (
              imageData.map((item, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                  } border-b border-gray-200`}
                >
                  <td className="px-6 py-4">
                    <img
                      src={item.image_url}
                      alt={`Image ${index + 1}`}
                      className="w-20 h-20 rounded-lg shadow-md object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {item.text_content}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center py-6 text-gray-700">
                  No images found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
     
      {/* Back Button Below Table */}
      <button
        className="mt-6 bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 transition duration-300 ease-in-out"
        onClick={() => router.push('/super-admin')}  // Redirect to the super admin dashboard
      >
        Back to Super Admin Dashboard
      </button>
    </div>
  );
}
