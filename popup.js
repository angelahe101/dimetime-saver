//WAGE INPUT
//retrieve the stored wage input if available
chrome.storage.sync.get('wage_input_value', function (data) {
    if (data.wage_input_value) {
        //if a value is stored, set it in the input field
        wage_input.value = data.wage_input_value;
    }
});

//retrieve references to HTML elements
//let wage_input = document.getElementById('wage_input');
//let wage_input_button = document.getElementById('wage_input_button');

//retrieve reference to background.js
//let bkgd = chrome.extension.getBackgroundPage();

wage_input_button.onclick = function () {
    // retrieve the value from the input field
    let wage_input_value = parseFloat(wage_input.value);

    //check if the input is a valid number
    if (!isNaN(wage_input_value)) {
        //store wage_input_value in Chrome Storage
        chrome.storage.sync.set({ 'wage_input_value': wage_input_value });

        //divide wage_input_value by 3 (conversion rate), then divide by 60 (minutes) and multiply by 20 (minutes)
        let dime_time_value = (wage_input_value / 3) / 60 * 20;
        console.log('dime_time_value', dime_time_value);
        //send a message to background.js with wage_input_value
        chrome.runtime.sendMessage({
            message: "dime_time_value",
            dime_time_value: dime_time_value},
            function (response) {
                console.log(response);
            });

    } else {
        console.log('Not a valid number.');
    }
        
};

//CURRENCY INPUT
//retrieve the stored currency input if available
chrome.storage.sync.get('currency_input_value', function (data) {
    if (data.currency_input_value) {
        //if a value is stored, set it in the input field
        currency_input.value = data.currency_input_value;
    }
});

//retrieve references to HTML elements
//let currency_input = document.getElementById('currency_input');
//let currency_input_button = document.getElementById('currency_input_button');

//retrieve reference to background.js
//let bkgd = chrome.extension.getBackgroundPage();

currency_input_button.onclick = function () {
    // retrieve the value from the input field
    let currency_input_value = currency_input.value;

    //check if the input is *not* a number
    if (isNaN(currency_input_value)) {
        //store currency_input_value in Chrome Storage
        chrome.storage.sync.set({'currency_input_value': currency_input_value});

        //send a message to background.js with currency_input_value
        chrome.runtime.sendMessage({
            message: "currency_input_value",
            currency_input_value: currency_input_value},
            function (response) {
                console.log(response);
            });

    } else {
        console.log('Not a valid currency symbol.');
    }
        
};
