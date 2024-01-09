
import './App.css'
import {
	RouterProvider,
} from "react-router-dom";

import axios from 'axios'
import router from '@/router'
import urlConfig from '@/url'
import { LoginProvider } from '@/context/loginContext'

axios.defaults.baseURL = urlConfig.baseurl;
function App() {

	return (
		<>
			<LoginProvider>
				<RouterProvider router={router} />
			</LoginProvider>
		</>
	)
}

export default App
