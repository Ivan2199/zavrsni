<template>
  <div class="container-page">
    <div class="BorderGlow">
      <article>
        <div class="quiz-wrap">
          <div class="quiz-title">
            <h1 class="title">{{ quiz2.title }}</h1>
            <div class="timer">
              <div>
                <div v-if="time">
                  <span
                    >{{ minutes | formatTime }}:{{ seconds | formatTime }}</span
                  ><br />
                </div>
                <div class="text-center" v-if="!time">Vrijeme Isteklo!</div>
              </div>
            </div>
          </div>

          <div
            class="quiz-main"
            v-for="question in quiz2.questions.slice(x, y)"
            :key="question.id"
            v-show="quizStart"
          >
            <div class="quiz-question">
              <h2>Pitanje {{ y }}/{{ quiz2.questions.length }}</h2>
              <h1>{{ question.text }}</h1>
              <img
                v-if="question.imageUrl"
                class="question_image"
                v-bind:src="question.imageUrl"
              />
              <p>Broj bodova - {{ question.scoreWorth }}</p>
            </div>
            <div class="question-suggestions">
              <ul>
                <li
                  v-for="answer_option in question.answerOptions"
                  :key="answer_option.id"
                  :class="select ? check(answer_option) : ''"
                  @click="selectResponse(answer_option, question)"
                >
                  {{ answer_option.text }}
                </li>
                <button v-if="submitedAnswer" @click="CorrectOrNot(question)">
                  Provjeri
                </button>
              </ul>
            </div>
          </div>
          <div class="box-quizEnd" v-if="quizEnd">
            <h1 class="theEnd">KRAJ!!</h1>
            <div class="score">
              <h2>Broj bodova:</h2>
              <p>{{ score }}</p>
            </div>
            <div class="pass" v-if="score > 108">
              <p class="pass" v-if="crossroads">Prolaz</p>
              <p class="fail" v-else-if="!crossroads">Pad(raskrizje)</p>
            </div>
            <div class="fail" v-else-if="score < 108">Pad</div>

            <div class="restart-button">
              <button @click="restartQuiz">Ponovno</button>
              <button v-if="!added" @click="doPostRequest">Predaj</button>
              <div class="infoAboutAdding" v-if="added">Dodano</div>
            </div>
          </div>
          <div class="footer-quiz" v-if="!quizEnd">
            <div class="box-button">
              <button
                @click="skipQuestion()"
                :style="!next ? 'background-color: rgb(106, 128, 202)' : ''"
              >
                Preskoči
              </button>
              <button
                @click="nextQuestion()"
                :style="next ? 'background-color: rgb(106, 128, 202)' : ''"
              >
                Slijedeći
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      answers: [],
      quiz2: null,
      x: 0,
      y: 1,
      select: false,
      quizEnd: false,
      quizStart: true,
      next: false,
      score: 0,
      result: 0,
      equalIds: 0,
      added: false,
      status: '',
      crossroads: true,
      deadline: new Date(new Date().getTime() + 45 * 60000),
      speed: 1000,
      currentTime: Date.parse(this.deadline) - Date.parse(new Date()),
      startTime: Date.parse(new Date()),
      time: true,
      endTime: '',
      correctAnswers: 0,
      checked: false,
      submitedAnswer: true
    }
  },
  mounted: function () {
    axios
      .get('http://localhost:8081/quiz/2')
      .then((response) => (this.quiz2 = response.data))
      .catch((error) => console.log(error))

    this.equalIds = this.$store.state.user.id
    setTimeout(this.countdown, 1000)
  },
  computed: {
    seconds() {
      return Math.floor((this.currentTime / 1000) % 60)
    },
    minutes() {
      return Math.floor((this.currentTime / 1000 / 60) % 60)
    }
  },
  filters: {
    formatTime(value) {
      if (value < 10) {
        return '0' + value
      }
      return value
    }
  },
  methods: {
    CorrectOrNot(question) {
      if (this.answers.length == this.correctAnswers) {
        this.select = true
        this.score += question.scoreWorth
        this.next = true
        this.submitedAnswer = false
      } else if (this.answers.length != this.correctAnswers) {
        this.select = true
        this.next = true
      }
    },
    countdown() {
      this.currentTime = Date.parse(this.deadline) - Date.parse(new Date())
      if (this.currentTime > 0) {
        setTimeout(this.countdown, this.speed)
      } else {
        this.currentTime = null
        if (!this.added) {
          this.doPostRequest()
        }
      }
    },
    selectResponse(answer, question) {
      this.correctAnswers = question.correctAnswers
      if (answer.isCorrect) {
        this.answers.push(answer.id)
      } else if (!answer.isCorrect) {
        if (question.scoreWorth == 7) {
          this.crossroads = false
        }
        this.next = true
        this.select = true
        this.submitedAnswer = false
        setTimeout(() => this.nextQuestion(), 2000)
      }
    },
    check(status) {
      if (status.isCorrect) {
        return 'correct'
      } else {
        return 'incorrect'
      }
    },
    nextQuestion() {
      if (!this.next) {
        return
      }
      if (this.quiz2.questions.length - 1 == this.x) {
        this.quizEnd = true
        this.quizStart = false
        this.result = this.score
        this.answers = []
      } else {
        this.x++
        this.y++
        this.checked = false
        this.select = false
        this.next = false
        this.answers = []
        this.submitedAnswer = true
      }
    },
    skipQuestion() {
      if (this.next) {
        return
      }
      if (this.quiz2.questions.length - 1 == this.x) {
        this.quizEnd = true
        this.quizStart = false
        this.result = this.score
        this.answers = []
      } else {
        this.x++
        this.y++
        this.select = false
        this.answers = []
        this.submitedAnswer = true
      }
    },
    restartQuiz() {
      this.x = 0
      this.y = 1
      this.select = false
      this.quizStart = true
      this.quizEnd = false
      this.next = false
      this.score = 0
      this.result = 0
      this.added = false
      this.crossroads = true
      this.time = true
      this.answers = []
      this.deadline = new Date(new Date().getTime() + 45 * 60000)
      this.currentTime = Date.parse(this.deadline) - Date.parse(new Date())
      setTimeout(this.countdown, 1000)
      this.submitedAnswer = true
    },
    doPostRequest: function () {
      if (this.score > 108) {
        if (this.crossroads) {
          this.status = 'Prolaz'
        } else {
          this.status = 'Pad'
        }
      } else if (this.score < 108) {
        this.status = 'Pad'
      }
      this.result = this.score
      let payload = {
        userId: this.$store.state.user.id,
        quizId: this.quiz2.id,
        score: this.result,
        startTime: this.startTime,
        status: this.status,
        endTime: Date.parse(new Date())
      }

      let res = axios.post('http://localhost:8081/quiz-result/add', payload)

      let data = res.data
      console.log(data)
      this.added = true
      this.quizStart = false
      this.quizEnd = true
      this.time = false
    }
  }
}
</script>

