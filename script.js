const currentTimeDisplay = document.getElementById("currentTime");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const statusDisplay = document.getElementById("status");
const useInterval2Checkbox = document.getElementById("useInterval2");
const interval2TimeInput = document.getElementById("interval2Time");

let timerInterval;
let countdownTimeouts = [];
let isRunning = false;

function updateCurrentTime() {
  const now = new Date();
  currentTimeDisplay.textContent = now.toLocaleTimeString('ko-KR');
}
setInterval(updateCurrentTime, 1000);
updateCurrentTime();

useInterval2Checkbox.addEventListener("change", () => {
  interval2TimeInput.disabled = !useInterval2Checkbox.checked;
});

startBtn.addEventListener("click", () => {
  if (isRunning) return;
  isRunning = true;

  const startTimeStr = document.getElementById("startTime").value;
  const interval1Time = parseInt(document.getElementById("interval1Time").value);
  const interval1Count = parseInt(document.getElementById("interval1Count").value);
  const useInterval2 = useInterval2Checkbox.checked;
  const interval2Time = parseInt(interval2TimeInput.value);

  if (!startTimeStr || isNaN(interval1Time) || isNaN(interval1Count)) {
    alert("입력값을 확인해주세요.");
    return;
  }

  const [startHour, startMinute] = startTimeStr.split(":").map(Number);
  const now = new Date();
  const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMinute, 0);

  if (startTime < now) {
    alert("시작 시간은 현재 시간보다 이후여야 합니다.");
    isRunning = false;
    return;
  }

  const waitTime = startTime.getTime() - now.getTime();
  statusDisplay.textContent = `상태: ${startTimeStr}까지 대기 중...`;

  setTimeout(() => {
    statusDisplay.textContent = "상태: 타이머 시작됨";
    runIntervals(interval1Time, interval1Count, useInterval2, interval2Time);
  }, waitTime);
});

function runIntervals(interval1Time, count, useInterval2, interval2Time) {
  let currentCount = 0;

  timerInterval = setInterval(() => {
    if (currentCount >= count) {
      clearInterval(timerInterval);
      statusDisplay.textContent = "상태: 완료!";
      isRunning = false;
      return;
    }

    startCountdown(() => {
      statusDisplay.textContent = `상태: 인터벌 ${currentCount + 1} 시작됨`;
    });

    currentCount++;

    if (useInterval2 && interval2Time > 0) {
      setTimeout(() => {
        statusDisplay.textContent = `상태: 인터벌2 대기중 (${interval2Time}초)`;
      }, interval1Time * 1000);
    }

  }, interval1Time * 1000 + (useInterval2 ? interval2Time * 1000 : 0));
}

function startCountdown(callback) {
  let count = 5;
  const synth = window.speechSynthesis;

  function speak(text) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "ko-KR";
    synth.speak(utter);
  }

  for (let i = 0; i <= 5; i++) {
    const timeout = setTimeout(() => {
      if (i < 5) {
        speak(String(5 - i));
      } else {
        speak("스타트");
        callback();
      }
    }, i * 1000);
    countdownTimeouts.push(timeout);
  }
}

stopBtn.addEventListener("click", () => {
  if (timerInterval) clearInterval(timerInterval);
  countdownTimeouts.forEach(timeout => clearTimeout(timeout));
  countdownTimeouts = [];
  statusDisplay.textContent = "상태: 강제 종료됨";
  isRunning = false;
});
