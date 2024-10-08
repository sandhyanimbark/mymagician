import Link from 'next/link';

export default function SuperAdminPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-100 via-purple-300 to-purple-500 p-6">
      {/* Page Title */}
      <h1 className="text-5xl font-extrabold mb-12 text-center text-purple-700">
        Super Admin Dashboard
      </h1>

      {/* Grid Layout for Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        
        {/* Card 1: Add Image and Associated Text */}
        <Link href="/text-from-image">
          <div className="bg-white p-8 h-full rounded-xl shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer flex flex-col justify-center items-center">
            <h2 className="text-3xl font-semibold text-purple-600 mb-4">
              Add Image and Associated Text
            </h2>
            <p className="text-gray-700">
              Upload an image and associate it with text.
            </p>
          </div>
        </Link>

        {/* Card 2: List of Images and Texts */}
        <Link href="/fetch-image-and-names">
          <div className="bg-white p-8 h-full rounded-xl shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer flex flex-col justify-center items-center">
            <h2 className="text-3xl font-semibold text-purple-600 mb-4">
              List of Images and Texts
            </h2>
            <p className="text-gray-700">
              View all images and their associated texts.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
