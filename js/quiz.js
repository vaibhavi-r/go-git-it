(function() {
  function buildQuiz() {
    // we'll need a place to store the HTML output
    const output = [];
    // const buttons = `<div id="quiz"></div><button id="submit">Submit Quiz</button><div id="results"></div>`;
    // for each question...
    myQuestions.forEach((currentQuestion, questionNumber) => {
      // we'll want to store the list of answer choices
      const answers = [];

      // and for each available answer...
      for (letter in currentQuestion.answers) {
        // ...add an HTML radio button
        answers.push(
          `<label>
            <input type="radio" name="question${questionNumber}" value="${letter}">
            ${letter} :
            ${currentQuestion.answers[letter]}
          </label>`
        );
      }

      // add this question and its answers to the output
      output.push(
        `<div class="question"> ${currentQuestion.question} </div>
        <div class="answers"> ${answers.join("")} </div>`
      );
    });
    // output.push(buttons);

    // finally combine our output list into one string of HTML and put it on the page
    console.log("questions", typeof(output.join("")));
    quizContainer.innerHTML = output.join("");
  }

  function showResults() {
    // gather answer containers from our quiz
    const answerContainers = quizContainer.querySelectorAll(".answers");
    const questionContainers = quizContainer.querySelectorAll(".question");
    // keep track of user's answers
    let numCorrect = 0;

    // for each question...
    myQuestions.forEach((currentQuestion, questionNumber) => {
      // find selected answer
      const answerContainer = answerContainers[questionNumber];
      const selector = `input[name=question${questionNumber}]:checked`;
      const userAnswer = (answerContainer.querySelector(selector) || {}).value;

      // if answer is correct
      if (userAnswer === currentQuestion.correctAnswer) {
        // add to the number of correct answers
        numCorrect++;

        // color the answers green
        questionContainers[questionNumber].style.color = "lightgreen";
      } else {
        // if answer is wrong or blank
        // color the answers red
        questionContainers[questionNumber].style.color = "red";
      }
    });

    // show number of correct answers out of total
    resultsContainer.innerHTML = `${numCorrect} out of ${myQuestions.length} correct`;
  }

  const quizContainer = document.getElementById("quiz");
  const resultsContainer = document.getElementById("results");
  const submitButton = document.getElementById("submit");
  const myQuestions = [
    {
      question: "Which of the following commands will stage your entire directory and every non-empty directory inside your current directory?",
      answers: {
        a: "git status all",
        b: "git add .",
        c: "git commit all"
      },
      correctAnswer: "b"
    },
    {
      question: "Regarding 'git fetch', 'git pull' and 'git push' which of the following statements is true?",
      answers: {
        a: "'git fetch' does not communicate with a remote, 'git pull' does",
        b: "both 'git fetch' and 'git pull' retrieve all new commits from a remotee",
        c: " 'git pull' merges content for all branches, 'git fetch' does not"
      },
      correctAnswer: "b"
    },
    {
      question: "How does `git merge` handle whitespace differences between versions?",
      answers: {
        a: "They are ignored by default, this can be turned on",
        b: "Git can't track whitespace differences",
        c: "It depends on the operating system",
        d: "They are significant by default, this can be turned off"
      },
      correctAnswer: "d"
    }
  ];

  // display quiz right away
  buildQuiz();


  console.log("SUBMIT", submitButton);

  // on submit, show results

  submitButton.addEventListener("click", showResults);

})();
