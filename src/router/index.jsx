import {
	createBrowserRouter,
  } from "react-router-dom";

import SearchIndex from '../components/searchIndex'
import Login from '../components/login'

const router = createBrowserRouter([
	{
		path: "/",
		element: <SearchIndex/>,
	},
	{
		path: "/login",
		element: <Login/>,
		errorElement: <div>not find</div>,
	},
]);
export default router;