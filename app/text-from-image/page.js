'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function TextFromImage() {
  const [file, setFile] = useState(null)
  const [text, setText] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!file || !text) {
      alert('Please select an image and provide text')
      return
    }

    // Upload image to Supabase storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from('images')
      .upload(`public/${file.name}`, file)

    if (storageError) {
      console.error('Error uploading image:', storageError)
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
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter associated text"
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Upload Image and Text
        </button>
      </form>
    </div>
  )
}