<style scoped>
.timer {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 42.7%;
  border: 2px solid white;
  height: 100%;
  width: 200px;
  border-radius: 10px;
  font-size: 25px;
  background: #380b80;
}
article {
  display: block;
  color: white;
  border-collapse: collapse;
  height: 89%;
  width: 76%;
  margin: 50px 10%;
  position: fixed;
  top: 48%;
  left: 40%;
  transform: translate(-50%, -50%);
  padding: 30px;
  background: rgb(41, 40, 40);
  z-index: 11;
  overflow: hidden;
  border-radius: 25px;
}
.BorderGlow::before,
.BorderGlow::after {
  content: '';
  position: fixed;
  top: 53.2%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(
    45deg,
    rgb(0, 174, 255),
    #0059ff,
    #1100ff,
    #580dd0,
    #8809ff,
    #6e0dd0,
    #c10cc7,
    #c10cc7,
    #6e0dd0,
    #8809ff,
    #580dd0,
    #1100ff,
    #0059ff,
    rgb(0, 174, 255)
  );
  background-size: 400%;
  width: 77%;
  height: 90.5%;
  border-radius: 25px;
  z-index: 10;
  animation: animate 70s linear infinite;
}
@keyframes animate {
  0% {
    background-position: 0 0;
  }
  50% {
    background-position: 400% 0;
  }
  100% {
    background-position: 0 0;
  }
}

