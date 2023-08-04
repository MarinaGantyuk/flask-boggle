class Game {
  constructor() {
    this.finalScore = 0;
    this.$answer = $(".answer");
    this.words = [];
    this.result = null;
    $("form").on("submit", this.handleSubmit.bind(this));
    this.renderTimer();
  }

  async handleSubmit(evt) {
    evt.preventDefault();
    console.log(this.$answer);

    let word = this.$answer.val();
    this.$answer.val("");

    if (word == "") {
      return;
    }
    if (!this.words.includes(word)) {
      // check server for validity
      const resp = await axios.get("/answer", { params: { word: word } });
      console.log(resp);
      this.result = resp.data.result;
    }
    this.renderpopup(word);
  }

  renderScore(score) {
    let scoreElement = $("#score");
    scoreElement.text(`your score ${score}`);
  }

  renderpopup(word) {
    let message = document.createElement("p");
    if (this.words.includes(word)) {
      message.className = "wrong";
      message.innerText = "already found";
    } else if (this.result == "ok") {
      message.className = "ok";
      message.innerText = "ok";
      this.finalScore += word.length;
      this.renderScore(this.finalScore);
      this.words.push(word);
    } else if (this.result == "not-on-board") {
      message.className = "wrong";
      message.innerText = "not on board";
    } else {
      message.className = "strange";
      message.innerText = "not valid word";
    }
    message.classList.add("notification");
    $("#result").html(message);
  }

  renderTimer() {
    let timerElement = $("#timer");
    let time = 60;
    timerElement.html(`time left ${time}`);
    let timer = setInterval(() => {
      time -= 1;
      timerElement.html(`time left ${time}`);
      if (time == 0) {
        clearInterval(timer);
        $("form").prop("disabled", true);
        const resp = axios.post(
          "/endgame",
          { score: this.finalScore },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
    }, 1000);
  }
}

let game = new Game();
