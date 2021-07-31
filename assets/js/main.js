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

    //animateBtn(startButton, true, 0.9);

    console.log("Hello World!");
}