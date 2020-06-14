window.onload = function () {
  document.getElementById('quadraticEquation').onclick = quadraticEquation;

  answers = [];

  function quadraticEquation(e) {
    //начало блока верстки
    $("div.content").empty(); //очищаем содержимое страницы
    $("div.content").append('<a href="8thGrade.html"> <span>&#8617;<span> Повернутися до вибору теми</a>'); //ссылка возврата к выбору темы
    $("div.content").addClass("new"); //добавляем класс к блоку content
    $("div.content").append("<h2>Щоб згенерувати завдання з теми КВАДРАТНІ РІВНЯННЯ</h1>"); //добавляем заголовок
    $("div.content").append("<h3>1. Оберіть кількість варіантів</h3>"); //добавляем первый пункт инструкции

    //выбор количества вариантов
    $("div.content").append('<input type="number" id="optionsNumber" min="1" max="40" value="3"/>');
    optionsNumber = 3;
    document.getElementById('optionsNumber').onkeyup = getValueOfInputNumber; //обработчик событий для выбора количества вариантов
    document.getElementById('optionsNumber').onchange = getValueOfInputNumber;

    $("div.content").append("<h3>2. Оберіть кількість завдань у кожному варіанті</h3>"); //добавляем второй пункт инструкции

    //выбор количества заданий
    $("div.content").append('<input type="number" id="tasksNumber" min="1" max="20" value="2"/>');
    tasksNumber = 2;
    document.getElementById('tasksNumber').onkeyup = getValueOfInputNumber; //обработчик событий для выбора количества заданий
    document.getElementById('tasksNumber').onchange = getValueOfInputNumber;

    $("div.content").append("<h3>3. Оберіть додаткові параметри</h3>"); //добавляем третий пункт инструкции
    $("div.content").append('<input type="checkbox" id="theoremVieta" /> <label for="theoremVieta">Завдання тільки за теоремою Вієта</label><br><br>'); // checkbox для теоремы Виета
    $("div.content").append('<input type="checkbox" id="getAnswers" /> <label for="getAnswers">Додати відповіді</label><br>'); // checkbox для теоремы Виета

    $("div.content").append('<div class="btnWrap"></div>');
    $("div.btnWrap").append('<button id="createTasks">Отримати завдання</button>'); //кнопка создать задания
    //конец блока верстки

    
    document.getElementById('createTasks').onclick = () => { //обработчик события нажатия на кнопку создания заданий
      if ($("#theoremVieta").prop("checked")) vietaCheck = true; //проверка чекбокса теоремы виета
      else vietaCheck = false;
      if ($("#getAnswers").prop("checked")) answersCheck = true; //проверка чекбокса ответов
      else answersCheck = false;
      getPrint();
    }

    function getPrint() {
      $("div.content").empty(); //очищаем содержимое
      $("div.content").append('<a href="8thGrade.html"> <span>&#8617;<span> Повернутися до вибору теми</a>'); // ссылка возврата к выбору темы
      $("div.content").append('<div class="btnWrap"></div>'); //
      $("div.btnWrap").append('<input type="button" id="getPDF" value="Роздрукувати" onclick="print()"></input>'); //кнопка распечатать
      $("div.content").addClass("print"); //добавляем класс печати к блоку
      $("div.content.print").append(document.createElement('div'));
      $("div.content.print div:nth-child(odd)").addClass("variantsWrap");

      for (let i = 0; i < optionsNumber; i++) { // цикл добавления вариантов
        //блок с версткой
        let divVariant = document.createElement('div');
        let variantNumber = document.createElement('h3');
        variantNumber.append('Варіант №' + (i + 1));
        divVariant.append(variantNumber);
        let textTask = document.createElement('p');
        textTask.append('Завдання: розв\'яжіть квадратні рівняння.');
        divVariant.append(textTask);

        let task = getTask(); //формирование заданий
        task.forEach(el => divVariant.innerHTML += '<span>' + el + '</span>' + '<br>'); //добавляем задания на страницу
        $("div.content.print .variantsWrap").append(divVariant);
      }

      $("div.content.print").append(document.createElement('div'));

      if (answersCheck) {
        $("div.content.print").append("<div class='answersWrap'></div>");
        answers = getSubarray(answers);
        $("div.content.print .answersWrap").append('<h3 style="text-align:center; font-size:20px; class="answers">Відповіді</h3>');
        for (let i = 0; i < optionsNumber; i++) { //цикл добавления ответов 
          let divAnswer = document.createElement('div');
          let textTask = document.createElement('p');
          textTask.innerHTML += '<br>';
          textTask.append('Варіант №' + (i + 1));
          divAnswer.append(textTask);
          for (j = 0; j < tasksNumber; j++) {
            divAnswer.innerHTML += (j+1) +'. ' + answers[i][j] + '<br>';
          }
          $("div.content.print .answersWrap").append(divAnswer);
        }
      }
    }

    function getTask() {
      if (vietaCheck) pattern = ['x^2+(!B+!C)x+(!B*!C)=0[' + tasksNumber + ']']; //проверяем чекбокс теоремы виета
      else if (tasksNumber % 2 == 0) pattern = ['!Ax^2+!Bx+!C=0' + '[' + (tasksNumber / 2) + ']', 'x^2+(!B+!C)x+(!B*!C)=0' + '[' + (tasksNumber / 2) + ']'];
      else pattern = ['!Ax^2+!Bx+!C=0' + '[' + ((tasksNumber - 1) / 2 + 1) + ']', 'x^2+(!B+!C)x+(!B*!C)=0' + '[' + ((tasksNumber - 1) / 2) + ']'];

      pattern = generator.generateSeries(pattern);
      pattern = pattern.map(el => generator.generate(el));
      return pattern;
    }

    function getValueOfInputNumber() {
      if (this.value == '' || +this.value < $(this).prop('min') || +this.value > $(this).prop('max') || !Number.isInteger(+this.value)) {
        document.getElementById('createTasks').disabled = true;
      }
      else {
        document.getElementById('createTasks').disabled = false;
        if ($(this).prop('id') == 'optionsNumber') {
          optionsNumber = +this.value;
        }
        else if ($(this).prop('id') == 'tasksNumber') {
          tasksNumber = +this.value;
        }
      }
    }
    return false;
  }


  //ОБЪЕКТ ГЕНЕРАТОР
  generator = {
    min: -10, 
    max: 10,
    round: 0,
    shuffle: true,

    getRandomNumber() { //функция получения случайного числа
      let number = (this.min + (this.max - this.min) * Math.random()).toFixed(this.round);
      return (number != 0) ? number : this.getRandomNumber();
    },

    roundNumber: function (value, precision) { //функция округления
      let m, f, isHalf, sgn; // вспомагательные переменные
      precision |= 0;
      m = Math.pow(10, precision);
      value *= m;
      sgn = (value > 0) | -(value < 0);
      isHalf = value % 1 === 0.5 * sgn;
      f = Math.floor(value);
      if (isHalf) value = f + (sgn > 0);
      return (isHalf ? value : Math.round(value)) / m;
    },

    generate: function (l) { //функция генерации одного уравнения

      if (l == '!Ax^2+!Bx+!C=0') { //проверка шаблона для создания ответов
        discriminantSolution = true;
        vietaSolution = false;
        nothingToChange = false;
      }
      else if (l == 'x^2+(!B+!C)x+(!B*!C)=0') {
        vietaSolution = true;
        discriminantSolution = false;
        nothingToChange = false;
      }
      else {
        nothingToChange = true;
      }

      let number = '[0-9+*.,-/]+';
      let math = new RegExp('\\(' + number + '\\)', 'g');
      let variable = [new RegExp(/!A/g), new RegExp(/!B/g), new RegExp(/!C/g), new RegExp(/!D/g), new RegExp(/!E/g), new RegExp(/!F/g), new RegExp(/!G/g), new RegExp(/!H/g), new RegExp(/!I/g), new RegExp(/!J/g), new RegExp(/!K/g), new RegExp(/!L/g), new RegExp(/!M/g), new RegExp(/!N/g), new RegExp(/!P/g), new RegExp(/!Q/g), new RegExp(/!R/g), new RegExp(/!S/g), new RegExp(/!T/g), new RegExp(/!U/g), new RegExp(/!V/g), new RegExp(/!W/g), new RegExp(/!X/g), new RegExp(/!Y/g), new RegExp(/!Z/g)]
      let functions = new RegExp('(?:(?:abs)|(?:pow)|(?:sqrt)|(?:sin)|(?:cos)|(?:tan))\\(' + number + '\\)', 'g');
      let choice = new RegExp(/\[.+?\]/g);
      while (choice.test(l)) l.match(choice).forEach(el => { let k = el.substr(1, el.length - 2).split(';'); l = l.replace(el, k[Math.floor(Math.random() * k.length)]); });
      
      var coef = [];
      variable.forEach(el => { //замена коэф. из шаблона на случайное число
        let temp = this.getRandomNumber();
        l = l.replace(el, temp);
        coef.push(temp);
      });

      if (!nothingToChange) { // решение уравнения и добавление ответов в массив
        if (discriminantSolution) { //если уравнение решается с помощью дискриминанта
          let a = coef[0];
          let b = coef[1];
          let c = coef[2];
          let discriminant = Math.pow(b, 2) - 4 * a * c; //находим дискриминант
          if (discriminant < 0) { //отрицательный дискриминант
            answers.push('Рівняння не має розв\'язків');
          }
          else if (!isInteger(Math.sqrt(discriminant))) { // нет целого корня из дискриминанта
            answers.push(['(' + (-1 * b) + ' + &#8730;' + discriminant + ')/' + (2 * a), '(' + (-1 * b) + ' - &#8730;' + discriminant + ')/' + (2 * a)]);
          }
          else {
            let x1 = (-1 * b + Math.sqrt(discriminant)) / 2 * a;
            let x2 = (-1 * b - Math.sqrt(discriminant)) / 2 * a;
            x1 == x2 ? answers.push(x1) : answers.push([x1, x2]);
          }
        }
        else if (vietaSolution) { //если уравнение решается с помощью теоремы Виета
          answers.push([-1*coef[1], -1*coef[2]]);
        }
      }

      //приводим уравнение в читабельный вид
      l = l.replace(new RegExp(/--/g), '+');
      l = l.replace(new RegExp(/\+-/g), '-');
      while (functions.test(l)) l.match(functions).forEach(el => l = l.replace(el, eval('Math.' + el)));
      while (math.test(l)) l.match(math).forEach(el => l = l.replace(el, this.roundNumber(eval(el), 8)));
      l = l.replace(new RegExp(/--/g), '+');
      l = l.replace(new RegExp(/\+-/g), '-');
      l = l.replace('x^2', 'x&sup2;');
      return l;
    },

    generateSeries(arr) { //функция генерации n-го количества уравнений
      let repeat = new RegExp(/^(.+)\[(\d+)\]$/);
      for (i = 0; i < arr.length; i++) {
        if (repeat.test(arr[i])) {
          let m = arr[i].match(repeat);
          arr.splice(i, 1, ...new Array(parseInt(m[2])).fill(m[1]));
        }
      }
      if (this.shuffle) arr.sort(function (a, b) { return Math.random() - 0.5 });
      arr = arr.map(el => this.generate(el));
      return arr
    }
  }

  function isInteger(num) { //функция проверки целое ли число
    return (num ^ 0) === num;
  }

  function getSubarray(array) { //функция разделения массива на подмассивы
    let size = tasksNumber; //размер подмассива
    let subarray = []; //массив в который будет выведен результат.
    for (let i = 0; i < Math.ceil(array.length / size); i++) {
      subarray[i] = array.slice((i * size), (i * size) + size);
    }
    return subarray;
  }
};
