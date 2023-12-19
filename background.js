// set initial values upon installation
chrome.runtime.onInstalled.addListener(function(){
    chrome.storage.sync.set({interval: 0.1, on: 1});
    console.log("initial values set");
});

//retrieve stored intervals and start timer
chrome.storage.sync.get('interval', function (data){
    console.log("set interval for first time", data.interval);
    interval_minutes = data.interval;
    check_timer(time_zero, interval_minutes * 60000);
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
            console.log("checking if", url, "starts with", target)
            if (url.startsWith(target)) {
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
                iconUrl: "128.png",
                title: "Is this the best bang for your time?",
                message: "You've spent $2.67 (twenty minutes) looking for a cheap deal. Do you want to keep on comparison shopping?",
                priority: 2
            };
            console.log("time and notification variables created")
            chrome.notifications.create("notification_id", notification, function(notification_id) {})
            console.log("create notification id")
            //reset timer
            reset_timer();
            console.log("timer reset");
    
            //clear notification after 30 seconds
            //setTimeout(function() {
            //    chrome.notifications.clear("notification_id");
            //}, 30000);
        }
        //call check_timer again for continuous execution
        setTimeout(function() {
            check_timer(time_zero,data.interval * 60000);
        }, 5); //5 seconds in seconds
    });
}

//use a listener to detect a url change
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log("url change detected. the url is:", changeInfo.url)
    if (changeInfo.url) {
        console.log("changeInfo.url is true")
        //call check_timer to start continuous execution
        check_timer(time_zero, 0);
    }
});












