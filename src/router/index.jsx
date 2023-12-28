import {
	createBrowserRouter,
  } from "react-router-dom";

import SearchIndex from '../components/searchIndex'
import Login from '../components/login'
import ErrorPage from '../components/404'

const router = createBrowserRouter([
	{
		path: "/",
		element: <SearchIndex/>,
		errorElement: <ErrorPage/>,
	},
	{
		path: "/login",
		element: <Login/>,
	},
	{
		path: "/account",
		element: <Login/>,
	},
]);
export default router;