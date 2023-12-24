
import './App.css'
import {
	RouterProvider,
  } from "react-router-dom";

import router from './router'
import axios from 'axios'
import urlConfig from './url'

axios.defaults.baseURL=urlConfig.baseurl;
function App() {

  return (
    <>
		<RouterProvider router={router} />
    </>
  )
}

export default App
