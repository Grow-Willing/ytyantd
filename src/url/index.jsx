export default {
	baseurl: 'http://192.168.1.191:5000',
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
		method:"get"
	},
	uploaddone:{
		url:'/api/uploadfiledone',
		method:"get"
	}
}