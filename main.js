let color = localStorage.getItem('color') || '#F87070';
let font = localStorage.getItem('font') || 'Kumbh'; 
let newColor; 
let newFont;

const endSound = new Audio("./sound/timeIsOver.mp3");

// Показ модального окна по кнопке шестеренки и крестику
  const settingsBtn = document.querySelector('.settings-btn');
  const popupMove = document.querySelector('.popup');
  const closeBtn = document.querySelector('.close-btn');

  settingsBtn.addEventListener('click', () => {
      popupMove.classList.toggle('popup-active');
  })

  closeBtn.addEventListener('click', () => {
      popupMove.classList.toggle('popup-active');
  })

// Расчитываем текущее время
  const timeELem = document.getElementById('time');
  const currentTime = (time) => {
    const minutes = Math.trunc(time / 60);
    const seconds = time - (minutes * 60);
    const currentMinutes = minutes > 9 ? `${minutes}:` : `0${minutes}:`; 
    const currentSeconds = seconds > 9 ? `${seconds}` : `0${seconds}`; 
    timeELem.innerText = currentMinutes + currentSeconds; 
  };

// Заполнение прогресс бара
  const circle = document.querySelector('.progress-circle');
  const radiusCircle = parseInt(getComputedStyle(circle).r);
  const circumference = 2 * Math.PI * radiusCircle;
  const fillProgressBar = (percent) => {
    const offset = circumference + percent / 100 * circumference;
    circle.style.strokeDashoffset = offset;
  };

//Расчет процентов для прогресс бара
  let timeActiveTab = localStorage.getItem('timeActiveTab');
  const setPercentBar = (actualSeconds) => {
    const percent = ((actualSeconds / 60) / timeActiveTab) * 100;
    fillProgressBar(percent);
  };

// Уменьшение времени. Действия при истечении времени
  let actualTime = localStorage.getItem('actualTime');
  const timerCommand = document.getElementById('timeBtn');
  let interval;
  const decreaseTime = () => {
    if (actualTime === 0) {
      endSound.play();
      localStorage.removeItem('actualTime');
      // меняем надпись на restart
      timerCommand.innerText = 'restart';
      clearInterval(interval);
      fillProgressBar(100);
      return;
    }

    actualTime--;
    localStorage.setItem('actualTime', actualTime);
    
    setPercentBar(actualTime);
    currentTime(actualTime);
  };

// Устанавливаем заданное время при клике по табу
  const tabs = document.querySelectorAll('.tab');
  const setCurrentTime = () => {
    tabs.forEach((tab, index) => {setPercentBar
      if (tab.classList.contains('tab-active')) {
        actualTime = (index === 0) ? pomodoroTime : (index === 1) ? shortTime : longTime;
        timeActiveTab = actualTime;
        actualTime *= 60;
        localStorage.setItem('timeActiveTab', timeActiveTab);
      }
    });
  };

// Устанавливаем цвет активного  таба
  const setActiveTab = (newTab) => {
    tabs.forEach(tab => tab.classList.remove('tab-active'));
    newTab.classList.add('tab-active');
  };

// Состояние прогресс бара при старте
  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = circumference;

// Начальные данные таймеров либо из Local Storage либо определенные
  let pomodoroTime = localStorage.getItem('pomodoroTime') || 20;
  let shortTime = localStorage.getItem('shortTime') || 5;
  let longTime = localStorage.getItem('longTime') || 15;

// Сброс времени при переключении табов
  const activeTab = document.getElementById(localStorage.getItem('tab')) 
          || document.getElementById('timer');

  setActiveTab(activeTab);
      if (!actualTime) {
          setCurrentTime();
      }
  setPercentBar(actualTime);
  currentTime(actualTime);

// Старт, пауза
  timerCommand.addEventListener('click', (event) => {
      const currentValue = event.target.innerText.toLowerCase();

      if (currentValue === 'start') {
        timerCommand.innerText = 'pause';
        interval = setInterval(decreaseTime, 1000);
      } else if (currentValue === 'pause') {
        timerCommand.innerText = 'start';
        clearInterval(interval);
      } else {
        timerCommand.innerText = 'pause';
        setCurrentTime();
        interval = setInterval(decreaseTime, 1000);
      }
  });

