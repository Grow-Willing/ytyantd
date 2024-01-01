import styles from "./index.module.less";
import { Radio } from 'antd';
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import urlconfig from "@/url/index";
import Navlist from '@/component/navlist';
function App() {
	const navigate = useNavigate();

	let { url, method } = urlconfig.upload;
	const options = [
		{
			label: '按次排班',
			value: 'count',
		},
		{
			label: '按天排班',
			value: 'day',
		},
		{
			label: '按月排班',
			value: 'month',
		},
	];
	const [value, setValue] = useState(options[0].value);
	let onChange = (e) => {
		setValue(e.target.value);
	}
	return (
		<>
			<div className={styles.blackContent}>
				<div className={styles.middle}>
					<Radio.Group
						options={options}
						onChange={onChange}
						value={value}
						optionType="button"
						buttonStyle="solid"
					/>
				</div>
				<Navlist classname={styles.navlist} />
			</div>
		</>
	);
}

export default App;