.BorderGlow::after {
  filter: blur(40px);
}

::-webkit-scrollbar {
  width: 9px;
}

::-webkit-scrollbar-thumb {
  background: lightgray;
  border-collapse: collapse;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

.quiz-wrap {
  display: flex;
  width: 96%;
  height: 96%;
  background-color: rgba(68, 67, 67, 0.349);
  text-align: center;
  flex-flow: column;
  border: 1px solid #e7eae0;
  border-radius: 10px;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
}
.quiz-title {
  position: relative;
  display: flex;
  width: 100%;
  height: 7%;
  border-bottom: 1px solid #e7eae0;
  justify-content: center;
  align-items: center;
  background-color: #6443c075;
  border-radius: 10px 10px 0px 0px;
  margin-bottom: 10px;
}
.quiz-title .title {
  position: fixed;
  display: flex;
  left: 44%;
}
.quiz-main {
  display: flex;
  width: 100%;
  height: 80%;
  flex-flow: column;
  margin: auto;
  overflow-y: scroll;
}

.quiz-question {
  margin-top: -9px;
}
.quiz-question h1 {
  margin-top: 30px;
}
.quiz-question p {
  font-size: 15px;
  margin-top: 20px;
}

.question-suggestions {
  margin: auto;
  display: flex;
  width: 100%;
  justify-content: center;
  font-size: 20px;
}
ul {
  display: flex;
  width: 80%;
  margin: 0;
  padding: 0;
  flex-flow: column;
}

li {
  list-style: none;
  line-height: 2;
  border: 1px solid #cdd2d2;
  margin-bottom: 20px;
  border-radius: 15px;
  cursor: pointer;
  transition: 0.3s;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.835);
}

li:hover {
  transform: scale(1.1);
  background-color: #e7eae0;
}
ul button {
  margin-bottom: 15px;
}
ul button:hover {
  transform: scale(0.9);
  background-color: #e7eae0;
  color: black;
  padding: 5px;
  border-radius: 15px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.835);
}

.footer-quiz {
  position: relative;
  width: 100%;
  height: 10%;
  border-top: 1px solid #e7eae0;
  background-color: #6443c075;
  border-radius: 0px 0px 10px 10px;
}
.box-button {
  display: flex;
  width: 100%;
}

.footer-quiz .box-button button {
  width: 150px;
  height: 35px;
  outline: none;
  border: 0;
  color: white;
  justify-content: center;
  align-content: center;
  font-size: 18px;
  cursor: pointer;
  border-radius: 15px;
  margin: auto;
  margin-bottom: 20px;
  margin-top: 20px;
  letter-spacing: 2px;
  background-color: #a09f9ff5;
}

li.correct {
  border: 1px solid rgb(74, 219, 74);
  background-color: rgb(74, 219, 74);
  color: white;
  font-weight: 600;
}

li.incorrect {
  border: 1px solid rgb(240, 117, 100);
  background-color: rgb(240, 117, 100);
  color: white;
  font-weight: 600;
}

.theEnd {
  font-size: 70px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 30%;
}

.box-quizEnd {
  font-size: 50px;
}
.question_image {
  position: relative;
  max-width: 500px;
}

.restart-button {
  position: relative;
  top: -20%;
  display: flex;
  width: 100%;
  height: auto;
  justify-content: center;
  margin-top: 600px;
}

.restart-button button {
  width: 150px;
  height: 35px;
  outline: none;
  border: 0;
  background-color: rgb(106, 128, 202);
  color: white;
  font-size: 18px;
  cursor: pointer;
  border-radius: 15px;
  margin: auto;
  margin-bottom: 30px;
  letter-spacing: 2px;
}
.infoAboutAdding {
  position: absolute;
  left: 90%;
  font-size: 22px;
  color: rgb(12, 243, 12);
  border: 1px solid rgb(3, 233, 3);
  padding: 5px;
}
.pass {
  color: green;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fail {
  color: red;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
}
</style>
