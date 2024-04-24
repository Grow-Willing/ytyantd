export default {
	baseurl: 'http://172.16.3.34',
	login:{
		url:'/api/login',
		method:"post"
	},
	register:{
		url: '/api/register',
		method:"post"
	},
	uploadfile:{
		url: '/api/uploadfile',
		method:"post"
	},
	uploaddone:{
		url:'/api/uploadfile',
		method:"get"
	},
	getschedule:{
		url: '/api/schedule',
		method:"post"
	},
}