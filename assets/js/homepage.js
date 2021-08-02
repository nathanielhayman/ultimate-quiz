window.onload = () => {
    const startButton = document.querySelector("#start-btn");

    function animateBtn(button, out, last) {
        last = Math.round(last * 10000) / 10000;
        console.log(last);
        if (out) {
            button.setAttribute("style", `transform: scale(${last}, ${last});`);
            last += 0.001;
            if (last >= 1.05) out = false;
        } else {
            last -= 0.001;
            button.setAttribute("style", `transform: scale(${last}, ${last});`);
            if (last <= 0.95) out = true;
        }
        setTimeout(() => animateBtn(button, out, last), 10);
    }

    changeDifficulty('med');

    //animateBtn(startButton, true, 0.9);
    console.log("Hello World!");
}

function changeDifficulty(d) {
    let bar = document.querySelector('.difficulty-fill');
    let two = document.querySelector('.difficulty-dot.mid');
    let three = document.querySelector('.difficulty-dot.right');
    let start = document.querySelector('#start');
    switch (d) {
        case 'easy':
            bar.setAttribute("style", "width: 0%");
            two.setAttribute("style", "background-color: #262f36;");
            three.setAttribute("style", "background-color: #262f36;");
            start.setAttribute("href", "/quiz?difficultyLevel=easy");
            break;
        case 'med':
            bar.setAttribute("style", "width: 50%");
            two.setAttribute("style", "background-color: #41e049;");
            three.setAttribute("style", "background-color: #262f36;");
            start.setAttribute("href", "/quiz?difficultyLevel=med");
            break;
        case 'hard':
            bar.setAttribute("style", "width: 100%");
            two.setAttribute("style", "background-color: #41e049;");
            three.setAttribute("style", "background-color: #41e049;");
            start.setAttribute("href", "/quiz?difficultyLevel=hard");
            break;
    }
}