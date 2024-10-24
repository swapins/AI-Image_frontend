import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [images, setImages] = useState([]);

    // Fetch images when the component mounts
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/user-images/1'); // UserID HardCoded For Demo
                const { data } = response.data;

                setImages(data);
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };

        fetchImages();
    }, []);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.length > 0 ? (
                images.map((image) => (
                    <div key={image.id} className="w-full h-48 md:h-56 lg:h-64">
                        <img
                            className="h-full w-full object-cover rounded-lg"
                            src={image.url}
                            alt={image.filename}
                        />
                    </div>
                ))
            ) : (
                <p>No images available</p>
            )}
        </div>
    );
};

export default AdminDashboard;
