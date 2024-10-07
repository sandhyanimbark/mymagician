'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function ImageFromText() {
  const [text, setText] = useState('')
  const [imageUrl, setImageUrl] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Log the text being searched
    console.log('Searching for text:', text);
  
    // Make sure text is provided
    if (!text) {
      console.error('No text provided');
      return;
    }
  
    const { data, error } = await supabase
      .from('image_text_pairs')
      .select('image_url')
      .eq('text_content', text)
      .single();
  
    if (error) {
      console.error('Error fetching image:', error);
    } else if (!data) {
      console.error('No image found for this text.');
    } else {
      setImageUrl(data.image_url);
    }
  };
  
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to find image"
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Get Image
        </button>
      </form>
      {imageUrl && (
        <div className="mt-4">
          <img src={imageUrl} alt="Retrieved" className="max-w-full h-auto" />
        </div>
      )}
    </div>
  )
}
