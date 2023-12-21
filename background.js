//display welcome notification upon installation of extension
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") { // Check if the extension is newly installed
      chrome.notifications.create({
        type: "basic",
        iconUrl: chrome.runtime.getURL('images/128.png'),
        title: "Welcome!",
        message: "Pin DimeTime Saver and then click on the icon to get started.",
      });
    }
  });

//initialize dime_time_value and currency_input_value
let dime_time_value;
let currency_input_value;

// Listen for dime_time_value message from popup.js
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "dime_time_value") {
            console.log('received message containing dime_time_value from popup.js', request.dime_time_value)
            dime_time_value = parseFloat(request.dime_time_value);
            return true
        } else {
            console.log('message delivery for dime_time_value unsuccessful');
        }
    }
);

// Initialize dime_time_value if not set
chrome.storage.sync.get('dime_time_value', function(data) {
    if (!data.dime_time_value) {
        // If the dime_time_value is not stored, set a default of 3
        chrome.storage.sync.set({ 'dime_time_value': 20.00 });
    } else {
        //if the dime_time_value is stored, assign it to the variable
        dime_time_value = parseFloat(data.dime_time_value);
    }
});

// Listen for currency_input_value message from popup.js
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "currency_input_value") {
            console.log('received message containing currency_input_value from popup.js', request.currency_input_value)
            currency_input_value = request.currency_input_value;
            return true
        } else {
            console.log('message delivery for currency_input_value unsuccessful');
        }
    }
);

// Initialize currency_input_value value if not set
chrome.storage.sync.get('currency_input_value', function(data) {
    if (!data.currency_input_value) {
        // If the wage input value is not stored, set a default of $
        chrome.storage.sync.set({ 'currency_input_value': '$'});
    } else {
        //if the wage input value is stored, assign it to the variable
        currency_input_value = parseFloat(data.currency_input_value);
    }
});






// set default interval to 20 minutes
var interval_minutes = 20;

//convert seconds to milliseconds
var interval_milliseconds = interval_minutes * 60000;

// set the timer to start at zero
var time_zero = 0;
console.log("timer set")

//create function to reset timer
function reset_timer() {
    console.log("function to reset timer created");
    time_zero = Date.now();
}

//create function to check timer
function check_timer(initial_time) {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
        if (tabs.length == 0) {
            return;
        }
        var url = tabs[0].url;
        console.log("query active tab and retrieve url of active tab", url);
        //create target websites
        const target_websites = [
            "https://www.amazon.com",
            "https://www.walmart.com",
            "https://www.costco.com",
            "https://www.target.com",
            "https://www.instacart.com",
            "https://www.sayweee.com",
            "https://www.goodeggs.com",
            "https://www.doordash.com",
            "https://www.retailmenot.com",
            "https://www.groupon.com",
            "https://www.latimes.com/coupon-codes",
            "https://www.slickdeals.net",
            "https://www.coupons.com",
            "https://www.couponfollow.com",
            "https://www.couponcabin.com",
            "https://thekrazycouponlady.com",
            "https://www.dealsplus.com",
            "https://www.chewy.com",
            "https://www.petco.com",
            "https://www.petsmart.com"
        ];
        //initialize target_website variable
        var target_website = null;

        for (const target of target_websites) {
            console.log("checking if", url, "starts with", target);
            if (url.startsWith(target)) {
                console.log("Target website found:, proceed with timer", url);
                target_website = target;
                break;
            }
        }

        if (target_website && Date.now() >= initial_time + interval_milliseconds) {
            var notification = {
                type: "basic",
                iconUrl: chrome.runtime.getURL('images/128.png'),
                title: "Is this the best bang for your time?",
                message: `You've spent ${currency_input_value}${dime_time_value.toFixed(2)} (twenty minutes) looking for a cheap deal. Do you want to keep on comparison shopping?`,
                priority: 2
            };
            console.log("time and notification variables created");

            var notification_id = `notification_${target_website}`;

            chrome.notifications.create(notification_id, notification, function (notification_id) {
                if (chrome.runtime.lastError) {
                    console.error("Notification creation failed. Error details:", chrome.runtime.lastError);
                } else {
                    console.log("Notification created successfully");
                }
                // reset timer
                reset_timer();
                console.log("timer reset");
            });

        } else {
            console.log("Not a target website or not enough time elapsed, skipping timer");
        }

        //call check_timer again for continuous execution
        setTimeout(function () {
            check_timer(time_zero);
        }, 5 * 1000); //5 seconds in milliseconds
    });
}




//use a listener to detect a url change
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log("url change detected. the url is:", changeInfo.url)

    //check if changeinfo.url is defined
    if (changeInfo && changeInfo.url) {
        console.log("setting timeout to check timer");

        //add a slight delay before calling check_timer
        setTimeout(function () {
            console.log("actually checking the timer");
            //call check_timer to start continuous execution
            check_timer(time_zero)
            console.log("check_timer called")
            ;
        }, 10000);
    }
});











