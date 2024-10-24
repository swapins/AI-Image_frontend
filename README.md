
# Image Variation SaaS Application frontend - Next.js

This repository contains the frontend for a SaaS application that allows users to upload images and generate variations using a generative AI API. The frontend is built with **Next.js** and connects to a **Laravel** backend.

## Table of Contents

- Features
- Technologies Used
- Getting Started
- Frontend Setup
- Backend Setup
- Running the Application
- API Integration
- Testing
- Contributing
- License

## Features

- **User Authentication**: Registration and login functionality using Laravel's built-in authentication.
- **Image Upload**: Users can upload images (PNG or JPG), stored in AWS S3, with metadata maintained in MySQL.
- **Generative AI Integration**: Utilize a mock generative AI API (or an actual one, e.g., OpenAI DALL·E) to create variations of uploaded images.
- **User Dashboard**: A clean, responsive dashboard for users to manage their uploaded images and view/download generated variations.
- **Performance Optimization**: Efficient handling of large file uploads and API requests through Laravel Queues.
- **Real-time Updates**: Users can see progress updates for image generation using WebSockets.

## Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS, Axios
- **Backend**: Laravel, PHP, MySQL
- **Cloud Storage**: AWS S3 (or another cloud provider)

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (v14 or later)
- Yarn or npm
- Docker (optional, for easier setup)
- Composer for Laravel
- Access to an AWS account for S3 (or another cloud provider)

### Clone the Repository

1. Clone this repository to your local machine:
   ```
   git clone https://github.com/swapins/AI-Image_frontend.git
   cd AI-Image_frontend
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd AI-Image_frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Create a `.env.local` file in the `frontend` directory and add your API URL and user keys:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   PUSHER_API_KEY=your_api_key_here
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd ../backend
   ```

2. Install dependencies via Composer:
   ```
   composer install
   ```

3. Create a `.env` file based on the `.env.example` provided and configure your database and cloud storage settings. Include your generative AI API key in the backend `.env`:
   ```
   GENERATIVE_AI_API_KEY=your_api_key_here
   ```

4. Run migrations to set up the database:
   ```
   php artisan migrate
   ```

5. Start the Laravel development server:
   ```
   php artisan serve
   ```

### Running the Application

1. Start the frontend development server:
   ```
   cd ../frontend
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

2. Open your browser and navigate to `http://localhost:3000` to view the application.



## Testing

### Unit and Integration Tests

To run the tests:

1. **For Laravel**:
   ```
   cd backend
   php artisan test
   ```

2. **For Next.js**:
   ```
   cd frontend
   npm run test
   ```
   or
   ```
   yarn test
   ```

## Performance Considerations
- Use queues to offload time-consuming tasks like image generation.
- Optimize database queries with appropriate indexes and relationships.
- Store images on cloud services like AWS S3 to reduce local storage overhead and improve scalability.

## Bonus Features
- **Real-Time Updates**: Implemented via Pusher, users can see live updates of their image generation progress.
- **Role-Based Access Control (RBAC)**: Admin users can view all uploaded images, while regular users can only view their own.


## Developer Information

This project was developed by Swapin Vidya.

### Contact Information:
- **Email**: swapin@laravelone.in
- **GitHub**: [https://github.com/swapins](https://github.com/swapins)
- **LinkedIn**: [www.linkedin.com/in/swapin-vidya](www.linkedin.com/in/swapin-vidya)
- **Portfolio**: [https://sevati.in/swapin](https://sevati.in/swapin)

### Acknowledgments
Special thanks to all open-source libraries and tools used in this project:
