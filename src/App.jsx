
import './App.css';
import {
	RouterProvider,
} from "react-router-dom";

import axios from 'axios';
import router from '@/router';
import urlConfig from '@/url';
import { LoginProvider } from '@/context/loginContext';
import { useState } from 'react';
import zhCN from 'antd/locale/zh_CN';
import { ConfigProvider } from 'antd';

axios.defaults.baseURL = urlConfig.baseurl;
function App() {
	const [locale, setLocal] = useState(zhCN);

	return (
		<>
			<ConfigProvider locale={locale}>
				<LoginProvider>
					<RouterProvider router={router} />
				</LoginProvider>
			</ConfigProvider>
		</>
	)
}

export default App
