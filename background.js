// set initial values upon installation
chrome.runtime.onInstalled.addListener(function(){
    chrome.storage.sync.set({interval: 0.1, on: 1});
    console.log("initial values set");
});

//retrieve stored intervals
interval_minutes = chrome.storage.sync.get('interval', function(data) {
    console.log("set interval for first time", data.interval);
    return data.interval;
});
// set the timer
var time_zero = 0;
console.log("timer set")

//create function to reset timer
function reset_timer(){
    console.log("function to reset timer created");
    time_zero = Date.now();
}

//create function to check timer
function check_timer(initial_time, lapsed_time) {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        var url = tabs[0].url;
        console.log("query active tab and retrieve url of active tab");
        //create target websites
        const target_websites = [
            "https://amazon.com/*",
            "https://walmart.com/*",
            "https://costco.com/*",
            "https://target.com/*",
            "https://instacart.com/*",
            "https://sayweee.com/*",
            "https://www.goodeggs.com/*",
            "https://doordash.com/*",
            "https://retailmenot.com/*",
            "https://groupon.com/*",
            "https://www.latimes.com/coupon-codes/*",
            "https://slickdeals.net/*",
            "https://coupons.com/*",
            "https://couponfollow.com/*",
            "https://couponcabin.com/*",
            "https://thekrazycouponlady.com/*",
            "https://dealsplus.com/*"
        ];
        //initialize target_website variable
        var target_website = null; 

        for (const target of target_websites) {
            if (url.match(new RegExp(target_website))) {
                console.log("Target website found:, proceed with timer", url);
                target_website = target;
                break;
            }
        }

        if (!target_website) {
            console.log("Not a target website, skipping timer")
        }
    
        if ((initial_time + lapsed_time) < Date.now()) {
            var time = new Date()
            var notification = {
                type: "basic",
                title: "Is this the best bang for your time?",
                message: "You've spent $2.67 (twenty minutes) looking for a cheap deal. Do you want to keep on comparison shopping?",
                iconUrl: "128.png"
            };
            chrome.notifications.create("notification_id", notification, function(notification_id) {})
            console.log("create notification id")
            //reset timer
            reset_timer();
            console.log("timer reset");
    
            //clear notification after 30 seconds
            setTimeout(function() {
                chrome.notifications.clear("notification");
            }, 30000);
        }
        //call check_timer again for continuous execution
        setTimeout(function() {
            check_timer(time_zero,data.interval * 60000);
        }, 20 * 60 * 1000); //20 minutes in seconds
    });
}

//use a listener to detect a url change
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
console.log("url change detected")
    if (changeInfo.url) {
        //call check_timer to start continuous execution
        check_timer(time_zero, 0);
    }
});












