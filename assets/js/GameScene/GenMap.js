/*
  Скрипт для генерации карты на сцене  
*/

cc.Class({
    extends: cc.Component,

    properties: {
        fields: {//Префабы всех игровых элементов
            default: [],
            type: cc.Prefab
        },
        globalFieldArray:[],
    },
    
    

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        globalFieldArray = this.generateMap(500, 3, 2);
        //Instantiating all prefabs
        for(var i = 0 ; i < globalFieldArray.length; i++){
            for(var j = 0 ; j < globalFieldArray[i].length; j++){
                //Creating the element
                var element = cc.instantiate(globalFieldArray[i][j]);
                //Adding the element to this node's child
                this.node.addChild(element);
            }
        }
    },

    update (dt) {
        this.graphicsMapSort(this.genBin(3, 3, [], [], [0, 0]),3);
    },

    generateMap(w, h, labSize) {
        //Получаем массив сгенерированного поля
        return this.graphicsMapSort(this.genBin(labSize, labSize, [], [], [0, 0]),labSize);
    },

    //Генерит лабиринт в виде строк с кодами элементов поля
    genBin(hate, width, maze, walls, currentPosition) {
        //7 - дорога, 0 - стена, 1,2,3 другие стены, 8 - вход, 9 - выход
        hate = hate % 2 == 0 ? hate + 1 : hate;
        width = width % 2 == 0 ? width + 1 : width;
        hate -= 2;
        width -= 2;
        var roadCode = '7'; //Представление элемента дороги в виде числа
        var borderCode = '0'; //Представление элемента внешних стенок в виде числа
        var entryCode = '8'; //Представление элемента входа в лаюиринт в виде числа
        var exitCode = '9'; //Представление элемента выхода из лабиринта в виде числа
        var wallCode = '1'; //Всего доступно 3 типа стенок внутри игры КОДЫ 1,2,3
        //Коды игровых предметов
        var coinCode = '4'; //КОД МОНЕТКИ

        var mazeTmp = [];
        for (var y = 0; y < hate + 2; y++) {
            maze[y] = [];
            mazeTmp[y] = [];
            for (var x = 0; x < width + 2; maze[y][x++] = borderCode) {
                mazeTmp[y][x] = borderCode;
            }
        }

        function amaze(y, x, addBlockWalls) {
            maze[y][x] = roadCode;
            if (addBlockWalls && valid(y + 1, x) && (maze[y + 1][x] == borderCode)) walls.push([y + 1, x, [y, x]]);
            if (addBlockWalls && valid(y - 1, x) && (maze[y - 1][x] == borderCode)) walls.push([y - 1, x, [y, x]]);
            if (addBlockWalls && valid(y, x + 1) && (maze[y][x + 1] == borderCode)) walls.push([y, x + 1, [y, x]]);
            if (addBlockWalls && valid(y, x - 1) && (maze[y][x - 1] == borderCode)) walls.push([y, x - 1, [y, x]]);
        }

        function valid(a, b) {
            return (a < hate && a >= 0 && b < width && b >= 0) ? true : false;
        };
        amaze(currentPosition[0], currentPosition[1], true);

        while (walls.length != 0) {
            var randomWall = walls[Math.floor(Math.random() * walls.length)],
                host = randomWall[2],
                opposite = [(host[0] + (randomWall[0] - host[0]) * 2), (host[1] + (randomWall[1] - host[1]) * 2)];
            if (valid(opposite[0], opposite[1])) {
                if (maze[opposite[0]][opposite[1]] == roadCode) walls.splice(walls.indexOf(randomWall), 1);
                else amaze(randomWall[0], randomWall[1], false), amaze(opposite[0], opposite[1], true);
            } else walls.splice(walls.indexOf(randomWall), 1);
        }

        for (var i = 1; i < mazeTmp.length - 1; i++) {
            for (var j = 1; j < mazeTmp.length - 1; j++) {
                mazeTmp[i][j] = maze[i - 1][j - 1];
                if (mazeTmp[i][j] == borderCode) {
                    mazeTmp[i][j] = wallCode; //Генерит случайную стенку внутри лабиринта КОДЫ 1 2 3
                }
            }
        }

        //Генерим местоположение входа и выхода из лабиринта
        var indx = 0;
        //Рэндомим вход или выход
        var isEntry = this.getRandomInt(0, 2) == 1;
        //Если вход/выход будет на левой и правой стенке
        if (this.getRandomInt(0, 2) == 1) {

            //Генерим рэндомный индекс из левой стенки для входа
            indx = this.getRandomInt(1, mazeTmp.length - 2);
            //Проверяем, чтобы прямо перед элементом не было стены
            if (mazeTmp[indx][1] != roadCode) indx++;
            //Ставим вход или выход на левую стенку
            mazeTmp[indx][0] = isEntry ? entryCode : exitCode;

            //Генерим рэндомный индекс из правой стенки для входа
            indx = this.getRandomInt(1, mazeTmp.length - 2);
            //Проверяем, чтобы прямо пере элементом не было стены
            if (mazeTmp[indx][mazeTmp[0].length - 2] != roadCode) indx++;
            //Ставим вход или выход на правую стенку
            mazeTmp[indx][mazeTmp[0].length - 1] = isEntry ? exitCode : entryCode;
        } else { //Если вход и выход будет на верхней и нижней стенке

            //Генерим рэндомный индекс из верхней стенки для входа
            indx = this.getRandomInt(1, mazeTmp[0].length - 2);
            //Проверяем, чтобы прямо перед элементом не было стены
            if (mazeTmp[1][indx] != roadCode) indx++;
            //Ставим вход или выход на верхней стенке
            mazeTmp[0][indx] = isEntry ? entryCode : exitCode;

            //Генерим рэндомный индекс из нижней стенки для выходв
            indx = this.getRandomInt(1, mazeTmp[mazeTmp.length - 1].length - 2);
            //Проверяем, чтобы прямо перед элементом не было стены
            if (mazeTmp[mazeTmp.length - 2][indx] != roadCode) indx++;
            //Ставим вход или выход на нижней стенке
            mazeTmp[mazeTmp.length - 1][indx] = isEntry ? exitCode : entryCode;
        }
        return mazeTmp;
    },

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },


    graphicsMapSort(arr, labSize) {
        // 1 - стена обычная, 2- стена с двойным округлением вниз, 3- стена с двойным окружением вверх, 4- стена с двойным окружением вправо
        // 5- стена с двойным окружением влево, 6- стена с одним окружением право-верх, 7-стена с одним окружением лево-верх, 8- стена с одной стеной лево-низ
        // 9- стена с одним окружением право-низ, 10- дорога прамая-вертикальная, 11- дорога Т-образная на право, 12- дорога перекресток, 13- дорога угловая правый верхний угол
        //14- дорога прямая-горизонтальная, 15- дорога угловая левый-нижний, 16- дорога угловая левый верхний угол, 17- дорога угловая правый нижний угол, 18- дорога Т-образная вверх,
        //19- дорога Т-образная вниз, 20- дорога Т-образная влево, 21 -внешняя стена левый верхний угол, 22- внешняя стена правый нижний угол, 23- внешняя стена правый верхний угол
        // 24- внешняя стена левый нижний угол, 25- внешняя стена верхняя часть, 26-внешняя стена нижняя часть, 27- внешняя стена правая часть, 28- внешняя стена левая часть
        // 29- внешняя стена Т-образный право, 30- внешная стена Т-образный лево, 31- внешнаняя стена Т-образный вверх, 32-внешняя стена Т-образный вниз
        // 33- дорога конечная точка право, 34-дорога конечная точка влево, 35-дорога конечная точка верх, 36-дорога конечная точка вниз, 37- внутренная стена Т-образная вниз
        // 38- внутренная стена Т-образная верх, 39-внутренная стена Т-образная-лево, 40-внутренная стена Т-образная-право, 41-внутренная стена прямая вертикальная, 
        // 42-внутренная стена прямая горизонтальная, 43-внутренная стена перекресток
        var rouColCount = labSize;
        var isLeftWall = false;
        var isRightWall = false;
        var isTopWall = false;
        var isBottomWall = false;

        var isLeftRoad = false;
        var isRightRoad = false;
        var isTopRoad = false;
        var isBottomRoad = false;

        var roadCode = '7'; //Представление элемента дороги в виде числа
        var borderCode = '0'; //Представление элемента внешних стенок в виде числа
        var entryCode = '8'; //Представление элемента входа в лаюиринт в виде числа
        var exitCode = '9'; //Представление элемента выхода из лабиринта в виде числа
        var wallCode = '1'; //Всего доступно 3 типа стенок внутри игры КОДЫ 1,2,3
        //Коды игровых предметов
        var coinCode = '4'; //КОД МОНЕТКИ
        
        var newArr = arr;
        for (var i = 0; i < rouColCount; i++) {
            for (var j = 0; j < rouColCount; j++) {
                isLeftWall = false;
                isRightWall = false;
                isTopWall = false;
                isBottomWall = false;
                isLeftRoad = false;
                isRightRoad = false;
                isTopRoad = false;
                isBottomRoad = false;

                if (newArr[i][j] == entryCode || newArr[i][j] == exitCode) {
                    if (newArr[i][j] == entryCode) {
                        if (i == 0) {//Верх
                            newArr[i][j] = this.fields[34];
                            continue;
                        }
                        if (i == rouColCount - 1) {//Низ
                            newArr[i][j] = this.fields[31];
                            continue;
                        }
                        if (j == 0) {//Лево
                            newArr[i][j] = this.fields[32];
                            continue;
                        }
                        if (j == rouColCount - 1) {//Право
                            newArr[i][j] = this.fields[33];
                            continue;
                        }

                    }
                    if (newArr[i][j] == exitCode) {
                        if (i == 0) {
                            newArr[i][j] = this.fields[15];
                            continue;
                        }
                        if (i == rouColCount - 1) {
                            newArr[i][j] = this.fields[12];
                            continue;
                        }
                        if (j == 0) {
                            newArr[i][j] = this.fields[13];
                            continue;
                        }
                        if (j == rouColCount - 1) {
                            newArr[i][j] = this.fields[14];
                            continue;
                        }

                    }
                }

                //внешние стены
                if (j == 0) { //картинка для левого верхнего угла внешних стен
                    if (i == 0) {
                        //картинка 20
                        newArr[i][j] = this.fields[5];
                        continue;
                    }
                    if (i == rouColCount - 1) {
                        //картинка 23
                        newArr[i][j] = this.fields[6];
                        continue;
                    }
                    if (arr[i][j + 1] == "1") {
                        newArr[i][j] = this.fields[2];
                        continue;
                    }
                    //картинка 27
                    newArr[i][j] = this.fields[9];
                    continue;
                }
                if (j == rouColCount - 1) { //картинка для правого верхнего угла внешних стен
                    if (i == 0) {
                        //картинка 21
                        newArr[i][j] = this.fields[7];
                        continue;
                    }
                    if (i == rouColCount - 1) {
                        //картинка 22
                        newArr[i][j] = this.fields[6];
                        continue;
                    }
                    if (arr[i][j - 1] == "1") {
                        newArr[i][j] = this.fields[1];
                        continue;
                    }
                    //картинка 26
                    newArr[i][j] = this.fields[10];
                    continue;
                }
                if (i == rouColCount - 1) {
                    if (arr[i - 1][j] == "1") {
                        newArr[i][j] = this.fields[3];
                        continue;
                    }
                    newArr[i][j] = this.fields[8];
                    continue;
                }
                //
                if (i == 0 && j != 0 && j != rouColCount - 1) {
                    if (arr[i + 1][j] == "1") {
                        newArr[i][j] = this.fields[0];
                        continue;
                    }
                    //картинка 24
                    newArr[i][j] = this.fields[11];
                    continue;
                }
                //если дорога
                if (arr[i][j] == "7") {
                    //определяем наличие стен посторонам дороги
                    // если справо стена любого типа
                    if (arr[i][j + 1] != "7" && arr[i][j + 1] != entryCode && arr[i][j + 1] != exitCode) {
                        isRightWall = true;
                    }
                    //если слева стена
                    if (arr[i][j - 1] != "7" && arr[i][j - 1] != entryCode && arr[i][j - 1] != exitCode) {
                        isLeftWall = true;
                    }
                    //если снизу стена
                    if (arr[i + 1][j] != "7" && arr[i + 1][j] != entryCode && arr[i + 1][j] != exitCode) {
                        isBottomWall = true;
                    }
                    //если сверху стена
                    if (arr[i - 1][j] != "7" && arr[i - 1][j] != entryCode && arr[i - 1][j] != exitCode) {
                        isTopWall = true;
                    }
                    //

                    if (isLeftWall && isRightWall && !isTopWall && !isBottomWall) {
                        //картинка 1) из бумажки
                        newArr[i][j] = this.fields[29];
                        continue;
                    }
                    if (!isTopWall && !isLeftWall && !isRightWall && isBottomWall) {
                        //картинка 9)
                        newArr[i][j] = this.fields[19];
                        continue;
                    }
                    if (isTopWall && isBottomWall && !isLeftWall && !isRightWall) {
                        //картинка 5)
                        newArr[i][j] = this.fields[28];
                        continue;
                    }
                    if (!isTopWall && !isLeftWall && !isBottomWall && isRightWall) {
                        //картинка 11)
                        newArr[i][j] = this.fields[17];
                        continue;
                    }
                    if (!isTopWall && isLeftWall && !isBottomWall && !isRightWall) {
                        //картинка 2)
                        newArr[i][j] = this.fields[18];
                        continue;
                    }
                    if (!isTopWall && !isLeftWall && !isBottomWall && !isRightWall) {
                        //картинка 3)
                        newArr[i][j] = this.fields[25];
                        continue;
                    }
                    if (isTopWall && !isLeftWall && !isBottomWall && !isRightWall) {
                        //картинка 10)
                        newArr[i][j] = this.fields[16];
                        continue;
                    }
                    if (isTopWall && !isLeftWall && !isBottomWall && isRightWall) {
                        //картинка 4)
                        newArr[i][j] = this.fields[23];
                        continue;
                    }
                    if (!isTopWall && isLeftWall && isBottomWall && !isRightWall) {
                        //картинка 6)
                        newArr[i][j] = this.fields[20];
                        continue;
                    }
                    if (isTopWall && isLeftWall && !isBottomWall && !isRightWall) {
                        //картинка 7)
                        newArr[i][j] = this.fields[21];
                        continue;
                    }
                    if (!isTopWall && !isLeftWall && isBottomWall && isRightWall) {
                        //картинка 8)
                        newArr[i][j] = this.fields[22];
                        continue;
                    }
                    if (isTopWall && !isLeftWall && isBottomWall && isRightWall) {
                        newArr[i][j] = this.fields[27];
                        continue;
                    }
                    if (isTopWall && isLeftWall && isBottomWall && !isRightWall) {
                        newArr[i][j] = this.fields[26];
                        continue;
                    }
                    if (isTopWall && isLeftWall && !isBottomWall && isRightWall) {
                        newArr[i][j] = this.fields[30];
                        continue;
                    }
                    if (!isTopWall && isLeftWall && isBottomWall && isRightWall) {
                        newArr[i][j] = this.fields[24];
                        continue;
                    }
                }
                if (arr[i][j] == "1") {
                    // если справо дорога любого типа
                    if (arr[i][j + 1] == "7" || arr[i][j + 1] == entryCode || arr[i][j + 1] == exitCode) {
                        isRightRoad = true;
                    }
                    //если слева дорога
                    if (arr[i][j - 1] == "7" || arr[i][j - 1] == entryCode || arr[i][j - 1] == exitCode) {
                        isLeftRoad = true;
                    }
                    //если снизу дорога
                    if (arr[i + 1][j] == "7" || arr[i + 1][j] == entryCode || arr[i + 1][j] == exitCode) {
                        isBottomRoad = true;
                    }
                    //если сверху дорога
                    if (arr[i - 1][j] == "7" || arr[i - 1][j] == entryCode || arr[i - 1][j] == exitCode) {
                        isTopRoad = true;
                    }
                    //

                    if (isLeftRoad && isRightRoad && isBottomRoad && !isTopRoad) {
                        //картинка 12
                        newArr[i][j] = this.fields[24];
                        continue;
                    }
                    if (isLeftRoad && isRightRoad && !isBottomRoad && isTopRoad) {
                        //картинка 13
                        newArr[i][j] = this.fields[30];
                        continue;
                    }
                    if (!isLeftRoad && isRightRoad && isBottomRoad && isTopRoad) {
                        //картинка 14
                        newArr[i][j] = this.fields[27];
                        continue;
                    }
                    if (isLeftRoad && !isRightRoad && isBottomRoad && isTopRoad) {
                        //картинка 15
                        newArr[i][j] = this.fields[26];
                        continue;
                    }
                    if (!isLeftRoad && isRightRoad && !isBottomRoad && isTopRoad) {
                        //картинка 16
                        newArr[i][j] = this.fields[42];
                        continue;
                    }
                    if (isLeftRoad && !isRightRoad && !isBottomRoad && isTopRoad) {
                        //картинка 17
                        newArr[i][j] = this.fields[40];
                        continue;
                    }
                    if (isLeftRoad && !isRightRoad && isBottomRoad && !isTopRoad) {
                        //картинка 18
                        newArr[i][j] = this.fields[39];
                        continue;
                    }
                    if (!isLeftRoad && isRightRoad && isBottomRoad && !isTopRoad) {
                        //картинка 19
                        newArr[i][j] = this.fields[41];
                        continue;
                    }
                    if (!isLeftRoad && !isRightRoad && !isBottomRoad && isTopRoad) {
                        newArr[i][j] = this.fields[16];
                        continue;
                    }
                    if (!isLeftRoad && !isRightRoad && isBottomRoad && !isTopRoad) {
                        newArr[i][j] = this.fields[19];
                        continue;
                    }
                    if (!isLeftRoad && isRightRoad && !isBottomRoad && !isTopRoad) {
                        newArr[i][j] = this.fields[17];
                        continue;
                    }
                    if (isLeftRoad && !isRightRoad && !isBottomRoad && !isTopRoad) {
                        newArr[i][j] = this.fields[18];
                        continue;
                    }
                    if (isLeftRoad && isRightRoad && !isBottomRoad && !isTopRoad) {
                        newArr[i][j] = this.fields[49];
                        continue;
                    }
                    if (!isLeftRoad && !isRightRoad && isBottomRoad && isTopRoad) {
                        newArr[i][j] = this.fields[47];
                        continue;
                    }
                    if (!isLeftRoad && !isRightRoad && !isBottomRoad && !isTopRoad) {
                        newArr[i][j] = this.fields[48];
                        continue;
                    }
                }

            }
        }
        return newArr;
    }
});