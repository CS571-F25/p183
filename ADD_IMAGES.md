# Adding Profile Photos

To add your profile photos to the website:

1. **Copy your images to the assets folder:**
   - Copy `DSCF8789.JPG` to `src/assets/profile-headshot.jpg` (Home page)
   - Copy `IMG_1964.jpeg` to `src/assets/profile-outdoor.jpg` (About page)

2. **File formats:**
   - You can use `.jpg`, `.jpeg`, or `.png` formats
   - Make sure the filenames match exactly:
     - `profile-headshot.jpg` for Home page
     - `profile-outdoor.jpg` for About page

3. **If you get import errors:**
   - The build will fail if the images don't exist
   - Once you add them, the site will automatically use them
   - If images fail to load, the Avatar component will show a placeholder gradient

4. **Optimization tips:**
   - Consider resizing large images before adding (e.g., 400x400px for avatars)
   - Vite will optimize them during build