// Что происходит при клике по каждому табу
  tabs.forEach(tab => {
      tab.addEventListener('click', (event) => {
        const current = event.target;
    
        localStorage.removeItem('actualTime');
        localStorage.removeItem('delay');
        localStorage.setItem('tab', current.id);
    
        timerCommand.innerText = 'start';
        clearInterval(interval);
        setActiveTab(current);
        setCurrentTime();
        currentTime(actualTime);
        fillProgressBar(100);
      });
  });

// Переменные для модального окна
  const inputPomodoro = document.getElementById('inputPomodoro');
  const inputShort = document.getElementById('inputShort');
  const inputLong = document.getElementById('inputLong');
  const plus = document.querySelectorAll('.number-plus');
  const minus = document.querySelectorAll('.number-minus');
  const fontItems = document.querySelectorAll('.font__item');
  const fontElements = document.querySelectorAll('.font-family');
  const colorElements = document.querySelectorAll('.color__item');
  const applyBtn = document.querySelector('.apply-btn');
  const allElements = document.documentElement;

//Увеличиваем число в поле ввода 
  const increaseValue = (event) => {
    const input = event.target.parentElement.nextElementSibling;
    if (input?.className === 'time__input') {
      input.stepUp();  
    }
  };

//Уменьшаем число в поле ввода 
  const decreaseValue = (event) => {
    const input = event.target.parentElement.previousElementSibling;
    if (input?.className === 'time__input') {
      input.stepDown();
    }
  };

// Делаем выбранный шрифт активным
  const setActiveFont = (event) => {
    fontItems.forEach(item => 
      item.classList.remove('font__item-active'));
    event.target.parentElement.classList.add('font__item-active');
    newFont = event.target.dataset.font;
  };

// Делаем выбранный цвет активным
  const setActiveColor = (event) => {
    colorElements.forEach(elem => 
      elem.classList.remove('color__item-active'));
    event.target.classList.add('color__item-active');
    newColor = event.target.dataset.color;
  };

// Применить настройки
  const applySettings = () => {
    pomodoroTime = +inputPomodoro.value;
    shortTime = +inputShort.value;
    longTime = +inputLong.value;

    [font, color] = [newFont || font, newColor || color];

    localStorage.setItem('font', font);
    localStorage.setItem('color', color);
    localStorage.setItem('pomodoroTime', pomodoroTime);
    localStorage.setItem('shortTime', shortTime);
    localStorage.setItem('longTime', longTime);
    localStorage.removeItem('actualTime');
    localStorage.removeItem('delay');

    clearInterval(interval);

    allElements.style.setProperty('--main-color', color);
    allElements.style.setProperty('--main-font', font);
  };

// Начальные настройки
  inputPomodoro.value = pomodoroTime;
  inputShort.value = shortTime;
  inputLong.value = longTime;
  document.querySelector(`[data-font="${font}"]`).parentElement.classList.add('font__item-active');
  document.querySelector(`[data-color="${color}"]`).classList.add('color__item-active');
  applySettings();

  document.querySelectorAll('.time__input').forEach(input => {
    input.addEventListener('change', (event) => {
      const current = event.target;

      if (current.value > 60) {
        current.value = 60; 
      } 
      if (current.value < 1) {
        current.value = 1; 
      } 
    });
  });

// Запускаем увеличение величины при клике на стрелку вверх
  plus.forEach(elem => {
    elem.addEventListener('click', increaseValue);
  });

// Запускаем уменьшение величины при клике на стрелку вниз
  minus.forEach(elem => {
    elem.addEventListener('click', decreaseValue);
  });

// Приклике на иконки выбора шрифта запускаем функцию установки шрифта
  fontElements.forEach(elem => {
    elem.addEventListener('click', setActiveFont);
  });

// Приклике на иконки выбора цвета запускаем функцию установки цвета
  colorElements.forEach(elem => {
    elem.addEventListener('click', setActiveColor);
  });

// Приклике на кнопку Apply применяем настройки
  applyBtn.addEventListener('click', () => {
    applySettings();
    setCurrentTime();
    currentTime(actualTime);
    setPercentBar(actualTime);
  });
