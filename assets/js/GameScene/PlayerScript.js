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
        _isFinish: false,
        //public
        parentNode:cc.Node,
        lookDirection: "up",
        playerStarted: false,
        _playerMoveTime: 1,
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
                } else if(other.tag == 1){//Если это дорога(или вход или выход)
                    this._currentFieldElement = other.node;
                    //Добавляем команды из клетки поля в стек команд
                    this._addCommands(this._currentFieldElement.getComponent("RoadScript").roadCommands);
                    this._underFieldElements.splice(0, this._underFieldElements.length);
                } else if(other.tag == 5){//Робот доехал до финиша
                    this._isFinish = true;
                }
                else{
                    if(this.node._actionSeq)
                        this.node.stopAction(this.node._actionSeq);
                    console.log("Робот врезался в стену");
                }
            } else {
                if (other.node !== this._currentFieldElement && other.tag !== 3) { //Если это не коллизия с ТЕКУЩЕЙ КЛЕТКОЙ то обрабатываем
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
    /*update(dt) {
    },*/
    start(){
        this._playerMoveTime = this.node.parent.getComponent("GlobalVariables").playerSpeed;
    },
    play() {
        this.playerStart = true;
        this.makeAMove();
    },
    stop(){
        this.playerStart = false;
    },
    //Один шаг робота. Обработка команд из стека команд и запуск перемещения из одной клетки в другую
    makeAMove() {
        if (!this.playerStarted) return;
        if(this._isFinish){//ТОЧКА ДОСТИЖЕНИЯ ФИНИША ЗДЕСЬ----------------------------------------------------------------------------------------------
            console.log("FINISH");
            //this.node.parent.getComponent("GlobalVariables").currentLabSize += 2;
            //cc.director.loadScene("MainMenu");
            return;
        }
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
        var actions = [cc.moveTo(this._playerMoveTime, p), //Описываем экшон для плеера
            cc.callFunc(this.makeAMove, this)]; //Создаем ссылку на callback функцию после выполнения перемещения
        //Поворачиваем робота если требуется
        if (this.lookDirection != dir && dir !== "onup")
            actions.unshift(cc.rotateTo(this._playerMoveTime, this.setDirection(dir, true)));
        this.node._actionSeq = cc.sequence(actions);
        this.node.runAction(this.node._actionSeq);
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
            if(!whatToDo){
                errStr = "Робот не может туда поехать";
            }
            else if (whatToDo.length) {
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
    _addCommands(comms) {
        if(!comms || comms.length == 0)
            return;
        //Добавляем в начало стека элементы из клетки
        this.commands = [];
        for(var i = comms.length - 1; i >= 0; i--){
            this.commands.unshift(this._cloneNode(comms[i]));
        }
    },
    
    _cloneNode(node){
        var copy = cc.instantiate(node);
        copy.parent = cc.director.getScene();
        copy.setPosition(0, 0);
        return copy;
    }
});
