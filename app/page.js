import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-100 via-purple-200 to-purple-300 p-6">
      {/* Main Heading */}
      <h1 className="text-5xl font-extrabold mb-12 text-center text-purple-700">
        Welcome to the Image-Text App!
      </h1>

      {/* Grid Layout for Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        
        {/* Option 1: Add Image and Text */}
        <Link href="/text-from-image">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer text-center">
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">
              Add Image and Associated Text
            </h2>
            <p className="text-gray-700">Upload an image and associate it with text.</p>
          </div>
        </Link>

        {/* Option 2: Check Image by Searching Text */}
        <Link href="/image-from-text">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer text-center">
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">
              Check Image by Searching Text
            </h2>
            <p className="text-gray-700">Find an image by searching for the associated text.</p>
          </div>
        </Link>

        {/* Option 3: Check Associated Text by Uploading Image */}
        <Link href="/check-image">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer text-center">
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">
              Check Associated Text by Uploading Image
            </h2>
            <p className="text-gray-700">Upload an image and find its associated text.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
