var Module = (function(){
	// Все необходимые переменные 
	var inputName = document.querySelector('.name-input'),// Инпут ввода Имени
		infoBar = document.querySelector('.infobar-text'), // Информационная строка сверху
		restartButton = document.querySelector('.restart'); // Кнопка для рестарта игры 
		startButton = document.getElementById('start'), // Кнопка старта игры
		cheatButton = document.getElementById('cheater') // Кнопка для отображения кораблей компа
		compFieldId = '#compField', // Айди обертки поля боя компьютера и игрока
		playerFieldId = '#playerField', // нужно для удобной работы с селекторами jQuery
		fields = document.querySelectorAll('.battlefield-grid'); // Массив из оберток двух полей  

	// Главная функция которая будет возвращена в объекте
	var gameStart = () => {
		_createFields()// Функция создает поле боя игрока и компьютера
		_createAroundText(); //Вызвает функцию для вывода букв и цифр по краям поля боя
		_eventListeners(); //Вызывает прослушку событий
		

	}
	// Функция отвечает за прослушку всех событий которые происходят на странице
	var _eventListeners = () => {
		inputName.addEventListener('keyup', _changePlayerName); // Добавляет события по вводу имени
		startButton.addEventListener('click', _battleBegins); // Начинает игру
		restartButton.addEventListener('click', _battleBegins); // Начинает заново
		cheatButton.addEventListener('click', function(){
			_fillTheOneField('cheater');
		}); // Показывает корабли компа
	}

	//Функция отвечает за начало игры
	var _battleBegins = function(){
		_createFields(); // Создает/пересоздает 2 поля боя
		_createShips(); // Создает и размещает корабли
		_fillTheFields(); // Проверяет ячейки на пустоту и заполняет
	}

	// Функция проверяет ячейки и если они пустые(не имеют ни одного класса кроме .Cell) то заполняет их 
	// классом wather
	var _fillTheFields = function(){
		var fieldsIdArray = []; // Массив в который добавятся айдишники полей 
		fieldsIdArray = [playerField, compFieldId]; // с помощью реструктуризации массив получает айдишники
		 //Запускается цикл который перебирает элементы массива с айдишниками и для каждого вызывает функцию
		 //проверки/наполнения одного поля
		 for(var i = 0; i < fieldsIdArray.length; i++){ 
		 	_fillTheOneField(fieldsIdArray[i]); // вызывается функция с аргументом айди поля
		 }
	}

	//Функция которая отвечает за проверку и наполнение водой одного поля боя а так же за кнопку Чит
	// в аргумент получает айди поля боя которое надо проверить
	var _fillTheOneField = function(fieldId){
		// Запускается цикл для каждой ячеейки в поле боя, айди которого было передано
		for(var i= 0; i < 100; i++){
			// Условие проверяет, является ли переданное значение fieldId - cheater
			//т.е проверяет, была ли передана переменная при нажатии на кнопку Чит
			// что бы отобразить все корабли компьютера
			if(fieldId === 'cheater'){ // если является
				// Условие проверяет, имеет ли итерируемая ячейка класс корабля
				// и класс который скрывает корабль на поле боя компьютера водой
				if($('#compField #cell' +i).hasClass('ship') && $('#compField #cell'+i).hasClass('water')){
					// Если условие верно то убрать все лишние классы и добавить класс отображение корабля
					// т.е показать корабль на поле боя компьютера
					$('#compField #cell'+i).removeClass('shipTag water shotMiss shotHit').addClass('shipTag');
				//второе условие проверяет, имеет ли ячейка класс который отображает попадание по кораблю
				}else if($('#compField #cell'+i).hasClass('shotHit')){
					//если да, то ничего не делать и перенестись к финальному выражению цикла
					continue;
				//третье условие проверяет, имеет ли ячейка класс который показывает промах на поле боя
				}else if($('#compField #cell'+i).hasClass('shotMiss')){
					//если да, то ничего не делать и перенестись к финальному выражению цикла
					continue;
				// Во всех остальных случаях просто наполняем ячейки водой 
				}else{
					// Удаление всех классов перед присвоением делается для того что бы ячейки перезаписывались
					// при каждом клике на кнопку и не было конфликтов между классами 
					$('#compField #cell'+i).removeClass('shipTag water shotMiss shotHit').addClass('water');
				}
			// Если же в аргументы был передан один из айдишников полей боя
			}else{
				// Проверяем, имеет ли данная ячейка на поле боя компьютера класс корабля
				//т.е находится ли палуба корабля внутри ячейки
				if($('#compField #cell'+i).hasClass('ship')){
					//Если да, то удаляем все классы отвечающие за визуализацию, оставляя "ship"
					// и закрашиваем эту ячейку водой(делаем невидимой)
					$('#compField #cell'+i).removeClass('shipTag water shotMiss shotHit').addClass('water');
					// так же вешаем на данную ячейку обработчик кликов
					// если игрок нажмет на эту ячейку, то вызовет функцию выстрела, которая в аргументы
					// получит айди поля данной ячейки и hit(обозначающую попадание)
					$('#compField #cell'+i).click(function(){
						_playerShot(this, 'hit'); // вызываем функцию которой передаем информацию о попадании
					});
				//если нет, то все так же вешаем на ячейку обработчик кликов
				}else{
					$('#compField #cell'+i).click(function(){
						_playerShot(this, 'miss'); // Но в этот раз передаем информацию о промахе
					});
				}
			}
		}
	}
	// Функция которая отвечает за "выстрел" игрока, точнее за обработку события клика по ячейке 
	// которое вызывается из функции _FillTheOneField()
	// в качестве аргументов получает айди ячейки и строковое значение miss/hit
	var _playerShot = function(cellId, shotValue){
		// Запускается проверка
		// Если у этой ячейки есть классы отвечающие за отображение попадания или промаха
		// или ячейка имеет системный класс отвечающий за наличие палубы и одновременно с этим
		// данная ячейка находится на поле боя компьютера
		// то мы ничего не делаем :) это обработка повторного клика на то же самое поле
		if(($(cellId).hasClass('shotHit'))||($(cellId).hasClass('shotMiss'))||
		($(cellId).hasClass('ship')) && ($(cellId).parent(compField))){
			//ничего..
		// Иначе, т.е если клик произошел по новой ячейки которая является просто водой
		// другими словами если игрок промахнулся
		}else{
			_compShot(); // Вызывается функция отвечающая за выстрел компьютера
		}

		// Запускается проверка на попадание или промах
		if(shotValue === 'hit'){ // Если в функцию пришел аргумент с попаданием
			//Сбросить с данной ячейки все визуальные стили и установить стиль отвечающий за попадание
			$(cellId).removeClass('shipTag water shotMiss shotHit').addClass('shotHit');
		}
		if(shotValue === 'miss'){ // Если же игрок промахнулся 
			// Так же сбрасываем с ячейки все стили и добавляем стиль отвечающий за промах
			$(cellId).removeClass('shipTag water shotMiss shotHit').addClass('shotMiss');
		}
		// В конце запускаем функцию проверки победителя
		_whoisWinner();
	}

	//Функция отвечает за выстрел компьютера и может принимать аргументы к которым можно будет
	//обратиться через arguments
	var _compShot = function(){
		// Устанавливается переменная которая будет содержать в себе массив номеров ячеек 
		// массив нужен для выстрелов компьютера по ячейкам
		var cellsArr = [];
		//проводим массив по циклу, наполняя его элементами
		for(var i = 0; i < 100; i++){
			cellsArr[i] = i;
		} 
		// В самом начале запускается функция для отображения чей ход в информационной панели
		//в аргумент передается информация что сейчас ход компьютера
		_turn('compTurn');
		// Устанавливается переменная которая будет отвечать за рандомный выстрел компьютера по клетке
		// в переменную записывается рандомное значение от 0 до 99, т.к длинна массива 100
		// из него вычитается 1
		var shotPoint = _randomInteger(0, cellsArr.length - 1);
		//Произовдится проверка на "попадание" компьютера через arguments
		if(arguments[0] === 'luckyshot'){// если попал
			//присваиваем к переменной выстрела по ячейке предыдущее её значение
			shotPoint = arguments[1]; 
			// проверяется переменная, что бы не число не превышало 100
			if(Math.floor(shotPoint/10)> 9){
				shotPoint = arguments[1] - 1; // присваивается значение 99
			}
		}
		//После выстрела, ячейка по которой был произведен выстрел убирается из массива
		// что бы компьютер не стрелял в одно и то же место дважды
		cellsArr.splice(shotPoint, 1);
		// Объявляется переменная ячейки в поле боя игрока, что бы с ней было легче работать
		var cell='#playerField #cell'+ cellsArr[shotPoint];
		// Логика отвечающая за выбор сложности компьютера, через селект, легко/нормально/сложно
		var randomLvl = _randomInteger(0,2) // присваиваем переменной случайное значение для установки уровня
		// Запускаем проверку
		// если рандомное число больше чем выбранная сложность
		// сложность считается как 0 - сложно, 1 - норм, 2 -сложно
		// и ячейка игрока является пустой(не корабль и не попадание/промах)
		if(randomLvl > $('select').val() && $(cell).hasClass('water')){
				// меняем ячейку и закидываем в неё первую ячейку с классом корабля
				//т.е помещаем в переменную ячейку с кораблем что бы обеспечить попадание компьютера
				cell= '#' + $('.shipTag:first').attr('id');
				//Удаляем номер ячейки из массива
				cellsArr.splice(shotPoint, 1);
		}
		// Задается setTimeout что бы имитировать размышление компьютера перед выстрелом
		setTimeout(function(){
			// Если ячейка является кораблем, т.е компьютер попал
			if($(cell).hasClass('ship')){
				// Затираем все классы и присваиваем класс попаадания
				$(cell).removeClass('shipTag water shotMiss shotHit').addClass('shotHit');
				//вызываем функцию выстрела компьютера по новой, т.к он попал
				// передавая в параметры 2 аргументы к которым будем обращаться через arguments
				// в первый аргумент передаем информацию о попадани
				//во второй передаем число
				_compShot();
			}
			//если же компьютер промахнулся 
			else {
				// очищаем все классы и присваиваем ячейке по которой он стрелял класс отвечающий за промах
				$(cell).removeClass('shipTag water shotMiss shotHit').addClass('shotMiss');
			}
			// во время хода компьютера блокиратор кликов всплывает и не дает нажимать на его поле боя
			$('#compFieldBlocker').toggle();
			// запускается функция для отображения чей ход в информационной панели
			//в аргумент передается информация что сейчас ход игрока, т.к пк промахнулся
			_turn('playerTurn');
		}, _randomInteger(500, 1000)); // Компьютер рандомно думает 1sec
	}
	//Функция отображения очередности ходов в информационной панели
	var _turn = (turn) =>{
		// если аргументом функции является ход противника
		if(turn === 'playerTurn'){
			// Выводить сообщение в информ панель
			$('.infobar-text').text('Твой ход..');
		}
		if(turn === 'compTurn'){
			$('.infobar-text').text('Компьютер думает..');
			// всплывает блокиратор кликов по полю компьютера
			$('#compFieldBlocker').toggle();
		}
	// И в конце проверяем, есть ли победитель
	_whoisWinner();
	}
	// Функция проверяет победителя, и если он есть, выводит информацию и прекращает игру
	var _whoisWinner = () => {
		var winner, // переменная которая 
			comp=0, //сюда записывается кол-во потопленных палуб компьютером
			player=0; // сюда кол-во потопленных палуб игроком
		// Каждый раз когда функция вызывается, запускается цикл проверки всех полей боя
		for (var i=0; i<100; i++){
			// Если на поле боя компьютера есть ячейки с классом отвечающим за попадание
			// то игроку засчитываются очки 
			if($('#compField #cell'+i).hasClass('fireColor')){
				player++;
				console.log(player);
			}
			// аналогично только для компьютера
			if($('#playerField #cell'+i).hasClass('fireColor')){
				comp++;
				console.log(comp);
			}
		}

		//  запускается проверка победителя
		//  если у игрока набралось 20 очков(20 подбитых палуб)
		if(player == 20) {
			// вывести в информационную панель поздравления
			$('.infobar-text').text('Поздравляем, Ты победил!');
			// Маленький хак для того что бы отобразить поле боя компьютера
			// в конце игры
			_fillTheOneField('cheater');
			// Заблочить клики обеим полям боя 
			$('#playerFieldBlocker').show();
			$('#compFieldBlocker').show();
		}
		// То же самое, только если победил компьютер 
		 if(comp == 20){
			$('.infobar-text').text('Компьютер победил!:( Что бы отыграться нажми "Заново"');
			_fillTheOneField('cheater');
			$('#playerFieldBlocker').show();
			$('#compFieldBlocker').show();	
		}
	};
	// Функция создает и размещает корабли на полях боя
	var _createShips = () =>{
		var shipLength = 4; // Переменная с максимальной длинной корабля(нужно для цикла)
		for(shipLength; shipLength >= 1; shipLength--){ //Цикл для перебора кораблей от 4 до 1 палубных
			// Цикл для обработки текущего корабля, т.е цикл пройдет (5-числоПалуб) итераций
			// Если к примеру число палуб 4, то цикл пройдет 1 итерацию, для создания одного корабля
			// Если 2 палубы, то цикл пройдет 3 итерации, создав 3 корабля по 2 палубы, по правилам игры
			for(var count = (5- shipLength); count>= 1; count--){
				// В переменную записывает возвращаемый функцией массив из координат корабля игрока
				var arrPlayerShipPosition = _getShipPosition(shipLength, playerFieldId);
				// В переменную записывает возвращаемый функцией массив из координат корабля компьютера
				var arrCompShipPosition = _getShipPosition(shipLength, compFieldId);
				// Цикл вызывает функцию для размещения каждой палубы отдельно, для обоих полей
				for(var deck = 0; deck < arrPlayerShipPosition.length; deck++){ //пока текущая палуба меньше кол-ва палуб корабля
					//Вызвать функции размещения палубы передавая в качестве аргумента айди поля 
					// и по одной координате из полученного массива координат
					_createShipDeck(arrPlayerShipPosition[deck], playerFieldId);
					_createShipDeck(arrCompShipPosition[deck], compFieldId);
				}
			}
		}
	}
	// Функция для создания палубы(одной за раз) на поле боя который передается как аргумент 
	var _createShipDeck = (deckPosition, fieldId) => {
		//Переменная содержит в себе массив ячеек, которые будут помечены как занятые
		//что бы не допустить размещение палуб других кораблей по соседству
		// функция _getShipPosition() будет проверять данные ячейки на "занятость" 
		var aroundDeck = [deckPosition-1,deckPosition-10,deckPosition+10,deckPosition-1-10,deckPosition-1+10,deckPosition+1,deckPosition+1-10,deckPosition+1+10],
			aroundDeckLength; // Переменная нужна для присваивания в неё длинны массива ячеек, что бы было удобней работать
		// Условие проверяет, является ли текущая позиция палубы прибитой к правому краю
		if(Math.floor(deckPosition%10)<9){ // если остаток деления меньше девяти
			aroundDeckLength = aroundDeck.length; // всё нормально и можно помечать все ячейки вокруг как занятые
		}else{ // если нет, т.е позиция палубы находится у правого края
			// передаем длинну массива не учивывать 3 последних элемента, которые отвечают за пометку позиции справа
			aroundDeckLength = aroundDeck.length-3;
		}

		//Цикл перебирает массив c получившейся длиной на основе позиции палубы и присваивает классы занятым ячейкам
		for(i = 0; i< aroundDeckLength; i++){
			var cell = $(fieldId+' #cell'+aroundDeck[i]); // Записываем в переменную ячейку которую надо пометить

			//Условие которое проверяет имеет ли ячейка класс корабля
			if(cell.hasClass('shipColor')){
				//если да, то ничего не делать
			}else{
				//если нет, то перезаписать все классы ячейки(на случай перезапуска игры) и пометить ячейку
				//как занятую
				cell.removeClass('shipTag water shotMiss shotHit').addClass('water');
			}
		}
		// Перезаписываем ячейку, удаляя все предыдущие классы и помечаем её как палубу корабля
		$(fieldId+' #cell'+deckPosition).removeClass('shipTag water shotMiss shotHit').addClass('shipTag');
		// Добавляем системный класс корабля
		$(fieldId+' #cell'+deckPosition).addClass('ship');
	}
	// Функция принимает в аргумент количество палуб и айди поля куда нужно добавлять корабль
	//Возвращает массив с координатами корабля
	var _getShipPosition = (decks, fieldId) =>{
		var positions = [], // Массив позиций корабля
 			direction = _randomInteger(0, 1); // Рандомно определяет направление корабля из 2х сторон(вверх вправо)
 		positions[0] = _randomInteger(0, 99); // Рандомно устанавливает первую позицию корабля

 		// Условия для каждого направления
 		if(direction){ // если направление вправо
 			if(positions[0]%10 > (10 - decks)){ // если первая позиция слишком близко к правому краю и корабль не помещается 
 				positions[0] = Math.floor(positions[0]/10) * 10 + (10- decks);  // задать новую позицию учитывая длинну корабля
 			}
 			// Добавляет палубы к первой позиции вправо
 			for(i = 1; i < decks; i++){
 				positions[i] = positions[i-1] + 1;
 			}
 		}
 		if(direction == 0){ // если направление вверх 
 			if(positions[0] > (decks * 10 - 1)){ // если первая позиция слишком близко к верхнему краю и корабль не помещается 
 				positions[0] = (decks* 10 - 1) + Math.round(positions[0]%10); // Задать новую  позицию 
 			}
 			// Добавляет палубы к первой позиции вверх
 			for(i = 1; i < decks; i++ ){
 				positions[i] = positions[i - 1] + 10;
 			}
 		}
 		// Проверяет что бы позиции разных кораблей не совпадали и в случае совпадения запускает скрипт по новой
 		for(i = 0; i < decks; i++){
 			if($(fieldId+' #cell'+positions[i]).hasClass('shipTag')|| $(fieldId+' #cell'+positions[i]).hasClass('water')){
 				return _getShipPosition(decks, fieldId);
 			}
 		}
 		return positions;
	}
	// Стандартная функция получения рандомного числа от min до max с использованием Math.floor()
	var _randomInteger = (min, max) => {
 		var rand = min + Math.random() * (max + 1 - min);
    	rand = Math.floor(rand);
    	return rand;
 	}
	// Создание обоих полей боя и дивов для блокирования кликов по полям
	var _createFields = () => {
		// Запускается цикл по каждой обертке поля боя(всего 2)
	 	for (var n = 0; n < fields.length; n++){
	 		var fieldItem = fields[n]; //Присваивает поле боя переменной что бы было наглядней
	 		_createField(fieldItem); // Запускает функцию и передает в параметр обертку поля боя для создания ячеек 
	 		_clickBlocker(fieldItem); // Запускает функцию создания блокираторов
	 	}
	}
	// Создает дивы в каждом поле боя блокирующие нажатие по полю во время хода противника и т.д
	var _clickBlocker = (fieldItem) =>{
		var filedId = fieldItem.id;
		$(fieldItem).append(`<div class="clickBlockers" id="${filedId}Blocker"></div>`);
	}

	// Функция отвечающая за создание одного поля 
	var _createField = (fieldItem) => {
	 	$(fieldItem).empty(); // Очищает игровое поле перед созданием нового
	 	for(var i = 0; i <100; i++){ // Запускается цикл для создания ячеек в обертке поля боя
	 		$(fieldItem).append(`<span class="cell" id="cell${i}" ></span>`); // Создает ячейку
	 	}
	}
	//Функция отвечает за вывод букв и цифр по краям поля боя
	var _createAroundText = () =>{
		var letters = ['А','Б','В','Г','Д','Е','Ж','З','И','К'],// массив из букв
			numbers = ['1','2','3','4','5','6','7','8','9','10'], //массив из цифр
			lettersBlock = document.querySelectorAll('.letters'),//блок-обертка в который помещаются буквы
			numbersBlock = document.querySelectorAll('.numbers'); // блок-обертка в который помещаются цифры

			for( var n = 0; n < 2; n++){ // цикл проходит 2 раза что бы перебрать получившийся NodeList 
			 // от querySelectorAll и получить блок-обертку букв/цифр
				for( var i = 0; i < 10; i++){ // цикл проходит 10 раз для каждого элемента массивов letters/numbers
					$(lettersBlock[n]).append('<span>'+letters[i]+'</span>');//добавляет span со значением в letters
					$(numbersBlock[n]).append('<span>'+numbers[i]+'</span>');//добавляет span со значением в numbers
				}
			}
	}

	//Функция отслеживает изменения имени игрока в поле инпут и добавляет новое имя над полем игрока и в инф.панель
	var _changePlayerName = function(e){
	 	var text = this.value, // Присвоение переменной text текущее значение в инпуте
	 		playerFieldName = document.getElementById('player-field-name'); // Место куда нужно выводить имя
	 	playerFieldName.textContent = ` ${text}`; // Добавление текста из инпута над полем боя игрока
	 	infoBar.textContent = `Добро пожаловать в игру, ${text}! Выбери сложность и жми "Играть"...`; //Текс в инфобар
	 	
	 	if(text == ''){ // Что бы название поля боя не было пустым, добавляется проверка
	 		playerFieldName.textContent = 'Поле игрока';// Если название пустое, назначается дефолтное название 
	 		infoBar.textContent = 'Не можешь определиться с именем? :)'; // На случай если имя пустует :)
	 	}
	}
	
	return {
		gameStart: gameStart
	}
})();


Module.gameStart();