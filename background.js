let dime_time_value;

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "dime_time_value") {
            console.log('received message containing dime_time_value from popup.js', request.dime_time_value)
            dime_time_value = parseFloat(request.dime_time_value);
            return true
        } else {
            console.log('message delivery unsuccessful');
        }
    }
);

// Initialize dime_time_value value if not set
chrome.storage.sync.get('dime_time_value', function(data) {
    if (!data.dime_time_value) {
        // If the wage input value is not stored, set a default of $3
        chrome.storage.sync.set({ 'dime_time_value': 3.00 });
    } else {
        //if the wage input value is stored, assign it to the variable
        dime_time_value = parseFloat(data.dime_time_value);
    }
});


// set default interval to 5 seconds
var interval_seconds = 5;

//convert seconds to milliseconds
var interval_minutes = interval_seconds / 60;

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
            "https://www.thekrazycouponlady.com",
            "https://www.dealsplus.com"
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

        if (target_website && Date.now() >= initial_time + interval_minutes * 60000) {
            var notification = {
                type: "basic",
                iconUrl: chrome.runtime.getURL('images/128.png'),
                title: "Is this the best bang for your time?",
                message: `You've spent $${dime_time_value.toFixed(2)} (twenty minutes) looking for a cheap deal. Do you want to keep on comparison shopping?`,
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
            check_timer(time_zero);
        }, 10000);
    }
});











