import {
	createBrowserRouter,
  } from "react-router-dom";

import SearchIndex from '@/view/searchIndex'
import Login from '@/view/login'
import Upload from '@/view/upload'
import ErrorPage from '@/view/404'

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
	{
		path: "/upload",
		element: <Upload/>,
	},
]);
export default router;