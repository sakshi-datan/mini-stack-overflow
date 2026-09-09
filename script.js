/* =====================================================
   MINI STACK OVERFLOW
   Main JavaScript File
===================================================== */


/* ================= INITIAL DATA ================= */

const defaultQuestions = [
    {
        id: 1,

        title: "How can I learn JavaScript as a beginner?",

        description:
            "I know basic HTML and CSS. What is the best way to start learning JavaScript and build projects?",

        tags: ["javascript", "beginner", "web-development"],

        votes: 5,

        answers: 2
    },

    {
        id: 2,

        title: "What is the difference between let and const in JavaScript?",

        description:
            "I am confused about when to use let and const. Can someone explain the difference with a simple example?",

        tags: ["javascript", "programming"],

        votes: 8,

        answers: 3
    },

    {
        id: 3,

        title: "How does HTML and CSS work together?",

        description:
            "I am building my first website and want to understand how HTML provides structure while CSS handles the design.",

        tags: ["html", "css", "web-development"],

        votes: 3,

        answers: 1
    }
];


/* ================= LOAD QUESTIONS ================= */

// Try to load saved questions from browser storage.
let questions =
    JSON.parse(localStorage.getItem("miniOverflowQuestions")) ||
    defaultQuestions;


/* ================= DOM ELEMENTS ================= */

const questionsContainer =
    document.getElementById("questions");

const questionCount =
    document.getElementById("questionCount");

const answerCount =
    document.getElementById("answerCount");

const voteCount =
    document.getElementById("voteCount");

const searchInput =
    document.getElementById("searchInput");

const askQuestionBtn =
    document.getElementById("askQuestionBtn");

const questionModal =
    document.getElementById("questionModal");

const closeModal =
    document.getElementById("closeModal");

const questionForm =
    document.getElementById("questionForm");


/* ================= SAVE DATA ================= */

function saveQuestions() {

    localStorage.setItem(
        "miniOverflowQuestions",
        JSON.stringify(questions)
    );
}


/* ================= DISPLAY QUESTIONS ================= */

function displayQuestions(questionArray = questions) {

    questionsContainer.innerHTML = "";


    // If there are no matching questions
    if (questionArray.length === 0) {

        questionsContainer.innerHTML = `
            <div class="question-card">
                <div class="question-content">
                    <h2>No questions found</h2>
                    <p class="question-description">
                        Try another search term.
                    </p>
                </div>
            </div>
        `;

        return;
    }


    // Create a card for every question
    questionArray.forEach(question => {

        const card =
            document.createElement("article");

        card.className = "question-card";


        card.innerHTML = `

            <!-- Voting -->

            <div class="vote-section">

                <button
                    class="vote-btn"
                    onclick="changeVote(${question.id}, 1)"
                    aria-label="Upvote question"
                >
                    ▲
                </button>

                <span class="vote-number">
                    ${question.votes}
                </span>

                <button
                    class="vote-btn"
                    onclick="changeVote(${question.id}, -1)"
                    aria-label="Downvote question"
                >
                    ▼
                </button>

                <span>votes</span>

            </div>


            <!-- Question -->

            <div class="question-content">

                <h2 class="question-title">
                    ${escapeHTML(question.title)}
                </h2>

                <p class="question-description">
                    ${escapeHTML(question.description)}
                </p>


                <!-- Tags -->

                <div class="tags">

                    ${question.tags
                        .map(tag => `
                            <span class="tag">
                                ${escapeHTML(tag)}
                            </span>
                        `)
                        .join("")}

                </div>


                <!-- Question information -->

                <div class="question-info">

                    ${question.answers} answers

                </div>

            </div>
        `;


        questionsContainer.appendChild(card);

    });


    updateStatistics();
}


/* ================= VOTING ================= */

function changeVote(id, amount) {

    const question =
        questions.find(q => q.id === id);


    if (!question) {
        return;
    }


    question.votes += amount;


    saveQuestions();

    displayQuestions();
}


/* ================= STATISTICS ================= */

function updateStatistics() {

    // Total questions
    questionCount.textContent =
        questions.length;


    // Total answers
    const totalAnswers =
        questions.reduce(
            (total, question) =>
                total + question.answers,
            0
        );

    answerCount.textContent =
        totalAnswers;


    // Total votes
    const totalVotes =
        questions.reduce(
            (total, question) =>
                total + question.votes,
            0
        );

    voteCount.textContent =
        totalVotes;
}


/* ================= SEARCH ================= */

searchInput.addEventListener(
    "input",
    function () {

        const searchText =
            searchInput.value
                .toLowerCase()
                .trim();


        // If search is empty
        if (searchText === "") {

            displayQuestions();

            return;
        }


        // Search title, description and tags
        const filteredQuestions =
            questions.filter(question => {

                const searchableText =
                    `
                    ${question.title}
                    ${question.description}
                    ${question.tags.join(" ")}
                    `.toLowerCase();


                return searchableText.includes(
                    searchText
                );
            });


        displayQuestions(
            filteredQuestions
        );
    }
);


/* ================= OPEN MODAL ================= */

askQuestionBtn.addEventListener(
    "click",
    function () {

        questionModal.classList.remove(
            "hidden"
        );
    }
);


/* ================= CLOSE MODAL ================= */

closeModal.addEventListener(
    "click",
    function () {

        questionModal.classList.add(
            "hidden"
        );
    }
);


/* ================= POST QUESTION ================= */

questionForm.addEventListener(
    "submit",
    function (event) {

        // Stop page refresh
        event.preventDefault();


        // Get form values
        const title =
            document
                .getElementById("questionTitle")
                .value
                .trim();


        const description =
            document
                .getElementById("questionDescription")
                .value
                .trim();


        const tagsInput =
            document
                .getElementById("questionTags")
                .value
                .trim();


        // Convert tags into an array
        const tags =
            tagsInput
                .split(",")
                .map(tag => tag.trim())
                .filter(tag => tag !== "");


        // Create new question
        const newQuestion = {

            id: Date.now(),

            title: title,

            description: description,

            tags: tags,

            votes: 0,

            answers: 0

        };


        // Add question to beginning
        questions.unshift(
            newQuestion
        );


        // Save data
        saveQuestions();


        // Update display
        displayQuestions();


        // Clear form
        questionForm.reset();


        // Close modal
        questionModal.classList.add(
            "hidden"
        );

    }
);


/* ================= SECURITY HELPER ================= */

/*
    This function prevents HTML entered by a user
    from being interpreted as actual HTML.
*/

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* ================= INITIAL DISPLAY ================= */

displayQuestions();