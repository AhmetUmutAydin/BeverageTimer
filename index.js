var beverageData = {
    dailyRecords: []
};

var dailyRecord = {
    Id: Number,
    type: Number,
    preparedTime: Date,
    otherName: String,
};

var idCounter = 1;
const BeverageTypeEnum = Object.freeze({ "tea": 1, "coffee": 2, "other": 3 });

const getLocalStorage = () => {
    if (typeof (Storage) !== "undefined") {
        let data = localStorage.getItem("beverageData");
        jsonToModel(data);
        checkEndOfTheDay();
    } else {
        document.getElementById("notSupported").innerHTML = "Sorry, your browser does not support Web Storage...";
    }
}

const setLocalStorage = () => {
    if (typeof (Storage) !== "undefined") {
        let json = modelToJson(beverageData);
        localStorage.setItem("beverageData", json);
    } else {
        document.getElementById("notSupported").innerHTML = "Sorry, your browser does not support Web Storage...";
    }
}

const jsonToModel = (jsonData) => {
    let model = JSON.parse(jsonData);
    if (model) {
        return beverageData = model;
    }
    else {
        return beverageData;
    }
}

const modelToJson = (model) => {
    return JSON.stringify(model);
}

const beveragePrepared = (type) => {
    var copy = Object.assign({}, dailyRecord);
    copy.preparedTime = new Date();
    copy.Id = idCounter;
    copy.type = type;
    idCounter++;
    beverageData.dailyRecords.push(copy);
    setLocalStorage();
    return copy.preparedTime;
}

const addCoffee = () => {
    let lastIndex = findTheLast(2) + 1;
    if (lastIndex != 0) {
        var lastNode = document.getElementById(lastIndex);
        lastNode.style.textDecoration = "line-through";
    }
    let time = beveragePrepared(BeverageTypeEnum.coffee);
    let h = time.getHours();
    let m = time.getMinutes();
    let s = time.getSeconds();
    var node = document.createElement("p");
    var textnode = document.createTextNode(h + ":" + m + ":" + s);
    node.appendChild(textnode);
    node.id = beverageData.dailyRecords.length;
    node.style.color = "white";
    document.getElementById("preparedCoffees").appendChild(node);
}

const addTea = () => {
    let lastIndex = findTheLast(1) + 1;
    if (lastIndex != 0) {
        var lastNode = document.getElementById(lastIndex);
        lastNode.style.textDecoration = "line-through";
    }
    let time = beveragePrepared(BeverageTypeEnum.tea);
    let h = time.getHours();
    let m = time.getMinutes();
    let s = time.getSeconds();
    var node = document.createElement("p");
    var textnode = document.createTextNode(h + ":" + m + ":" + s);
    node.appendChild(textnode);
    node.id = beverageData.dailyRecords.length;
    node.style.color = "white";
    document.getElementById("preparedTeas").appendChild(node);
}

const checkEndOfTheDay = () => {
    let currentDay = new Date().getDay();
    let lastRecord = beverageData.dailyRecords.slice(-1);
    if (lastRecord.length != 0) {
        let tmpDate = new Date(lastRecord[0].preparedTime);
        if (currentDay > tmpDate.getDay()) {
            localStorage.clear();
            beverageData.dailyRecords = [];
        }
        else {
            idCounter = beverageData.dailyRecords.length + 1;
            processAllRecords();
        }
    }
}

const processAllRecords = () => {
    beverageData.dailyRecords.forEach(record => {
        let tmpDate = new Date(record.preparedTime);
        let h = tmpDate.getHours();
        let m = tmpDate.getMinutes();
        let s = tmpDate.getSeconds();
        var node = document.createElement("p");
        var textnode = document.createTextNode(h + ":" + m + ":" + s);
        node.appendChild(textnode);
        let lastIndex = findTheLast(record.type) + 1;
        if (record.Id != lastIndex) {
            node.style.textDecoration = "line-through";
        }
        node.id = record.Id;
        node.style.color = "white";
        if (record.type == BeverageTypeEnum.tea) {
            document.getElementById("preparedTeas").appendChild(node);
        }
        else if (record.type == BeverageTypeEnum.coffee) {
            document.getElementById("preparedCoffees").appendChild(node);
        }
        else if (record.type == BeverageTypeEnum.other) {
            var otherNameTextNode = document.createTextNode("-Name:"+record.otherName);
            node.appendChild(otherNameTextNode);
            document.getElementById("preparedOther").appendChild(node);
        }
    });
}

const findTheLast = (type) => {
    let lastIndex = beverageData.dailyRecords.map(t =>
        t.type == type).lastIndexOf(true);
    return lastIndex;
}

const addOther = () => {
    let lastIndex = findTheLast(3) + 1;
    if (lastIndex != 0) {
        var lastNode = document.getElementById(lastIndex);
        lastNode.style.textDecoration = "line-through";
    }
    var copy = Object.assign({}, dailyRecord);
    copy.otherName = document.getElementById("other").value;
    document.getElementById("other").value="";
    copy.preparedTime = new Date();
    copy.Id = idCounter;
    copy.type = BeverageTypeEnum.other;
    idCounter++;
    beverageData.dailyRecords.push(copy);
    setLocalStorage();
    let h =  copy.preparedTime .getHours();
    let m =  copy.preparedTime .getMinutes();
    let s =  copy.preparedTime .getSeconds();
    var node = document.createElement("p");
    var textnode = document.createTextNode(h + ":" + m + ":" + s+"-Name:"+copy.otherName);
    node.appendChild(textnode);
    node.id = beverageData.dailyRecords.length;
    node.style.color = "white";
    document.getElementById("preparedOther").appendChild(node);
}

getLocalStorage();
