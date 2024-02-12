import styles from "./index.module.less";
import { Radio } from 'antd';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CalendarComponent from "./CalendarComponent";
import TableComponent from "./TableComponent";
import Navlist from '@/component/navlist';
function App() {
	const navigate = useNavigate();
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
	};
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
					<TableComponent/>
					<CalendarComponent />
				</div>
				<Navlist classname={styles.navlist} />
			</div>
		</>
	);
}

export default App;
