# Wanderlust

Wanderlust is a full-stack web application (built using the **MERN** stack technologies) that allows users to explore, create, and manage travel listings — similar to platforms like Airbnb. Users can list their own properties, review other listings, rate them, and even add reviews using their voice.

## Features

- **Listings**
  - View all listings created by users
  - Any logged-in user can create their own listing
  - Edit and delete listings (owner-only access)

- **Authentication**
  - User Signup
  - User Login
  - User Logout
  - Session-based authentication to protect routes

- **Reviews & Ratings**
  - Logged-in users can add a review on any listing
  - Users can give a star rating along with their review
  - Only the user who created a review can delete that specific review

- **Voice-based Review (Special Feature)**
  - Users can add a review using their **voice** instead of typing
  - Speech is converted to text and submitted as a review

## Tech Stack

- **Frontend:** EJS (Embedded JavaScript templates), HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** Passport.js (Local Strategy) / Session-based auth
- **Voice Recognition:** Web Speech API (for voice-to-text review input)

## Project Structure (Example)

```
wanderlust/
├── models/
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── routes/
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── views/
│   ├── listings/
│   ├── users/
│   └── layouts/
├── public/
│   ├── css/
│   └── js/
├── utils/
├── app.js
└── package.json
```

## Core Functionalities Summary

| Feature | Description |
|---|---|
| Create Listing | Any authenticated user can create a new listing |
| Edit/Delete Listing | Only the listing owner can edit or delete it |
| Signup/Login/Logout | Full authentication flow for users |
| Add Review | Authenticated users can add a review with rating |
| Delete Review | Only the review's author can delete it |
| Voice Review | Users can dictate a review using voice input |

## Future Improvements

- Add image upload for listings
- Add search and filter functionality
- Add map integration for listing locations
- Add pagination for listings and reviews

## Author

Built by Rishikesh, B.Sc. IT (Hons.) student at Ranchi University.