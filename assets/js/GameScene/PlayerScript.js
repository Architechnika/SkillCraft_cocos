/*
    Скрипт для отработки логики игры. Обработчик действий для робота. Столкновения с объектами, сбор ящиков и тд. Все здесь
*/

cc.Class({
    extends: cc.Component,

    properties: {
        //private
        _currentFieldElement: null, //Элемент поля на котором стоит игрок
        _frontFieldElement: null, //Элемент поля спереди от робота
        _leftFieldElement: null, //Элемент поля слева от робота
        _rightFieldElement: null, //Элемент поля справа от робота
        _backFieldElement: null, //Элемент поля сзади от робота
        _underFieldElements: [], //Массив обьектов под роботом на клетке
        //public
        lookDirection:"up",
        playerStarted: false,
        playerMoveTime: 1,
        testCommands: {
            default: null,
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
        //this.commands.push(cc.instantiate(cc.instantiate(this.global_PrefFieldArray[i][j]);));
        this.makeAMove();
    },
    update(dt) {
        this;
    },
    //Один шаг робота. Обработка команд из стека команд и запуск перемещения из одной клетки в другую
    makeAMove() {
        if (!this.playerStarted) return;
        //Обработка верхней команды в стеке commands
        var pr = this._processMove();
        if (pr.error == "" && pr.point) {
            this.moveTo(pr.point);
        } else if (pr.error != "") {
            this.makeAMove();
        }
    },
    //Вызывает движение робота к точке x,y за playerSpeedDelay секунд
    moveTo(x, y) {
        this.node.runAction(cc.sequence(
            cc.moveTo(this.playerMoveTime, cc.p(x, y)), //Описываем экшон для плеера
            cc.callFunc(this.makeAMove, this) //Создаем ссылку на callback функцию после выполнения перемещения
        ));
    },
    //Задает направление того, куда смотрит робот
    setDirection(dir) {
        switch (dir) {
            case "up":
                this.node.rotation = 180;
                break;
            case "down":
                this.node.rotation = 0;
                break;
            case "right":
                this.node.rotation = 270;
                break;
            case "left":
                this.node.rotation = 90;
                break;
        }
        this.lookDirection = dir;
    },
    //Логика обработки команд
    _processMove() {
        var errStr = "";
        var p = undefined;
        if (!this.commands || this.commands.length == 0) {
            errStr = "робот не знает что ему делать";
        }
        //Получаем скрипт из элемента команды для того чтобы получить логику команды
        var commScript = this.commands[0].getComponent("command_simple_script");
        if (commScript) {
            //Выполняет логику команды с обьектом игрока и возвращает результат обработки
            var whatToDo = commScript.getCommand(this);
            //Это либо массив с другими командами для обработки
            if (whatToDo.length) {
                for (var i = 0; i < whatToDo.length; i++)
                    this.commands.unshift(whatToDo[i]);
            } //Либо точка куда надо передвинуться
            else if (whatToDo.x && whatToDo.y) {
                p = whatToDo;
            } else {
                errStr = "Ошибка при обработке команды";
            }
        }
        return {
            error: errStr,
            point: p
        };
    },
    //Добавляет команды в стек команд для исполнения
    _addCommands() {

    },
});
