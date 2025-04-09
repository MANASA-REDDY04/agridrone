# AgriDrone - Drone Booking for Farmers

AgriDrone is a web application that allows farmers to book agricultural drones for spraying, monitoring, and other farming activities. The platform provides a seamless experience for scheduling drone services and managing bookings.

## Live Demo

- **Frontend:** [AgriDrone Live Demo](https://agridrone-xi.vercel.app/)
- **Backend Activation:** Visit [AgriDrone Backend](https://agridrone.onrender.com/) to activate the backend.

## Tech Stack

### Frontend:
- React.js (Vite for fast development)
- Tailwind CSS (for styling)
- Capacitor (for mobile app conversion - upcoming feature)

### Backend:
- Python (Flask framework)
- Firebase (for authentication and database storage)
- Render (for backend deployment)

## Features
- **User Authentication:** Sign up and log in with Firebase authentication.
- **Drone Booking:** Users can schedule drones for agricultural purposes.
- **Dashboard:** Farmers can manage their bookings.
- **Real-Time Status:** Updates on drone availability and scheduled bookings.
- **Responsive Design:** Works across all devices, including mobile.

## Installation

### Backend Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/agridrone-backend.git
   cd agridrone-backend
   ```
2. Create a virtual environment and activate it:
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Run the Flask server:
   ```sh
   flask run
   ```

### Frontend Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/agridrone-frontend.git
   cd agridrone-frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

## Deployment
- The backend is deployed on **Render**.
- The frontend is hosted on **Vercel**.

## Future Enhancements
- Convert the web application into a **mobile app** using Capacitor.
- Add **payment integration** for drone bookings.
- Implement **AI-based farm analysis** using drone imagery.

## Contributing
Pull requests are welcome! Please follow the standard development workflow:
1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m "Add new feature"`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a pull request

## License
This project is licensed under the MIT License.
