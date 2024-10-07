'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function ImageFromText() {
  const [text, setText] = useState('')
  const [imageUrl, setImageUrl] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { data, error } = await supabase
      .from('image_text_pairs')
      .select('image_url')
      .eq('text_content', text)
      .single()

    if (error) {
      console.error('Error fetching image:', error)
    } else {
      setImageUrl(data?.image_url || 'No image found for this text')
    }
  }

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
