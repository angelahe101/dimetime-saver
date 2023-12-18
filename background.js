// set initial values upon installation
chrome.runtime.onInstalled.addListener(function(){
    chrome.storage.sync.set({interval: 20, on: 1});
});

// set the timer
var time_zero = 0;

//create function to reset timer
function reset_timer(){
    time_zero = Date.now();
}

//create function to check timer
function check_timer(initial_time, lapsed_time)
    if ((initial_time + lapsed_time) < Date.now()) {
        var time = new Date()
        var notification = {
            type: "basic"
            title: "Is this the best bang for your time?"
            message: "You've spent $2.67 (twenty minutes) looking for a cheap deal. Do you want to keep on comparison shopping?"
        };

     chrome.notifications.create("Is this the best bang for your time?");
     console.log("timer reset");
     reset_timer();
    
     //clear notification after 30 seconds
     settime(function() {
        chrome.notifications.clear("Is this the best bang for your time?");
     }, 30000);
    }

//reset the timer when chrome restarts
chrome.runtime.onStartup.addListener(reset_timer);





