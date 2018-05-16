/*
    Скрипт для отработки логики игры. Обработчик действий для робота. Столкновения с объектами, сбор ящиков и тд. Все здесь
*/

cc.Class({
    extends: cc.Component,

    properties: {
        //private
        _currentFieldElement: undefined, //Элемент поля на котором стоит игрок
        _frontFieldElement: undefined, //Элемент поля спереди от робота
        _leftFieldElement: undefined, //Элемент поля слева от робота
        _rightFieldElement: undefined, //Элемент поля справа от робота
        _backFieldElement: undefined, //Элемент поля сзади от робота
        _underFieldElements: [], //Массив обьектов под роботом на клетке
        //public
        parentNode:cc.Node,
        lookDirection: "up",
        playerStarted: false,
        playerMoveTime: 1,
        testCommands: {
            default: [],
            type: cc.Prefab
        },
        commands: [],
        inventory: [],
    },

    //Обработчик коллизий
    onCollisionEnter: function (other, self) {
        //console.log("Collision : " + self.node.name + ",tag " + self.tag + " with " + other.node.name);
        //Обрабатываем только коллизи Робот + обьект
        if (self.node.name == "Player") {
            if (self.tag == 0) { //Если коллизия центрального бокса робота с клеткой
                if (other.tag == 3) { //Если это игровой обьект
                    this._underFieldElements.push(other.node);
                } else {
                    this._currentFieldElement = other.node;
                    this._underFieldElements.splice(0, this._underFieldElements.length);
                }
            } else {
                if (other.node !== this._currentFieldElement && other.tag == 0) { //Если это не коллизия с ТЕКУЩЕЙ КЛЕТКОЙ то обрабатываем
                    switch (self.tag) {
                        case 1: //Спереди робота
                            this._frontFieldElement = other.node;
                            break;
                        case 2: //Сзади
                            this._backFieldElement = other.node;
                            break;
                        case 3: //Слева
                            this._leftFieldElement = other.node;
                            break;
                        case 4: //Справа
                            this._rightFieldElement = other.node;
                            break;
                    }
                }
            }

        }
    },

    start() {
        for (var i = 0; i < this.testCommands.length; i++) {
            this.commands.push(cc.instantiate(this.testCommands[i]));
        }
        this.setStart();
    },
    update(dt) {
        this;
    },
    setStart() {
        this.playerStart = true;
        this.makeAMove();
    },
    //Один шаг робота. Обработка команд из стека команд и запуск перемещения из одной клетки в другую
    makeAMove() {
        if (!this.playerStarted) return;
        //Обработка верхней команды в стеке commands
        var pr = this._processMove();
        if (pr.error == "" && pr.point) {
            var res = this.moveTo(pr.point, pr.direction);
            if(res) console.log(res);
        } else if (pr.error != "") { //ОБРАБОТКА ОШИБКИ В ДВИЖЕНИИ РОБОТА
            //this.makeAMove();
            console.log(pr.error);
        } else if (pr.error == "") {
            this.makeAMove();
        }
    },
    //Вызывает движение робота к точке x,y за playerSpeedDelay секунд
    moveTo(p, dir) {        
        var actions = [cc.moveTo(this.playerMoveTime, p), //Описываем экшон для плеера
            cc.callFunc(this.makeAMove, this)]; //Создаем ссылку на callback функцию после выполнения перемещения
        //Поворачиваем робота если требуется
        if (this.lookDirection != dir && dir !== "onup")
            actions.unshift(cc.rotateTo(this.playerMoveTime, this.setDirection(dir, true)));
        this.node.runAction(cc.sequence(actions));
    },
    //Задает направление того, куда смотрит робот
    setDirection(dir, isAnim) {
        var angle = 0;
        switch (dir) {
            case "up":
                angle = 0;
                break;
            case "down":
                angle = 180;
                break;
            case "right":
                angle = 90;
                break;
            case "left":
                angle = 270;
                break;
            case "onup"://Вперед
                angle = this.node.rotation;
                dir = this.lookDirection;
                break;
            case "ondown"://Назад
                if(this.lookDirection == "up") return this.setDirection("down", isAnim);
                else if(this.lookDirection == "down") return this.setDirection("up", isAnim);
                else if(this.lookDirection == "left") return this.setDirection("right", isAnim);
                else if(this.lookDirection == "right") return this.setDirection("left", isAnim);
                break;
            case "onleft"://Влево
                if(this.lookDirection == "up") return this.setDirection("left", isAnim);
                else if(this.lookDirection == "down") return this.setDirection("right", isAnim);
                else if(this.lookDirection == "left") return this.setDirection("down", isAnim);
                else if(this.lookDirection == "right") return this.setDirection("up", isAnim);
                break;
            case "onright"://Вправо
                if(this.lookDirection == "up") return this.setDirection("right", isAnim);
                else if(this.lookDirection == "down") return this.setDirection("left", isAnim);
                else if(this.lookDirection == "left") return this.setDirection("up", isAnim);
                else if(this.lookDirection == "right") return this.setDirection("down", isAnim);
                break;
        }
        this.lookDirection = dir;
        if (isAnim) return angle;
        this.node.rotation = angle;
    },
    //Логика обработки команд
    _processMove() {
        var errStr = "";
        var p = undefined;
        var dir = "none";
        if (!this.commands || this.commands.length == 0) {
            errStr = "робот не знает что ему делать";
            return {
                error: errStr,
                point: p
            };
        }
        //Получаем скрипт из элемента команды для того чтобы получить логику команды
        var commScript = this.commands[0].getComponent("command_simple_script");
        if (commScript) {
            //Выполняет логику команды с обьектом игрока и возвращает результат обработки
            var whatToDo = commScript.getCommand(this);
            dir = commScript.DIRECTION;
            //Это либо массив с другими командами для обработки
            if (whatToDo.length) {
                for (var i = 0; i < whatToDo.length; i++)
                    this.commands.unshift(whatToDo[i]);
            } //Либо точка куда надо передвинуться
            else if (whatToDo.x && whatToDo.y) {
                //Удаляем верхнюю команду из стека так как она уже обработана
                this.commands.shift();
                p = whatToDo;
            } else {
                errStr = "Ошибка при обработке команды";
            }
        }
        return {
            error: errStr,
            point: p,
            direction: dir
        };
    },
    //Добавляет команды в стек команд для исполнения
    _addCommands() {

    },
});
