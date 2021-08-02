window.onload = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if (urlParams.get('last')) {
        if (urlParams.get('last') == 'c') {
            let c = document.querySelector("#correct");
            c.setAttribute("style", "display: block");
            setTimeout(() => c.setAttribute("style", "display: none"), 2000);
        } else {
            let i = document.querySelector("#incorrect");
            i.setAttribute("style", "display: block");
            setTimeout(() => i.setAttribute("style", "display: none"), 2000);
        }
    }
}

function resolveAnswer(id, answer, question, difficulty) {
    const API_URL = "http://localhost:3000";
    const callOptions = {
        method: 'POST',
        body: JSON.stringify({ 'id': id,
                               'answer': answer.toLowerCase().replace(/[^a-z]/g, '') }),
        headers: {
            'Content-Type': 'application/json'
        }
    };
    fetch(API_URL+'/check-answer', callOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            if (result.result == "correct") {
                window.location.href = `http://localhost:3000/quiz?question=${question+1}&last=c&difficulty=${difficulty}`
                
            } else {
                window.location.href = `http://localhost:3000/quiz?question=${question+1}&last=i&difficulty=${difficulty}`
            }
        });
}