document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       SECTIONS
    ========================= */

    const awakening = document.querySelector(".awakening");
    const authSection = document.querySelector(".auth-section");
    const signinSection = document.querySelector(".signin-section");
    const signupSection = document.querySelector(".signup-section");
    const dashboardSection = document.querySelector(".dashboard-section");
    const learnSection = document.querySelector(".learn-section");
    const practiceSection = document.querySelector(".practice-section");


    /* =========================
       BUTTONS
    ========================= */

    const startButton = document.querySelector(".start-btn");
    const signinButton = document.querySelector(".signin-btn");
    const createAccountButton = document.querySelector(".create-account-main-btn");
    const createAccountFromSignin = document.querySelector(".create-account-btn");
    const logoutButton = document.querySelector(".logout-btn");

    const continueLearningButton = document.querySelector(
        ".dashboard-card:first-child .dashboard-btn"
    );

    const backDashboardButton = document.querySelector(
        ".back-dashboard-btn"
    );

    const continueLessonButton = document.querySelector(
        ".lesson-next-btn"
    );

    const backLearnButton = document.querySelector(
        ".back-learn-btn"
    );


    /* =========================
       FORMS
    ========================= */

    const signinForm = document.querySelector(".signin-form");
    const signupForm = document.querySelector(".signup-form");


    /* =========================
       CODE EDITOR
    ========================= */

    const runCodeButton = document.querySelector(".run-code-btn");
    const codeInput = document.querySelector(".code-input");
    const previewScreen = document.querySelector(".preview-screen");
    const feedbackMessage = document.querySelector(".feedback-message");


    /* =========================
       INITIAL PAGE STATE
    ========================= */

    awakening.style.display = "flex";
    authSection.style.display = "none";
    signinSection.style.display = "none";
    signupSection.style.display = "none";
    dashboardSection.style.display = "none";
    learnSection.style.display = "none";
    practiceSection.style.display = "none";


    /* =========================
       START CODING
    ========================= */

    startButton.addEventListener("click", function () {
        awakening.style.display = "none";
        authSection.style.display = "flex";
    });


    /* =========================
       OPEN SIGN IN
    ========================= */

    signinButton.addEventListener("click", function () {
        authSection.style.display = "none";
        signinSection.style.display = "flex";
    });


    /* =========================
       OPEN CREATE ACCOUNT
       FROM AUTH
    ========================= */

    createAccountButton.addEventListener("click", function () {
        authSection.style.display = "none";
        signupSection.style.display = "flex";
    });


    /* =========================
       OPEN CREATE ACCOUNT
       FROM SIGN IN
    ========================= */

    createAccountFromSignin.addEventListener("click", function () {
        signinSection.style.display = "none";
        signupSection.style.display = "flex";
    });


    /* =========================
       SIGN IN FORM
    ========================= */

    signinForm.addEventListener("submit", function (event) {
        event.preventDefault();

        signinSection.style.display = "none";
        dashboardSection.style.display = "block";

        window.scrollTo(0, 0);
    });


    /* =========================
       CREATE ACCOUNT FORM
    ========================= */

    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();

        signupSection.style.display = "none";
        dashboardSection.style.display = "block";

        window.scrollTo(0, 0);
    });


    /* =========================
       OPEN LEARN
    ========================= */

    continueLearningButton.addEventListener("click", function () {
        dashboardSection.style.display = "none";
        learnSection.style.display = "block";

        window.scrollTo(0, 0);
    });


    /* =========================
       BACK TO DASHBOARD
    ========================= */

    backDashboardButton.addEventListener("click", function () {
        learnSection.style.display = "none";
        dashboardSection.style.display = "block";

        window.scrollTo(0, 0);
    });


    /* =========================
       OPEN PRACTICE
    ========================= */

    continueLessonButton.addEventListener("click", function () {
        learnSection.style.display = "none";
        practiceSection.style.display = "block";

        window.scrollTo(0, 0);
    });


    /* =========================
       BACK TO LEARN
    ========================= */

    backLearnButton.addEventListener("click", function () {
        practiceSection.style.display = "none";
        learnSection.style.display = "block";

        window.scrollTo(0, 0);
    });


    /* =========================
       RUN CODE + FEEDBACK
    ========================= */

    runCodeButton.addEventListener("click", function () {

        const code = codeInput.value.trim();

        /* Clear previous feedback */
        feedbackMessage.className = "feedback-message";
        feedbackMessage.textContent = "";


        /* Empty code */
        if (code === "") {

            previewScreen.innerHTML = `
                <p class="preview-placeholder">
                    Your result will appear here.
                </p>
            `;

            feedbackMessage.classList.add("error");

            feedbackMessage.innerHTML = `
                <strong>Not quite.</strong><br>
                Your code is empty. Try writing an HTML heading using &lt;h1&gt;.
            `;

            return;
        }


        /* Show user's code */
        previewScreen.innerHTML = code;


        /* Check opening and closing h1 tags */
        const hasOpeningH1 = code.includes("<h1>");
        const hasClosingH1 = code.includes("</h1>");


        /* Missing both tags */
        if (!hasOpeningH1 && !hasClosingH1) {

            feedbackMessage.classList.add("error");

            feedbackMessage.innerHTML = `
                <strong>Not quite.</strong><br>
                Missing heading tag. Use &lt;h1&gt; to create the heading.
            `;

            return;
        }


        /* Missing closing tag */
        if (hasOpeningH1 && !hasClosingH1) {

            feedbackMessage.classList.add("error");

            feedbackMessage.innerHTML = `
                <strong>Almost there.</strong><br>
                You opened an &lt;h1&gt; tag, but you forgot to close it with &lt;/h1&gt;.
            `;

            return;
        }


        /* Missing opening tag */
        if (!hasOpeningH1 && hasClosingH1) {

            feedbackMessage.classList.add("error");

            feedbackMessage.innerHTML = `
                <strong>Almost there.</strong><br>
                You have a closing &lt;/h1&gt; tag, but the opening &lt;h1&gt; tag is missing.
            `;

            return;
        }


        /* =========================
           CHECK HEADING CONTENT
        ========================= */

        const h1Match = code.match(/<h1>(.*?)<\/h1>/i);

        const headingText = h1Match
            ? h1Match[1].trim()
            : "";

        const expectedText = "Hello, Developer!";


        /* Wrong heading text */
        if (headingText !== expectedText) {

            feedbackMessage.classList.add("error");

            feedbackMessage.innerHTML = `
                <strong>Almost there.</strong><br>
                Your &lt;h1&gt; tag is correct, but the text should be
                <strong>Hello, Developer!</strong>
            `;

            return;
        }


        /* =========================
           CORRECT ANSWER
        ========================= */

        feedbackMessage.classList.add("correct");

        feedbackMessage.innerHTML = `
            <strong>Correct! ✓</strong><br>
            Great job! You created an HTML heading using &lt;h1&gt;.
        `;

    });


    /* =========================
       LOG OUT
    ========================= */

    logoutButton.addEventListener("click", function () {

        dashboardSection.style.display = "none";
        learnSection.style.display = "none";
        practiceSection.style.display = "none";

        awakening.style.display = "flex";

        window.scrollTo(0, 0);
    });

});