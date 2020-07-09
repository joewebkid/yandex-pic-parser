let params = {
    'pages_list_class': 'a._93444fe79c--list-itemLink--3o7_6',
    'object_min_class': 'a.c6e8ba5398--header-link--3XZlV',
};
let objects = false;
let objectsForExport = [];
let tabId = false;
// let openUrl = false;
// let parsePagesList = {};
// let parseObjectsList = {};
// let typePageNow = false;

sendInfoToPopUp = (text) => {
    chrome.runtime.sendMessage(popUpId, {
        "type": "info",
        "message": text
    });
}

getPages = () => {
    sendInfoToPopUp("Получение картинок")
    openMainPage(params.main_page);
}

openMainPage = (url) => {
    chrome.tabs.create(
        {
            "url": url,
            'active': false
        },
        (tab) => {
            tabId = tab.id
            placeInInput()
        })
}

placeInInput = async () => {
    chrome.tabs.executeScript(tabId, {file: 'jquery-3.5.1.min.js'}, () => {
        chrome.tabs.executeScript(tabId, {file: 'content.js'}, () => {            
            sendMessageToContent()
        })
    })
}

sendMessageToContent = () => {
    if(objects.length > 0) {
        obj = objects.pop()
        chrome.tabs.sendMessage(tabId, {
            "event": "place_in_input",
            "params": obj
        })//, sendMessageToContent()
    }
}

// function closePage() {
//     chrome.tabs.remove(pageParseId, function (tab) {
//         sendInfoToPopUp("Страница " + openUrl + " закрыта");
//         openUrl = false;
//     });
// }

// function parsePageForPagesList(pageId) {
//     typePageNow = 'pageForPagesList';
//     chrome.tabs.sendMessage(pageId, {
//         "event": "get_pages_list",
//         "params": params
//     });
// }

// function startParseObjectsFromPages() {
//     for (var i in parsePagesList) {
//         if (parsePagesList[i] === false) {
//             console.log(i);
//             openNewPage(i);
//             break;
//             //parsePageForObjectsList(pageParseId);
//             //closePage(pageParseId);
//         }
//     }
// }

// function parsePageForObjectsList(pageId) {
//     chrome.tabs.sendMessage(pageId, {
//         "event": "get_objects_list",
//         "params": params
//     });
// }

// function fromContentOpenPage(data){
//     sendInfoToPopUp("Открыта страница " + data.url);

//     if (typePageNow === 'pageForPagesList') {
//         parsePageForPagesList(pageParseId);
//     } else if (typePageNow === 'objectsListFromPagesList') {

//     }
// }

// function fromContentPagesList(data, sender){
//     var pages_list = data.list;
//     var URLNumbers = 0;

//     for (var i in pages_list) {
//         if (parsePagesList[pages_list[i]] == undefined) {
//             parsePagesList[pages_list[i]] = false;
//             var url = pages_list[i];

//             if (url.length > 40) {
//                 url = url.substr(0, 40) + '...';
//                 URLNumbers++;
//             }
//             // sendInfoToPopUp("Добавлена страница для парсинга: <a href='" + pages_list[i] + "' target='_blank'>" + url + "</a>");
//         }
//     }

//     sendInfoToPopUp("Найдено страниц с объектами: " + URLNumbers);

//     typePageNow = 'objectsListFromPagesList';

//     // startParseObjectsFromPages();

// }

// function fromContentObjectsList(data, sender){
//     var pages_list = data.list;
//     var URLNumbers = 0;

//     for (var i in pages_list) {
//         if (parseObjectsList[pages_list[i]] == undefined) {
//             parseObjectsList[pages_list[i]] = false;
//             var url = pages_list[i];

//             if (url.length > 40) {
//                 url = url.substr(0, 40) + '...';
//                 URLNumbers++;
//             }
//             // sendInfoToPopUp("Добавлена страница для парсинга: <a href='" + pages_list[i] + "' target='_blank'>" + url + "</a>");
//         }
//     }

//     sendInfoToPopUp("Найдено объектов на странице: " + URLNumbers);
// }

setParams = (data, sender) => {
    popUpId = sender.id;
    params.main_page = data.main_page;
    try {
        if(!objects)
        objects = JSON.parse(data.objects)
        sendInfoToPopUp("Количество объектов для обработки: " + Object.keys(objects).length);
        getPages();

    }catch(e) {
        sendInfoToPopUp("Ошибка:" + JSON.stringify(e))
    }
}

saveAsFile = (jsonData, name) => {
    _object = JSON.stringify(jsonData , null, 4)

    vLink = document.createElement('a'),
    vBlob = new Blob([_object], {type: "octet/stream"}),
    vName = name+'.json',

    vUrl = window.URL.createObjectURL(vBlob)
    vLink.setAttribute('href', vUrl)
    vLink.setAttribute('download', vName )
    vLink.click()
    new Notification("Успешно загружено")
}

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {

        let data = request.data;
        let type = request.type;

        if (type === "set_params") {
            setParams(data, sender);
        } else if (type === "from_content") {
            objectsForExport.push(data)

            if(objects.length > 0)
                sendMessageToContent()
            else
                saveAsFile(objectsForExport,'objects-all')


            if(objectsForExport.length == 500){
                new Notification("Успешно загружено - 500")
                saveAsFile(objectsForExport,'objects-500')
            }
            if(objectsForExport.length == 50){
                new Notification("Успешно загружено - 50")
                saveAsFile(objectsForExport,'objects-50')
            }
            if(objectsForExport.length == 100){
                new Notification("Успешно загружено - 100")
                saveAsFile(objectsForExport,'objects-100')
            }
            if(objectsForExport.length == 200){
                new Notification("Успешно загружено - 200")
                saveAsFile(objectsForExport,'objects-200')
            }
            if(objectsForExport.length == 10){
                new Notification("Успешно загружено - 10")
                saveAsFile(objectsForExport,'objects-10')
            }


            // alert(data)
            // fromContentPage({'key':'value'})
            // pageParseId = sender.tab.id;
            // if (data.type === "open_page") {
            //     fromContentOpenPage(data, sender);
            // } else if (data.type === "pages_list") {
            //     fromContentPagesList(data, sender);
            // } else if (data.type === "objects_list") {
            //     fromContentObjectsList(data, sender);
            // }
        }
    }
);