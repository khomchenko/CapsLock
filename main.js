// Напишите на чистом JavaScript функцию, принимающую на вход URL и отвечающую следующим требованиям:
//   - Можно использовать все фичи языка, работающие в последней версии Google Chrome.
//   - Функция вызывается однократно на пустой странице браузера (пустой тег body).
//   - В момент вызова функция рисует чёрный квадрат со стороной 100px в левом верхнем углу окна.
//   - Через секунду после вызова функции квадрат начинает равномерное движение вправо со скоростью 100px в секунду.
//   - В этот же момент (через секунду после вызова функции) посылается GET-запрос на переданный URL.
//   - Через две секунды после вызова (то есть через одну секунду после старта движения) квадрат должен остановиться.
//   - Если на момент остановки квадрата уже известен результат запроса, то в момент остановки (не ранее), квадрат должен изменить цвет.
//   - Если на момент остановки квадрата запрос еще не завершён, то квадрат всё равно должен остановиться, а цвет поменять как только результат запроса будет известен.
//   - Изменение цвета происходит в зависимости от содержания ответа. Если сервер ответил "1", то перекрасить квадрат в зелёный, если "0", то в синий. Если запрос выполнился неудачно (статус не 200) или вообще не выполнился (сетевая ошибка), то в красный.

async function moveBox(url) {
  const box = document.createElement("div");
  box.style.width = "100px";
  box.style.height = "100px";
  box.style.backgroundColor = "black";
  box.style.position = "absolute";
  box.style.top = "0";
  box.style.left = "0";
  document.body.appendChild(box);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  let result;
  const request = fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error("Network response was not ok");
      }
    })
    .then((text) => {
      result = text;
    })
    .catch((error) => {
      console.error("There was a problem with the network request:", error);
      result = "error";
    });

  const interval = setInterval(() => {
    box.style.left = parseInt(box.style.left) + 1 + "px";
  }, 10);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  clearInterval(interval);

  await request;

  if (result === "1") {
    box.style.backgroundColor = "green";
  } else if (result === "0") {
    box.style.backgroundColor = "blue";
  } else {
    box.style.backgroundColor = "red";
  }
}

moveBox("https://keev.me/f/slowpoke.php");
