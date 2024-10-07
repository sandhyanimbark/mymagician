'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function TextFromImage() {
  const [file, setFile] = useState(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!file || !text) {
      alert('Please select an image and provide text')
      setLoading(false)
      return
    }

    try {
      // Upload image to Supabase storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('images')
        .upload(`public/${file.name}`, file)

      if (storageError) {
        console.error('Error uploading image:', storageError)
        setLoading(false)
        return
      }

      const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${storageData.path}`

      // Insert into the database
      const { error: insertError } = await supabase
        .from('image_text_pairs')
        .insert([{ image_url: imageUrl, text_content: text }])

      if (insertError) {
        console.error('Error inserting data:', insertError)
      } else {
        alert('Image and text saved successfully!')
      }
    } catch (error) {
      console.error('Unexpected error:', error)
    }

    setLoading(false)
  }

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
  )
}
