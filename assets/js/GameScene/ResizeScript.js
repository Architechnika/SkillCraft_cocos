/*
  Скрипт отвечающий за ресайз и сдвиг группы элементов на экране(Карта кода или лабиринт)  
*/
cc.Class({
    extends: cc.Component,

    properties: {
        scrollStep: 0.0625,
        maximumScaleX: 0,
        maximumScaleY: 0,
        resizeToMouse: true,        
    },

    //Инициализируем внутренние переменные для node 
    declaration() {
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
        this.node.isDowned = false;
        this.node.isMoved = false;
        //Пробрасываем элементы в иерархию(временное решение, надо разобраться с наследованием тут)
        this.scrollStep *= 2;
        this.node.scrollStep = this.scrollStep;
        this.node.maximumScaleX = this.maximumScaleX;
        this.node.maximumScaleY = this.maximumScaleY;
        this.node.resizeToMouse = this.resizeToMouse;
        //Методы
        this.node.field_move = this.field_move;
    },

    onLoad() {
        this.declaration();
        //Инициализируем события нажатий мыши
        //Скролл колесиком мыши
        this.node.on('mousewheel', this.field_scroll);
        //Нажатие мышки
        this.node.on('mousedown', function (event) {
            this.isDowned = true;
        });
        //Отпускание мышки
        this.node.on('mouseup', function (event) {
            this.isMoved = false;
            this.isDowned = false;
        });
        //Перемещение мышки
        this.node.on('mousemove', function (event) {
            var shX = event._x - event._prevX,
                shY = event._y - event._prevY;
            if (this.isDowned && (shX !== 0 || shY !== 0)) { //Если мышка зажата, то двигаем поле
                this.isMoved = true;
                this.field_move(shX, shY);
            }
        });
    },

    //Функция обрабатывающая события скролинга(в центр)
    field_scroll(event) {
        var diff = event._scrollY < 0 ? this.scrollStep : -this.scrollStep;
        //Меняем размер
        this.setScale(this.scaleX + diff, this.scaleY + diff);
        //Проверяем на минимальный размер
        if (this.scaleX < 1) this.scaleX = 1;
        if (this.scaleY < 1) this.scaleY = 1;
        if (this.maximumScaleX != 0 && this.scaleX > this.maximumScaleX) this.scaleX = this.maximumScaleX;
        if (this.maximumScaleY != 0 && this.scaleY > this.maximumScaleY) this.scaleX = this.maximumScaleY;
        var dx = this.resizeToMouse ? (this.width / 2 - event._x) : 0;
        var dy = this.resizeToMouse ? (this.height / 2 - event._y) : 0;
        //Смещаем туда куда указывает мышка(или тач)
        this.field_move(dx, dy);
    },
    //Функция для сдвига поля по дискрету
    field_move(discX, discY) {
        var x = this.x + discX,
            y = this.y + discY;
        var oldX = this.x,
            oldY = this.y;
        var w = (this.width * this.scaleX), h = (this.height * this.scaleY);
        var rx = this.x + w,
            ry = this.y - h;
        //Если по x входит в диапазон
        if (this.x <= this.FBP.ul.x) {
            if (rx >= this.FBP.dr.x) {
                if (x > this.FBP.ul.x)
                    this.x = this.FBP.ul.x;
                else if (rx + discX < this.FBP.dr.x)
                    this.x = (this.FBP.dr.x - (this.width * this.scaleX));
                else
                    this.x = x;
            } else this.x = (this.FBP.dr.x - (this.width * this.scaleX));
        } else this.x = this.FBP.ul.x;
        //Если по У входит
        if (this.y >= this.FBP.ul.y) {
            if (ry <= this.FBP.dr.y) {
                if (y < this.FBP.ul.y)
                    this.y = this.FBP.ul.y;
                else if (ry + discY > this.FBP.dr.y)
                    this.y = this.FBP.dr.y + (this.height * this.scaleY);
                else
                    this.y = y;
            } else this.y = this.FBP.dr.y + (this.height * this.scaleY);
        } else this.y = this.FBP.ul.y;
        //Это если содержимое меньше заданной рамки, то все изменения отменяем
        if(oldX == this.FBP.ul.x && rx < this.FBP.dr.x)
            this.x = oldX;
        if(oldY == this.FBP.ul.y && ry > this.FBP.dr.y)
            this.y = oldY;
    },
});
