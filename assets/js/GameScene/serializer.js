// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        isIE: undefined,
        isMoz: undefined,
        use_encryption: false,
        use_compression: false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
         this.isIE = navigator.userAgent.toLowerCase().indexOf("msie") > -1;
         this.isMoz = document.implementation && document.implementation.createDocument;
    },

    start() {

    },

    serialize(objectToSerialize, objectName, indentSpace) {
        indentSpace = indentSpace ? indentSpace : '';

        // Get object type name to serialize
        var type = this.getTypeName(objectToSerialize);

        // string to store serialized XML
        var s = indentSpace + '<' + objectName + ' type="' + type + '">';

        switch (type) {
            case "number":
            case "string":
            case "boolean":
                s += objectToSerialize;
                break;
            case "date":
                s += objectToSerialize.toLocaleString();
                break;
            case "Function":
                s += "\n";
                s += "<![CDATA[" + objectToSerialize + "]]>";
                s += indentSpace;
                break;
            case "array":
                s += "\n";
                for (var a in objectToSerialize) {
                    s += this.serialize(objectToSerialize[a], ('index' + a), indentSpace + "   ");
                }
                s += indentSpace;
                break;
            default:
                s += "\n";

                for (var o in objectToSerialize) {
                    s += this.serialize(objectToSerialize[o], o, indentSpace + "   ");
                }
                s += indentSpace;
                break;
        }

        s += "</" + objectName + ">\n";

        return s;
    },
    deserialize(XmlText) {
        var _doc = getDom(XmlText);
        return this.deserial(_doc.childNodes[0]);
    },
    getGom(strXml) {
        var _doc = null;

        if (this.isIE) {
            _doc = new ActiveXObject("Msxml2.DOMDocument.3.0");
            _doc.loadXML(strXml);
        } else {
            var parser = new DOMParser();
            _doc = parser.parseFromString(strXml, "text/xml");
        }

        return _doc;
    },

    deserial(domObject) {
        var retObj;
        var nodeType = this.getNodeType(domObject);

        if (this.isSimpleVar(nodeType)) {
            if (this.isIE) {
                return this.stringToObject(domObject.text, nodeType);
            } else {
                return this.stringToObject(domObject.textContent, nodeType);
            }
        }

        switch (nodeType) {
            case "array":
                return this.deserializeArray(domObject);
            case "Function":
                return this.deserializeFunction(domObject);
            default:
                try {
                    retObj = eval("new " + nodeType + "()");
                } catch (e) {
                    // create generic class
                    retObj = {};
                }
                break;
        }

        for (var i = 0; i < domObject.childNodes.length; i++) {
            var Node = domObject.childNodes[i];
            retObj[Node.nodeName] = this.deserial(Node);
        }

        return retObj;
    },

    isSimpleVar(type) {
        switch (type) {
            case "int":
            case "string":
            case "String":
            case "Number":
            case "number":
            case "Boolean":
            case "boolean":
            case "bool":
            case "dateTime":
            case "Date":
            case "date":
            case "float":
                return true;
        }

        return false;
    },
    stringToObject(text, type) {
        var retObj = null;

        switch (type.toLowerCase()) {
            case "int":
                return parseInt(text, 10);

            case "number":
                var outNum;

                if (text.indexOf(".") > 0) {
                    return parseFloat(text);
                } else {
                    return parseInt(text, 10);
                }

            case "string":
                return text;

            case "dateTime":
            case "date":
                return new Date(text);

            case "float":
                return parseFloat(text, 10);

            case "bool":
                if (text == "true" || text == "True") {
                    return true;
                } else {
                    return false;
                }
        }

        return retObj;
    },

    getClassName(obj) {
        try {
            var ClassName = obj.constructor.toString();
            ClassName = ClassName.substring(ClassName.indexOf("function") + 8, ClassName.indexOf('(')).replace(/ /g, '');
            return ClassName;
        } catch (e) {
            return "NULL";
        }
    },
    getTypeName(obj) {
        if (obj instanceof Array) {
            return "array";
        }

        if (obj instanceof Date) {
            return "date";
        }

        var type = typeof (obj);

        if (this.isSimpleVar(type)) {
            return type;
        }

        type = this.getClassName(obj);

        return type;
    },

    deserializeArray(node) {
        var retObj = [];

        // Cycle through the array's TOP LEVEL children
        while ((child = node.firstChild) != null) {

            // delete child so it's children aren't recursed
            node.removeChild(node.firstChild);

            var nodeType = this.getNodeType(child);

            if (this.isSimpleVar(nodeType)) {
                retObj[retObj.length] = child.textContent;
            } else {
                var tmp = child.textContent;
                if (child.textContent.trim() != '') {
                    retObj[retObj.length] = this.deserial(child);
                }
            }
        }
        return retObj;
    },

    deserializeFunction(func) {
        if (func && func.textContent) {
            return eval(func.textContent);
        }
    },
    getNodeType(node) {
        var nodeType = "object";

        if (node.attributes != null && node.attributes.length != 0) {
            var tmp = node.attributes.getNamedItem("type");
            if (tmp != null) {
                nodeType = node.attributes.getNamedItem("type").nodeValue;
            }
        }

        return nodeType;
    },

    //    if (!String.prototype.trim) {
    //        String.prototype.trim = function () {
    //            a = this.replace(/^\s+/, '');
    //            return a.replace(/\s+$/, '');
    //        };
    //    }

    // update (dt) {},
});
