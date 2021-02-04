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

            // if(objects.length > 0)
            //     // sendMessageToContent()
            // else
            //     saveAsFile(objectsForExport,'objects-all')


            // if(objectsForExport.length == 500){
            //     new Notification("Успешно загружено - 500")
            //     saveAsFile(objectsForExport,'objects-500')
            // }
            // if(objectsForExport.length == 50){
            //     new Notification("Успешно загружено - 50")
            //     saveAsFile(objectsForExport,'objects-50')
            // }
            // if(objectsForExport.length == 100){
            //     new Notification("Успешно загружено - 100")
            //     saveAsFile(objectsForExport,'objects-100')
            // }
            // if(objectsForExport.length == 200){
            //     new Notification("Успешно загружено - 200")
            //     saveAsFile(objectsForExport,'objects-200')
            // }
            // if(objectsForExport.length == 10){
            //     new Notification("Успешно загружено - 10")
            //     saveAsFile(objectsForExport,'objects-10')
            // }


            $.ajax({
              url: "https://x-case.ru/api/json/import/",
              type: "POST",
              data: data,
              context: document.body
            }).done(function(data) {
                if(data!='') {
                    if(objects.length > 0)
                        sendMessageToContent()
                    else
                        saveAsFile(objectsForExport,'objects-all')
                }
            })

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