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
        _startElement: undefined,
        _addedCommands: [], //Массив для хранения ссылок на обьекты поля с которых уже были считаны команды(чтобы не читать их дважды)
        _completedCommands: [], //Массив для хранения выполненных команд
        _movedPoints: [], //Массив для хранения точек по которым ехал робот пока проходил лабиринт
        _playerStarted: false,
        _playerMoveTime: 1,
        //public
        parentNode: cc.Node,
        lookDirection: "up",
        commands: [],
        inventory: [],
        autoMoveCam: false,
    },

    //Обработчик коллизий
    onCollisionEnter: function (other, self) {
        //console.log("Collision : " + self.node.name + ",tag " + self.tag + " with " + other.node.name);
        //Обрабатываем только коллизи Робот + обьект
        if (self.node.name == "Player") {
            if (self.tag == 0) { //Если коллизия центрального бокса робота с клеткой
                if (other.tag == 3) { //Если это игровой обьект
                    this._underFieldElements.push(other.node);
                } else if (other.tag == 1) { //Если это дорога(или вход или выход)
                    this._currentFieldElement = other.node;
                    cc.director._globalVariables.player_cellCounter++; //Счетчик того сколько клеток проехал робот
                    //Добавляем команды из клетки поля в стек команд
                    this._addCommands(this._currentFieldElement);
                    this._underFieldElements.splice(0, this._underFieldElements.length);
                } else if (other.tag == 5) { //Робот доехал до финиша
                    this._isFinish = true;
                } else {
                    if (other.name.split("_")[0] != "command") {
                        cc.director._globalVariables.player_totalErrors++;
                        this._playerErrorAction("Робот врезался в стену");
                    }
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
                    /* console.log("front : " + this._frontFieldElement.name)
                     console.log("back : " + this._backFieldElement.name)
                     console.log("left : " + this._leftFieldElement.name)
                     console.log("right : " + this._rightFieldElement.name)*/
                }
            }
        }
    },

    onCollisionExit: function (other, self) {
        if (other.tag == 3 && self.tag == 0) {
            this._underFieldElements.splice(this._underFieldElements.indexOf(other), 1);
            //console.log(this._underFieldElements.length);
        }
    },
    /*update(dt) {
    },*/
    start() {
        this._playerMoveTime = cc.director._globalVariables.playerSpeed;
    },
    play() {
        cc.director._globalVariables.codeMapNode.active = false;
        this._playerStarted = true;
        this.makeAMove();
    },
    stop() {
        if (this.node._actionSeq)
            this.node.stopAction(this.node._actionSeq);
        this._playerStarted = false;
    },
    //Возвращает робота на клетку назад
    prevStep() {
        if (this.node.getNumberOfRunningActions() == 0) {
            var p = this._movedPoints.shift();
            if (p)
                this.moveTo(p.point, p.direction, true);
        }
    },
    makeStep() {
        if (this.node.getNumberOfRunningActions() == 0) {
            this.makeAMove(true);
        }
    },
    //Один шаг робота. Обработка команд из стека команд и запуск перемещения из одной клетки в другую
    makeAMove(oneTime) {
        if (oneTime != true && !this._playerStarted) return;
        this._addCommands(this._currentFieldElement);
        if (this._isFinish) { //ТОЧКА ДОСТИЖЕНИЯ ФИНИША ЗДЕСЬ----------------------------------------------------------------------------------------------
            console.log("FINISH");
            //this.node.parent.getComponent("GlobalVariables").currentLabSize += 2;
            cc.director.getScene().destroy();
            //ПЕРЕХОД НА СЦЕНУ С РЕЗУЛЬТАТОМ ПРОХОЖДЕНИЯ ЛАБИРИНТА
            cc.director.loadScene("EndGameScene");
            return;
        }
        //Обработка верхней команды в стеке commands
        var pr = this._processMove();
        if (pr.error == "" && pr.point) { //Если это простая команда
            //ПОДБИРАЕМ ОБЬЕКТ--------------------------------------------------------------------
            if (pr.point == "pickup") { //Если это команда подобрать обьект под собой
                var el = this._underFieldElements[0];
                this.inventory.push(this._underFieldElements[0]._prefab);
                //Увеличиваем счетчик собранных ящиков
                if (el.name == "gameObject_box")
                    cc.director._globalVariables.player_totalBoxes++;
                //Обновляем инфу на экране о собранных ящиках
                cc.director._globalVariables.labelBoxes.node._components[0].string = cc.director._globalVariables.player_totalBoxes + "";
                this._underFieldElements[0].destroy();
                this._currentFieldElement.getComponent("RoadScript").isGameObjectName = null;
                this.makeAMove();
            } else { //Иначе это команда передвинуться в точку------------------------------------
                var res = this.moveTo(pr.point, pr.direction);
                if (res) console.log(res);
            }
        } else if (pr.error != "") { //ОБРАБОТКА ОШИБКИ В ДВИЖЕНИИ РОБОТА
            this._playerErrorAction(pr.error);
        } else if (pr.error == "") {
            this.makeAMove();
        }
    },
    setToStart() {
        if (this.node._actionSeq)
            this.node.stopAction(this.node._actionSeq);
        var dir = this._startElement.name.split("_")[2];
        dir = this._revertDir(dir);
        this.setDirection(dir);
        this.node.x = this._startElement.x;
        this.node.y = this._startElement.y;
        this._addedCommands = [];
        if (this._playerStarted) {
            cc.director._globalVariables.guiNode.getChildByName("buttons").getChildByName("startButton").active = true;
            cc.director._globalVariables.guiNode.getChildByName("buttons").getChildByName("stopButton").active = false;
            this._playerStarted = false;
        }
        //Выводим робота в центр камеры
        this._robotCamFocus();
    },
    //Вызывает движение робота к точке x,y за playerSpeedDelay секунд
    moveTo(p, dir, dontRemember) {
        //Добавляем точку куда поедем в историю перемещений
        if (!dontRemember) {
            this._movedPoints.unshift({
                point: cc.p(this.node.x, this.node.y),
                direction: this._revertDir(this.lookDirection)
            });
        }
        var actions = [cc.moveTo(this._playerMoveTime, p), //Описываем экшон для плеера
            cc.callFunc(this.makeAMove, this)]; //Создаем ссылку на callback функцию после выполнения перемещения
        //Поворачиваем робота если требуется
        if (this.lookDirection != dir && dir !== "onup")
            actions.unshift(cc.rotateTo(this._playerMoveTime, this.setDirection(dir, true)));
        this.node._actionSeq = cc.sequence(actions);
        this.node.runAction(this.node._actionSeq);
    },
    _revertDir(dir) {
        if (dir == "left") return "right";
        else if (dir == "right") return "left";
        else if (dir == "up") return "down";
        else if (dir == "down") return "up";
        return dir;
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
            case "onup": //Вперед
                angle = this.node.rotation;
                dir = this.lookDirection;
                break;
            case "ondown": //Назад
                if (this.lookDirection == "up") return this.setDirection("down", isAnim);
                else if (this.lookDirection == "down") return this.setDirection("up", isAnim);
                else if (this.lookDirection == "left") return this.setDirection("right", isAnim);
                else if (this.lookDirection == "right") return this.setDirection("left", isAnim);
                break;
            case "onleft": //Влево
                if (this.lookDirection == "up") return this.setDirection("left", isAnim);
                else if (this.lookDirection == "down") return this.setDirection("right", isAnim);
                else if (this.lookDirection == "left") return this.setDirection("down", isAnim);
                else if (this.lookDirection == "right") return this.setDirection("up", isAnim);
                break;
            case "onright": //Вправо
                if (this.lookDirection == "up") return this.setDirection("right", isAnim);
                else if (this.lookDirection == "down") return this.setDirection("left", isAnim);
                else if (this.lookDirection == "left") return this.setDirection("up", isAnim);
                else if (this.lookDirection == "right") return this.setDirection("down", isAnim);
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
            errStr = "Робот не знает что ему делать";
            return {
                error: errStr,
                point: p
            };
        }
        if (this.commands[0]._children[0].getComponent("command_if_script")) { //Если верхняя команда в стеке это команда из блока с условием IF
            var commScript = this.commands[0]._children[0].getComponent("command_if_script");
            var whatToDo = commScript.getCommand(this);
            if (!whatToDo) errStr = "Ошибка при обработке команды IF";
            else {
                this.commands.shift();
                for (var i = whatToDo.length - 1; i >= 0; i--)
                    this.commands.unshift(whatToDo[i]);
            }
        } else if (this.commands[0]._children[0].getComponent("command_repeatif_script")) { //Если верхняя команда в стеке это команда из блока с условием REPEATIF
            var commScript = this.commands[0]._children[0].getComponent("command_repeatif_script");
            var whatToDo = commScript.getCommand(this);
            if (!whatToDo) errStr = "Ошибка при обработке команды REPEATIF";
            else {
                if (!whatToDo || whatToDo.length == 0)
                    this.commands.shift();
                for (var i = whatToDo.length - 1; i >= 0; i--)
                    this.commands.unshift(whatToDo[i]);
            }
        } else if (this.commands[0]._children[0].getComponent("command_counter_script")) { //Если верхняя команда в стеке это команда из блока с условием COUNT
            var commScript = this.commands[0]._children[0].getComponent("command_counter_script");
            var whatToDo = commScript.getCommand(this);
            if (!whatToDo) errStr = "Ошибка при обработке команды COUNT";
            else {
                if (!whatToDo || whatToDo.length == 0)
                    this.commands.shift();
                for (var i = whatToDo.length - 1; i >= 0; i--)
                    this.commands.unshift(whatToDo[i]);
            }
        } else if (this.commands[0].getComponent("command_simple_script")) { //Обработка простых команд
            //Получаем скрипт из элемента команды для того чтобы получить логику команды
            var commScript = this.commands[0].getComponent("command_simple_script");
            if (commScript) {
                //Выполняет логику команды с обьектом игрока и возвращает результат обработки
                var whatToDo = commScript.getCommand(this);
                dir = commScript.DIRECTION;
                //Если вернулось undefined - ошибка
                if (!whatToDo) {
                    errStr = "Робот не может туда поехать";
                } else {
                    if (whatToDo.x && whatToDo.y) { //Если точка то надо передвинуться
                        p = whatToDo;
                    } else if (dir == "pickup") { //Если команда подобрать элемент
                        if (whatToDo) {
                            p = whatToDo;
                        } else {
                            errStr = "Подбирать нечего";
                        }
                    } else {
                        errStr = "Ошибка при обработке команды";
                    }
                    this.commands.shift();
                }
            }
        }
        return {
            error: errStr,
            point: p,
            direction: dir
        };
    },
    _playerErrorAction(message) {
        if (this.node._actionSeq)
            this.node.stopAction(this.node._actionSeq);
        //console.log(message);
        cc.director._globalVariables.showMessageBox(message,0);
        this.setToStart();
    },
    //Добавляет команды в стек команд для исполнения
    _addCommands(element) {
        if (this._addedCommands.includes(element))
            return;
        var comms = element.getComponent("RoadScript").roadCommands;
        if (!comms || comms.length == 0)
            return;
        //Добавляем в начало стека элементы из клетки
        this.commands = [];
        for (var i = comms.length - 1; i >= 0; i--) {
            var clone = this._cloneNode(comms[i]);
            if (clone)
                this.commands.unshift(clone);
        }
        this._addedCommands.push(element);
    },

    _cloneNode(node) {
        var copy = cc.instantiate(node);
        if (!copy) return undefined;
        copy.parent = cc.director.getScene();
        copy.setPosition(0, 0);
        return copy;
    },
    //Передвигает и масштабирует камеру так, чтобы робот был в центре
    _robotCamFocus(){
        if(cc.director._globalVariables.player_lvl > 2){//Если поле достаточно большое, то его надо ресайзить и сдвигать чтобы следовать за роботом
            if(cc.director._globalVariables.player_lvl == 3){//Если уровень игрока 3(поле 7 на 7)
                cc.director._globalVariables.gameNode.scaleY = cc.director._globalVariables.gameNode.scaleX = 1.25;
            } else {//Если поле больше чем 7 на 7
                cc.director._globalVariables.gameNode.scaleY = cc.director._globalVariables.gameNode.scaleX = ((cc.director._globalVariables.player_lvl - 3) * 0.5) + 1.25;
            }
            try{
                var rW = this.node.getBoundingBoxToWorld();
                var gnW = cc.director._globalVariables.gameNode.worldCenter;
                var discX = gnW.x - rW.x;
                var discY = gnW.y - rW.y;
                cc.director._globalVariables.gameNode.getComponent("ResizeScript").move(discX,discY, cc.director._globalVariables.gameNode);   
            }
            catch(err){
                console.log(err);
            }
        }
    },
    
    update(dt){
        //Если включен режим следования за роботом, то двигаем поле так чтобы робот был в центре экрана
        if(this.autoMoveCam && this._playerStarted){
            this._robotCamFocus();
        }
    }
});
