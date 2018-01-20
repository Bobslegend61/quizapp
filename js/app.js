(function() {
    let questionContainer = document.querySelector(".question-container p");
    let answerContainer = document.querySelector(".answer-container");
    let controls = document.querySelector(".controls");
    let previous = document.querySelector(".previous");
    let next = document.querySelector(".next");
    let submit = document.querySelector(".submit");

    fetch("https://opentdb.com/api.php?amount=20&type=multiple")
        .then(response => response.json())
        .then(data => {
            let totalQuestion = data.results.length - 1;
            let questionNumber = 0;
            let mark = [];
            
            changeQuestion(totalQuestion, questionNumber, data);
            next.addEventListener("click", () => {
                let answer = document.querySelector("input[name='answer']:checked") ? document.querySelector("input[name='answer']:checked").value : "wrong";
                let score = answer == data.results[questionNumber]["correct_answer"] ? 1 : 0;
                if(questionNumber <= mark.length) {
                    mark.splice(questionNumber, 1, score);
                }else {
                    mark.push(score);
                }
                questionNumber += 1;
                changeQuestion(totalQuestion, questionNumber, data);
            });
            previous.addEventListener("click", () => {
                questionNumber -= 1;
                changeQuestion(totalQuestion, questionNumber, data);
            });

            // submit for rating
            submit.addEventListener("click", e => {
                let answer = document.querySelector("input[name='answer']:checked") ? document.querySelector("input[name='answer']:checked").value : "wrong";
                let score = answer == data.results[questionNumber]["correct_answer"] ? 1 : 0;
                if(questionNumber <= mark.length) {
                    mark.splice(questionNumber, 1, score);
                }else {
                    mark.push(score);
                }
                let result = mark.reduce((a,b) => a+b);
                let h1 = document.createElement("h1");
                let h1Text = document.createTextNode(`Your Score: ${result} (${Math.round((result/20) * 100)}%)`);
                h1.appendChild(h1Text);
                let p = document.createElement("p");
                let button = document.createElement("button");
                let buttonText = document.createTextNode("Play Again");
                button.appendChild(buttonText);
                p.appendChild(button);
                document.querySelector(".container").innerHTML = `<h1>Your Score: ${result} (${Math.round((result/20) * 100)}%)</h1>
                <p><button type="button" onClick="window.location.reload();">Play Again</button></p>
                `;
                data.results.forEach(result => {
                    document.querySelector(".container").innerHTML += `<p>${result.question} | <span style="color:yellow">${result.correct_answer}</span></p>`
                });
            })
        })
        .catch(err => console.log(err));
      
    document.querySelector("button").addEventListener("click", () => {
        window.location.reload(true);
    });

    function changeQuestion(tQ, qN, data) {
        if(qN == 0) {
            previous.style.display = "none";
        }else {
            previous.style.display = "inline";
        }

        if(qN == tQ) {
            next.style.display = "none";
            submit.style.display = "inline";
        }else {
            next.style.display = "inline";
            submit.style.display = "none";
        }
        questionContainer.innerHTML = data.results[qN].question;
        let random = Math.round(Math.random() * 3);
        data.results[qN]["incorrect_answers"].length != 4 ? data.results[qN]["incorrect_answers"].splice(random, 0, data.results[qN]["correct_answer"]) : "";
        answerContainer.innerHTML = "";
        data.results[qN]["incorrect_answers"].forEach(answer => {
            answerContainer.innerHTML += `
                <div><label><input type="radio" name="answer" value="${answer}" /> ${answer.toUpperCase()}</label></div>
            `
        });
    }
})();