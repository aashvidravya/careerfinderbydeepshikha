// ==========================================
// CAREER FINDER - RATING SYSTEM
// ==========================================

(function () {

    const RATING_KEY = "careerFinderRatingSubmitted";
    const TIME_KEY = "careerFinderActiveSeconds";
    const START_KEY = "careerFinderTimerStart";

    // 2 minutes
    const REQUIRED_TIME = 120;

    // ------------------------------------------
    // Don't show rating again if already submitted
    // ------------------------------------------

    if (localStorage.getItem(RATING_KEY) === "true") {
        return;
    }


    // ==========================================
    // CREATE RATING POPUP
    // ==========================================

    function createRatingPopup() {

        // Prevent duplicate popup
        if (document.getElementById("ratingOverlay")) {
            return;
        }

        const overlay = document.createElement("div");
        overlay.id = "ratingOverlay";

        overlay.innerHTML = `

            <div class="rating-popup">

                <button class="rating-close" id="ratingClose">
                    ×
                </button>

                <div class="rating-icon">
                    ⭐
                </div>

                <h2>Rate Career Finder</h2>

                <p class="rating-subtitle">
                    How was your experience?
                </p>

                <div class="rating-stars" id="ratingStars">

                    <button class="rating-star" data-rating="1">
                        ★
                    </button>

                    <button class="rating-star" data-rating="2">
                        ★
                    </button>

                    <button class="rating-star" data-rating="3">
                        ★
                    </button>

                    <button class="rating-star" data-rating="4">
                        ★
                    </button>

                    <button class="rating-star" data-rating="5">
                        ★
                    </button>

                </div>

                <p id="ratingText" class="rating-text">
                    Select a rating
                </p>

                <textarea
                    id="ratingFeedback"
                    class="rating-feedback"
                    placeholder="Tell us what you think (optional)..."
                    rows="4"
                ></textarea>

                <button
                    id="ratingSubmit"
                    class="rating-submit"
                >
                    Submit Rating
                </button>

                <p id="ratingStatus" class="rating-status"></p>

            </div>
        `;

        document.body.appendChild(overlay);


        // ==========================================
        // VARIABLES
        // ==========================================

        let selectedRating = 0;

        const stars =
            document.querySelectorAll(".rating-star");

        const ratingText =
            document.getElementById("ratingText");

        const ratingFeedback =
            document.getElementById("ratingFeedback");

        const submitButton =
            document.getElementById("ratingSubmit");

        const ratingStatus =
            document.getElementById("ratingStatus");

        const closeButton =
            document.getElementById("ratingClose");


        // ==========================================
        // STAR TEXT
        // ==========================================

        const ratingMessages = {
            1: "😞 Very Bad",
            2: "🙁 Needs Improvement",
            3: "🙂 Good",
            4: "😄 Great",
            5: "🤩 Excellent!"
        };


        // ==========================================
        // STAR CLICK
        // ==========================================

        stars.forEach(function (star) {

            star.addEventListener("click", function () {

                selectedRating =
                    Number(this.dataset.rating);

                stars.forEach(function (s) {

                    const value =
                        Number(s.dataset.rating);

                    if (value <= selectedRating) {
                        s.classList.add("selected");
                    } else {
                        s.classList.remove("selected");
                    }

                });

                ratingText.textContent =
                    ratingMessages[selectedRating];

            });

        });


        // ==========================================
        // STAR HOVER
        // ==========================================

        stars.forEach(function (star) {

            star.addEventListener("mouseenter", function () {

                const hoverRating =
                    Number(this.dataset.rating);

                stars.forEach(function (s) {

                    const value =
                        Number(s.dataset.rating);

                    if (value <= hoverRating) {
                        s.classList.add("hover");
                    } else {
                        s.classList.remove("hover");
                    }

                });

            });

        });


        document
            .getElementById("ratingStars")
            .addEventListener("mouseleave", function () {

                stars.forEach(function (s) {
                    s.classList.remove("hover");
                });

            });


        // ==========================================
        // CLOSE BUTTON
        // ==========================================

        closeButton.addEventListener(
            "click",
            function () {

                overlay.remove();

            }
        );


        // ==========================================
        // SUBMIT RATING
        // ==========================================

        submitButton.addEventListener(
            "click",
            async function () {

                // Rating required
                if (!selectedRating) {

                    ratingStatus.textContent =
                        "⭐ Please select a rating first.";

                    return;
                }


                const feedback =
                    ratingFeedback.value.trim();


                // ----------------------------------
                // SAVE LOCALLY IMMEDIATELY
                // ----------------------------------

                localStorage.setItem(
                    RATING_KEY,
                    "true"
                );


                // ----------------------------------
                // SHOW SUCCESS
                // ----------------------------------

                ratingStatus.textContent =
                    "🎉 Thank you for your rating!";

                submitButton.disabled = true;

                submitButton.textContent =
                    "Submitted ✓";


                // ----------------------------------
                // CLOSE POPUP
                // Don't wait for Netlify
                // ----------------------------------

                setTimeout(function () {

                    overlay.remove();

                }, 800);


                // ==================================
                // SEND DATA TO NETLIFY IN BACKGROUND
                // ==================================

                try {

                    const formData =
                        new URLSearchParams();


                    formData.append(
                        "form-name",
                        "career-finder-rating"
                    );

                    formData.append(
                        "rating",
                        String(selectedRating)
                    );

                    formData.append(
                        "feedback",
                        feedback
                    );

                    formData.append(
                        "page",
                        window.location.pathname
                    );

                    formData.append(
                        "submitted-at",
                        new Date().toISOString()
                    );

                    formData.append(
                        "bot-field",
                        ""
                    );


                    await fetch("/", {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/x-www-form-urlencoded"
                        },

                        body:
                            formData.toString()

                    });

                    console.log(
                        "Career Finder rating sent successfully."
                    );


                } catch (error) {

                    console.error(
                        "Rating could not be sent to Netlify:",
                        error
                    );

                }

            }
        );

    }


    // ==========================================
    // TIMER SYSTEM
    // ==========================================

    function startTimer() {

        let activeSeconds =
            Number(
                sessionStorage.getItem(TIME_KEY)
            ) || 0;


        let startTime =
            Date.now();


        sessionStorage.setItem(
            START_KEY,
            String(startTime)
        );


        // Check every second
        const timer =
            setInterval(function () {

                // If rating already submitted
                if (
                    localStorage.getItem(RATING_KEY)
                    === "true"
                ) {

                    clearInterval(timer);

                    return;
                }


                // Calculate active time
                const now =
                    Date.now();

                const elapsed =
                    Math.floor(
                        (now - startTime) / 1000
                    );


                // Update every second
                if (elapsed > activeSeconds) {

                    activeSeconds = elapsed;

                    sessionStorage.setItem(
                        TIME_KEY,
                        String(activeSeconds)
                    );

                }


                // ==================================
                // SHOW RATING AFTER 2 MINUTES
                // ==================================

                if (
                    activeSeconds >= REQUIRED_TIME
                ) {

                    clearInterval(timer);

                    createRatingPopup();

                }

            }, 1000);

    }


    // ==========================================
    // START AFTER PAGE LOAD
    // ==========================================

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            startTimer
        );

    } else {

        startTimer();

    }

})();