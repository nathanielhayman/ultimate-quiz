window.onload = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const id = urlParams.get('id');

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

    document.addEventListener('keyup', (e) => {
        if (e.key == "Enter") {
            let input = document.querySelector('#answer');
            if (input) {
                resolveAnswer(id, input.value);
            }
        }
    })
}

function resolveAnswer(id, answer) {
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
                window.location.href = `http://localhost:3000/quiz?id=${id}&last=c`
            } else {
                window.location.href = `http://localhost:3000/quiz?id=${id}&last=i`
            }
        });
}