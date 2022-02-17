(function() {

    'use strict';

    const request_url = 'https://vpn01.atosworldline.be:11011/xenturion/images/silk_icons/computer.png?n=';
    const request_timeout = 3000;
    const states = {
        active: {
            color: '#080',
            badge_text: '\u2714',
            title: 'It seems that everything is working fine!',
        },
        inactive: {
            color: '#888',
            badge_text: ' ',
            title: 'Inactive',
        },
        interrupt: {
            color: '#f80',
            badge_text: '\u2716',
            title: 'Last request failed.',
        },
    };
    var is_active = true;


    var request_to_url = function() {
        if (!is_active) {
            return;
        }
        var n = parseInt(Math.random() * 1e16);
        var url = request_url + n;
		
		
		
		fetch(url, {mode: 'no-cors'})
			.then(response => {
				if (!response.ok) {
					set_state( 'interrupt');									
					throw new Error('Network response was not OK');
				}
				set_state( 'active' );				
				return response.blob();
			})		
			.then(result => {
			  console.log('Success:', result);
			})			
			.catch(error => {
			  console.log('Error:', error);
			  set_state('interrupt');			  
			});		
    };


    var toggle_activity = function() {
        is_active = !is_active;
        set_state(is_active ? 'active' : 'inactive');
        if (is_active) {
            request_to_url();
        }
    };


    var set_state = function(state_name) {
        var state = states[state_name];
        chrome.action.setBadgeText({text: state.badge_text});
        chrome.action.setBadgeBackgroundColor({color: state.color});
        chrome.action.setTitle({title: 'Xenturion Keep-Alive\n' + state.title});
    };
	
	chrome.runtime.onInstalled.addListener(() => {
		chrome.alarms.get('periodic', a => {
			if (!a) chrome.alarms.create('periodic', { periodInMinutes: 0.25 });
		});
	  
		set_state('inactive');	  
	});


	chrome.alarms.onAlarm.addListener(() => {
		request_to_url();
	});	

	chrome.action.onClicked.addListener(toggle_activity);	

})();
