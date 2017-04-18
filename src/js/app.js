window.Vue = require('vue');


var data = {
	key: 'value',
	method(){
		return 'worked';
	}
}

var vm = new Vue({
	el: '#app',
})