import { useEffect, useState } from 'react'
import axios from 'axios'
import Pusher from 'pusher-js'

const UserDashboard = () => {
    const [imagePreview, setImagePreview] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)
    const [uploadStatus, setUploadStatus] = useState('')
    const [progress, setProgress] = useState(0)
    const [isGenerating, setIsGenerating] = useState(false)
    const [generationMessage, setGenerationMessage] = useState('')
    const [generatedImages, setGeneratedImages] = useState([]) // State for generated images

    useEffect(() => {
        // Set default Axios configuration
        axios.defaults.withCredentials = true
        axios.defaults.baseURL = 'http://localhost:8000'

        const fetchCsrfToken = async () => {
            try {
                await axios.get('/sanctum/csrf-cookie')
            } catch (error) {
                console.error('Failed to fetch CSRF token:', error)
            }
        }

        fetchCsrfToken()
    }, [])

    const handleImageChange = event => {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
            setSelectedImage(file)
        } else {
            setImagePreview(null)
            setSelectedImage(null)
        }
    }

    const handleImageUpload = async event => {
        event.preventDefault()
        if (!selectedImage) {
            setUploadStatus('Please select an image.')
            return
        }

        const formData = new FormData()
        formData.append('image', selectedImage)

        try {
            const response = await axios.post('/api/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                },
            })
            setUploadStatus('Upload successful!')
            console.log(response.data)

            // Start image generation after successful upload
            const imageId = response.data.image.id
            await handleGenerate(imageId)
        } catch (error) {
            console.error('Upload failed:', error)
            setUploadStatus('Upload failed. Please try again.')
        }
    }

    const handleGenerate = async imageId => {
        setIsGenerating(true)
        setProgress(0)
        setGenerationMessage('')

        // Initialize Pusher
        const pusher = new Pusher('15483f78c495d25ba602', {
            cluster: 'ap2',
            encrypted: true,
        })

        const userId = 2 // Assuming user ID is 2, replace with the actual user ID

        // Subscribe to the private channel for this user
        const channel = pusher.subscribe(`images.${userId}`)
        console.log('Channel Subscribed:', channel)

        try {
            const response = await axios.get(
                `/api/generate-variations/${imageId}`,
            )
            console.log('Image generation started:', response.data)

            if (response.data.success) {
                setGenerationMessage(response.data.message)

                // Listen for the 'image.generated' event
                channel.bind('image.generated', data => {
                    console.log('Image generation data received:', data)

                    // Update progress
                    setProgress(data.imageData.progress)

                    // Add newly generated image URL to the gallery
                    setGeneratedImages(prevImages => [
                        ...prevImages,
                        data.imageData.url,
                    ])
                })

                channel.bind('pusher:subscription_succeeded', () => {
                    console.log(`Successfully subscribed to images.${userId}`)
                })

                channel.bind('pusher:subscription_error', status => {
                    console.error(`Subscription error: ${status}`)
                })
            }
        } catch (error) {
            console.error('Error starting image generation:', error)
            setIsGenerating(false)
            setGenerationMessage(
                'An error occurred while starting image generation.',
            )
        }
    }

    return (
        <div className="flex flex-col md:flex-row p-6 md:p-10 bg-gray-100">
            {/* Left Column for Image Upload and Preview */}
            <div className="md:w-1/3 p-4 md:p-6 bg-white shadow-md rounded-lg h-full flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-4 text-center">
                    Upload Image
                </h2>
                {generationMessage && (
                    <p className="my-2 text-yellow-700">{generationMessage}</p>
                )}
                <form onSubmit={handleImageUpload} className="w-full">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="border border-gray-300 rounded-lg p-2 mb-4 w-full transition duration-200 ease-in-out hover:shadow-lg focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white rounded p-2 w-full">
                        Upload
                    </button>
                </form>
                {imagePreview && (
                    <div className="flex-grow w-full flex items-center justify-center">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="mt-4 h-auto max-w-full max-h-[400px] rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                        />
                    </div>
                )}
                {uploadStatus && (
                    <p className="mt-4 text-red-500">{uploadStatus}</p>
                )}
                {isGenerating && (
                    <p className="mt-4 text-green-500">
                        Generating image variations... {progress}%
                    </p>
                )}

                <div className="mt-4 w-full">
                    <div className="relative w-full h-4 bg-gray-200 rounded">
                        <div
                            className="absolute top-0 left-0 h-full bg-blue-500 rounded"
                            style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-center">{progress}%</p>
                </div>
            </div>

            {/* Right Column for Gallery */}
            <div className="md:w-2/3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2 overflow-y-scroll md:px-4">
                {generatedImages.map((imageUrl, index) => (
                    <div
                        key={index}
                        className="rounded-lg overflow-hidden shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
                        <img
                            className="h-full w-full object-cover" // Set a fixed height and full width
                            src={imageUrl} // Use the image URL from the generated images
                            alt={`Generated image ${index + 1}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UserDashboard
