/*
  Скрипт отвечающий за ресайз и сдвиг группы элементов на экране(Карта кода или лабиринт)  
*/
cc.Class({
    extends: cc.Component,

    properties: {
        scrollStep: 0.0625,
        maximumScaleX: 0,
        maximumScaleY: 0,
        _minScaleX: 1,
        _minScaleY: 1,
        resizeToMouse: true,
    },

    //Инициализируем внутренние переменные для node 
    declaration() {
        var wN = this.node.getBoundingBoxToWorld();
        this.node.worldCenter = cc.p(wN.x + (wN.width / 2), wN.y + (wN.height / 2));
        this.node.FBP = { //Точки по которым проверяется выход за границы области для отрисовки поля
            ul: {
                x: this.node.x,
                y: this.node.y,
            }, //Левая верхняя граница поля
            dr: {
                x: this.node.x + this.node.width * this.node.scaleX,
                y: this.node.y - this.node.height * this.node.scaleY,
            } //Правая нижняя граница поля
        };
        this.node.isMoved = false;
        //Пробрасываем элементы в иерархию(временное решение, надо разобраться с наследованием тут)
        this.scrollStep *= 2;
        this.node.scrollStep = this.scrollStep;
        this.node.maximumScaleX = this.maximumScaleX;
        this.node.maximumScaleY = this.maximumScaleY;
        this.node._minScaleX = this.node.scaleX;
        this.node._minScaleY = this.node.scaleY;
        this.node.resizeToMouse = this.resizeToMouse;
        //Методы
        this.node.move = this.move;
        this.node.scroll = this.scroll;
        this.node.reset = this.reset;
    },

    onLoad() {
        this.declaration();
        //Инициализируем события нажатий мыши
        //Скролл колесиком мыши
        this.node.on('mousewheel', function(event){
            this.scroll(event,this);
        });
        //Нажатие мышки
        this.node.on('mousedown', function (event) {
            cc.director._globalVariables.eventDownedOn = this.name;
        });
        //Отпускание мышки
        this.node.on('mouseup', this.mouseUpEvent);
        //Перемещение мышки
        this.node.on('mousemove', function (event) {
            var shX = event._x - event._prevX,
                shY = event._y - event._prevY;
            if (cc.director._globalVariables.eventDownedOn && cc.director._globalVariables.eventDownedOn == this.name && (shX !== 0 || shY !== 0)) { //Если мышка зажата, то двигаем поле
                this.isMoved = true;
                this.move(shX, shY, this);
            }
        });
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, function(event){
            if(this.name == "GameNode"){
                this.isMoved = false;
            }
        });
        this.node.on(cc.Node.EventType.MOUSE_ENTER, function(event){
            //Если зашли в гейм нод, то отключаем смещение кодмапа
            if(this.name == "GameNode"){
                cc.director._globalVariables.codeMapNode.isMoved = false;
            }
        });
    },
    mouseUpEvent(event) {
        this.isMoved = false;
        cc.director._globalVariables.eventDownedOn = undefined;
    },

    //Функция обрабатывающая события скролинга(в центр)
    scroll(event, obj) {
        var diff = event._scrollY < 0 ? obj.scrollStep : -obj.scrollStep;
        //Меняем размер
        obj.setScale(obj.scaleX + diff, obj.scaleY + diff);
        console.log(obj.name + ": " + obj.scaleX + "  -  " + obj.scaleY);
        //Проверяем на минимальный размер
        if (obj.scaleX < obj._minScaleX) obj.scaleX = obj._minScaleX;
        if (obj.scaleY < obj._minScaleY) obj.scaleY = obj._minScaleY;
        if (obj.maximumScaleX != 0 && obj.scaleX > obj.maximumScaleX) obj.scaleX = obj.maximumScaleX;
        if (obj.maximumScaleY != 0 && obj.scaleY > obj.maximumScaleY) obj.scaleX = obj.maximumScaleY;
        var dx = obj.resizeToMouse ? (obj.width / 2 - event._x) : 0;
        var dy = obj.resizeToMouse ? (obj.height / 2 - event._y) : 0;
        //Смещаем туда куда указывает мышка(или тач)
        obj.move(dx, dy, obj);
    },
    //Функция для сдвига поля по дискрету
    move(discX, discY, obj) {
        //Отключает отбражение меню на кодмапе если оно активно
        if(cc.director._globalVariables.codeMapMenu.active) 
            cc.director._globalVariables.codeMapMenu.active = false;
        var x = obj.x + discX,
            y = obj.y + discY;
        //----------------
        //obj.x = x;
        //obj.y = y;return;
        //------------------
        var oldX = obj.x,
            oldY = obj.y;
        var w = (obj.width * obj.scaleX),
            h = (obj.height * obj.scaleY);
        var rx = obj.x + w,
            ry = obj.y - h;
        //Если по x входит в диапазон
        if (obj.x <= obj.FBP.ul.x) {
            if (rx >= obj.FBP.dr.x) {
                if (x > obj.FBP.ul.x)
                    obj.x = obj.FBP.ul.x;
                else if (rx + discX < obj.FBP.dr.x)
                    obj.x = (obj.FBP.dr.x - (obj.width * obj.scaleX));
                else
                    obj.x = x;
            } else obj.x = (obj.FBP.dr.x - (obj.width * obj.scaleX));
        } else obj.x = obj.FBP.ul.x;
        //Если по У входит
        if (obj.y >= obj.FBP.ul.y) {
            if (ry <= obj.FBP.dr.y) {
                if (y < obj.FBP.ul.y)
                    obj.y = obj.FBP.ul.y;
                else if (ry + discY > obj.FBP.dr.y)
                    obj.y = obj.FBP.dr.y + (obj.height * obj.scaleY);
                else
                    obj.y = y;
            } else obj.y = obj.FBP.dr.y + (obj.height * obj.scaleY);
        } else obj.y = obj.FBP.ul.y;
        //Это если содержимое меньше заданной рамки, то все изменения отменяем
        if (oldX == obj.FBP.ul.x && rx < obj.FBP.dr.x)
            obj.x = oldX;
        if (oldY == obj.FBP.ul.y && ry > obj.FBP.dr.y)
            obj.y = oldY;
    },
    //Сбросит всю ноду к начальному состоянию - координаты размер
    reset() {
        this.node.x = this.node.FBP.ul.x;
        this.node.y = this.node.FBP.ul.y;
        this.node.scaleX = this.node._minScaleX;
        this.node.scaleY = this.node._minScaleY;
    }
});
