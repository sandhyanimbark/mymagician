'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function ImageList() {
  const [imageData, setImageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchImageData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('image_text_pairs')
        .select('image_url, text_content');

      if (error) {
        console.error('Error fetching image data:', error);
        setLoading(false);
        return;
      }

      setImageData(data);
      setLoading(false);
    };

    fetchImageData();

    // Close modal on Escape key press
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Function to handle image preview
  const handlePreview = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  // Function to handle image download
  const handleDownload = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'downloaded_image.jpg';  // Specify the filename for download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);  // Clean up the link element
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

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
              <th className="px-6 py-4 font-semibold">Actions</th>
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
                      className="w-20 h-20 rounded-lg shadow-md object-cover cursor-pointer"
                      onClick={() => handlePreview(item.image_url)}  // Preview on click
                    />
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {item.text_content}
                  </td>
                  <td className="px-6 py-4 flex items-center space-x-4">
                    {/* Eye Icon for Preview */}
                    <button
                      className="flex items-center justify-center w-10 h-10 bg-white border rounded-full hover:bg-gray-200 transition"
                      onClick={() => handlePreview(item.image_url)}
                    >
                      <EyeIcon className="h-6 w-6 text-purple-600" />
                    </button>

                    {/* Download Button */}
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                      onClick={() => handleDownload(item.image_url)}  // Download on click
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-700">
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
        onClick={() => router.push('/super-admin')}
      >
        Back to Super Admin Dashboard
      </button>

      {/* Modal for Image Preview */}
      {isModalOpen && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl relative">
            {/* Close Icon */}
            <button
              className="absolute top-2 right-2 bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
              onClick={closeModal}
            >
              <XMarkIcon className="h-6 w-6 text-gray-600" />
            </button>

            {/* Image Preview */}
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>
      )}
    </div>
  );
}
