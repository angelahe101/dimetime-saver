// set initial values upon installation
chrome.runtime.onInstalled.addListener(function(){
    chrome.storage.sync.set({interval: 0.25, on: 1});
});

// set the timer
var time_zero = 0;

//create function to reset timer
function reset_timer(){
    time_zero = Date.now();
}

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

//create function to check timer
function check_timer(initial_time, lapsed_time)
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs)){
        var url = tabs[0].url;
        for (const target_website of target_websites) {
            if (url.match(new RegExp(target_website))) {
                console.log("Target website found:, proceed with timer", url);
            break
            }
        }
        if (!target_website) {
            console.log("Not a target website, skipping timer")
        }
    }
    if ((initial_time + lapsed_time) < Date.now()) {
        var time = new Date()
        var notification = {
            type: "basic",
            title: "Is this the best bang for your time?",
            message: "You've spent $2.67 (twenty minutes) looking for a cheap deal. Do you want to keep on comparison shopping?"
        };

     chrome.notifications.create("Is this the best bang for your time?");
     console.log("timer reset");
     reset_timer();
    
     //clear notification after 30 seconds
     setTimeout(function() {
        chrome.notifications.clear("Is this the best bang for your time?");
     }, 30000);
    }

//reset the timer when chrome restarts
chrome.runtime.onStartup.addListener(reset_timer);









