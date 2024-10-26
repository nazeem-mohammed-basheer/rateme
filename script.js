let totalPoints = 0; // Keep track of total points
const leaderboard = []; // Array to hold leaderboard scores
let leadingImage = { src: '', score: 0 }; // Object to hold the leading image data
let imagePool = []; // Initialize the image pool as an empty array

let currentImageIndex = 0; // Track the current image being displayed

function uploadImages() {
    const fileInput1 = document.getElementById('imageUpload1');
    const fileInput2 = document.getElementById('imageUpload2');
    const files1 = fileInput1.files;
    const files2 = fileInput2.files;

    if (files1.length === 0 || files2.length === 0) {
        alert("Please upload both images.");
        return;
    }

    // Read both files
    const reader1 = new FileReader();
    const reader2 = new FileReader();

    reader1.onload = function(event) {
        const imgSrc1 = event.target.result; // Get the first image source
        imagePool.push(imgSrc1); // Add the first image to the pool

        // Once the first image is read, read the second image
        reader2.onload = function(event) {
            const imgSrc2 = event.target.result; // Get the second image source
            imagePool.push(imgSrc2); // Add the second image to the pool
            displayNextImage(); // Display the uploaded images
        };

        // Read the second file
        reader2.readAsDataURL(files2[0]); // Read the second file
    };

    // Read the first file
    reader1.readAsDataURL(files1[0]); // Read the first file
}

function displayNextImage() {
    if (currentImageIndex < imagePool.length - 1) { // Adjust to show two images for comparison
        const imageSrc1 = imagePool[currentImageIndex];
        const imageSrc2 = imagePool[currentImageIndex + 1];
        currentImageIndex += 2; // Move to the next pair of images

        const gallery = document.getElementById('gallery');
        gallery.innerHTML = ''; // Clear the previous images

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');

        // Create image elements for both uploaded images
        const img1 = document.createElement('img');
        img1.src = imageSrc1;
        
        const img2 = document.createElement('img');
        img2.src = imageSrc2;

        const rating = document.createElement('div');
        rating.innerHTML = `
            <span>Rate the first picture:</span>
            <button class="rate-btn" onclick="rateImage(this, 1, 0)">1</button>
            <button class="rate-btn" onclick="rateImage(this, 2, 0)">2</button>
            <button class="rate-btn" onclick="rateImage(this, 3, 0)">3</button>
            <button class="rate-btn" onclick="rateImage(this, 4, 0)">4</button>
            <button class="rate-btn" onclick="rateImage(this, 5, 0)">5</button>
            <div class="rating-result"></div>
        `;

        const rating2 = document.createElement('div');
        rating2.innerHTML = `
            <span>Rate the second picture:</span>
            <button class="rate-btn" onclick="rateImage(this, 1, 1)">1</button>
            <button class="rate-btn" onclick="rateImage(this, 2, 1)">2</button>
            <button class="rate-btn" onclick="rateImage(this, 3, 1)">3</button>
            <button class="rate-btn" onclick="rateImage(this, 4, 1)">4</button>
            <button class="rate-btn" onclick="rateImage(this, 5, 1)">5</button>
            <div class="rating-result"></div>
        `;

        imageContainer.appendChild(img1);
        imageContainer.appendChild(rating);
        imageContainer.appendChild(img2);
        imageContainer.appendChild(rating2);
        gallery.appendChild(imageContainer);
    } 
}

function rateImage(button, score, imageIndex) {
    const ratingResult = button.parentElement.querySelector('.rating-result');
    
    // Award points based on the rating score
    totalPoints = score;
    ratingResult.textContent = `You rated this picture: ${score}. Total Points: ${totalPoints}`;
    
    // Update total points display
    document.getElementById('totalPoints').textContent = `Total Points: ${totalPoints}`;

    // Update leaderboard
    updateLeaderboard(score);

    // Check if current rating is the highest and update leading image if necessary
    const imgSrc = button.parentElement.parentElement.querySelectorAll('img')[imageIndex].src;
    if (score > leadingImage.score) {
        leadingImage = { src: imgSrc, score: score };
        displayLeadingImage();
    }

    // Automatically display the next images after a rating
    displayNextImage();
}

function updateLeaderboard(score) {
   
        // Add new score to the leaderboard
        leaderboard.push({ points: score });
        
        // Sort leaderboard by points in descending order
        leaderboard.sort((a, b) => b.points - a.points);
        
        // Limit leaderboard to top 5
        if (leaderboard.length > 5) {
            leaderboard.pop();
        }

        // Update leaderboard display
        displayLeaderboard();

}

function displayLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard');
    leaderboardList.innerHTML = ''; // Clear current leaderboard display

    leaderboard.forEach(entry => {
        const listItem = document.createElement('li');
        listItem.textContent = `${entry.name}: ${entry.points} points`;
        leaderboardList.appendChild(listItem);
    });
}

function displayLeadingImage() {
    const leadingImageContainer = document.getElementById('leadingImageContainer');
    const leadingImageElement = document.getElementById('leadingImage');
    const leadingImageRating = document.getElementById('leadingImageRating');

    leadingImageElement.src = leadingImage.src;
    leadingImageRating.textContent = `Leading Image Rating: ${leadingImage.score}`;

    leadingImageContainer.style.display = 'block'; // Show the leading image container
}

// Start by displaying the first image
displayNextImage();
