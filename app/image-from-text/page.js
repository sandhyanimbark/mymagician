'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';  // Import the useRouter hook for navigation
import { supabase } from '../../lib/supabaseClient';  // Ensure the path to your Supabase client is correct
import toast, { Toaster } from 'react-hot-toast';  // Importing react-hot-toast

export default function ImageFromText() {
  const [text, setText] = useState('');  // State to store user input
  const [imageUrl, setImageUrl] = useState(null);  // State to store fetched image URL
  const [loading, setLoading] = useState(false);  // Loading state
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);  // State to control button

  const router = useRouter();  // Initialize the useRouter hook for navigation

  // Hardcoded link to be displayed
  const hardcodedLink = 'https://drive.google.com/drive/folders/187Fqr3nCzms32wKMvyb0';

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);  // Start loading
    console.log('Searching for text:', `"${text}"`);

    const { data, error } = await supabase
      .from('image_text_pairs')
      .select('image_url')  // Query image_url
      .ilike('text_content', text)  // Case-insensitive search for the text
      .single();  // Return a single record
  
    if (error || !data) {
      console.error('Error fetching image or no image found:', error);
      setImageUrl(null);  // Clear the image if no image is found
      setLoading(false);  // Stop loading on error
      toast.error("We don't have such images mapped with the text that you entered.");
    } else {
      let correctedImageUrl = data?.image_url || '';
      if (correctedImageUrl.includes('/public/public/')) {
        correctedImageUrl = correctedImageUrl.replace('/public/public/', '/public/');  // Correct the URL
      }

      if (correctedImageUrl) {
        setImageUrl(correctedImageUrl);
        toast.success('Mil gayaa image hurray!');
      } else {
        setImageUrl(null);  // Clear the image if no image found
        toast.error("We don't have such images mapped with the text that you entered.");
      }

      setLoading(false);  // Stop loading once done
    }
  };

  // Handle text input changes
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setText(inputValue);

    // Enable or disable the button based on the input
    if (inputValue.trim() === '') {
      setIsButtonDisabled(true);
      setImageUrl(null);  // Clear the image if the text input is cleared
    } else {
      setIsButtonDisabled(false);
    }
  };

  // Function to clear the text and image
  const clearText = () => {
    setText('');
    setImageUrl(null);
    setIsButtonDisabled(true);  // Disable the button
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-100 via-purple-300 to-purple-500 p-4">
      <Toaster position="top-right" reverseOrder={false} />  {/* Toast notification container */}

      <h1 className="text-4xl font-extrabold text-white mb-8">
        Find Image by Text
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg space-y-6 w-full max-w-lg"
      >
        <div className="flex items-center relative">
          <input
            type="text"
            value={text}
            onChange={handleInputChange}
            placeholder="Enter text to find image"
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
          />
          {text && (
            <button
              type="button"
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={clearText}
            >
              {/* Heroicon Trash Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7m5-4h4a2 2 0 012 2v1H8V5a2 2 0 012-2zM4 7h16" />
              </svg>
            </button>
          )}
        </div>

        <button
          type="submit"
          className={`w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 hover:bg-purple-700 ${loading || isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading || isButtonDisabled}  // Disable button when loading or no text
        >
          {loading ? 'Searching...' : 'Get Image'}
        </button>
      </form>

      {/* Display Image if result is found */}
      {imageUrl && !loading && (
        <div className="mt-6">
          {imageUrl === 'No image found for this text' ? (
            <p className="text-red-600 text-lg">{imageUrl}</p>
          ) : (
            <img 
              src={imageUrl} 
              alt="Retrieved" 
              className="w-full max-w-3xl rounded-lg shadow-lg object-contain h-auto max-h-96"  // Adjusted styling for better image appearance
            />
          )}
        </div>
      )}

      
      {/* Beautified Hardcoded Link Section */}
      {imageUrl && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg w-full max-w-lg text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Go to drive link and then download the image ji!</h2>
          {/* <p className="text-gray-600 mb-4">
            Download the image using the link below.
          </p> */}
          <a
            href={'https://drive.google.com/drive/folders/187Fqr3nCzms32wKMvyb0Le3E7qmt6a3s?usp=sharing'}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 transition duration-300 ease-in-out"
          >
            Click here Magician!
          </a>
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
