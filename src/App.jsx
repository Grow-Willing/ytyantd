
import './App.css'
import {
	RouterProvider,
} from "react-router-dom";

import axios from 'axios'
import router from '@/router'
import urlConfig from '@/url'

axios.defaults.baseURL=urlConfig.baseurl;
function App() {

	return (
		<>
			<RouterProvider router={router} />
		</>
	)
}

export default App
