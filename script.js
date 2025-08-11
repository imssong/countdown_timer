function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ko-KR'; // 한국어
  speechSynthesis.speak(utterance);
}

function startTimer() {
  const delayInput = document.getElementById("delayTime");
  const delay = parseInt(delayInput.value, 10);

  if (isNaN(delay) || delay <= 0) {
    alert("올바른 초 단위를 입력하세요.");
    return;
  }

  document.getElementById("status").innerText = `${delay}초 후 시작합니다...`;

  setTimeout(() => {
    // 5초 카운트다운 음성
    let count = 5;

    const countdown = setInterval(() => {
      if (count > 0) {
        speak(count.toString());
        document.getElementById("status").innerText = count;
        count--;
      } else {
        clearInterval(countdown);
        speak("Start!");
        document.getElementById("status").innerText = "Start!";
      }
    }, 1000);

  }, delay * 1000);
}
