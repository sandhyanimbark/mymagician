'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';  // Ensure the path to your Supabase client is correct

export default function ImageFromText() {
  const [text, setText] = useState('');  // State to store user input
  const [imageUrl, setImageUrl] = useState(null);  // State to store fetched image URL
  const [loading, setLoading] = useState(false);  // Loading state
  const [errorMessage, setErrorMessage] = useState('');  // State to store error message
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);  // State to control button

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');  // Reset error message

    // Check if the input is empty
    if (text.trim() === '') {
      setErrorMessage('Try to enter the text');
      return;
    }

    setLoading(true);  // Start loading
    console.log('Searching for text:', `"${text}"`);
  
    const { data, error } = await supabase
      .from('image_text_pairs')
      .select('image_url')
      .eq('text_content', text)  // Query based on input text
      .single();
  
    if (error) {
      console.error('Error fetching image:', error);
      setLoading(false);  // Stop loading on error
      setErrorMessage("We don't have such images mapped with the text that you entered.");
    } else {
      let correctedImageUrl = data?.image_url || '';
      if (correctedImageUrl.includes('/public/public/')) {
        correctedImageUrl = correctedImageUrl.replace('/public/public/', '/public/');  // Correct the URL
      }
    
      if (correctedImageUrl) {
        setImageUrl(correctedImageUrl);
      } else {
        setImageUrl('No image found for this text');
        setErrorMessage("We don't have such images mapped with the text that you entered.");
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
    } else {
      setIsButtonDisabled(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-100 via-purple-300 to-purple-500 p-4">
      <h1 className="text-4xl font-extrabold text-white mb-8">
        Find Image by Text
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg space-y-6 w-full max-w-lg"
      >
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold mb-2">
            Enter Text
          </label>
          <input
            type="text"
            value={text}
            onChange={handleInputChange}
            placeholder="Enter text to find image"
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          type="submit"
          className={`w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 hover:bg-purple-700 ${loading || isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading || isButtonDisabled}  // Disable button when loading or no text
        >
          {loading ? 'Searching...' : 'Get Image'}
        </button>
      </form>

      {/* Error Message */}
      {errorMessage && (
        <p className="mt-4 text-red-600">{errorMessage}</p>
      )}

      {/* Display Image if result is found */}
      {imageUrl && !errorMessage && (
        <div className="mt-6">
          {imageUrl === 'No image found for this text' ? (
            <p className="text-red-600 text-lg">{imageUrl}</p>
          ) : (
            <img src={imageUrl} alt="Retrieved" className="w-full rounded-lg shadow-lg object-cover h-auto max-h-96" />
          )}
        </div>
      )}
    </div>
  );
}
