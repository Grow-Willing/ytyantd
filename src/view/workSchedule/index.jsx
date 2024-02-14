import styles from "./index.module.less";
import { Radio, Segmented } from 'antd';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CalendarComponent from "./CalendarComponent";
import TableComponent from "./TableComponent";
import Navlist from '@/component/navlist';
import {WorkSheduleProvider,useWorkShedule} from '@/context/workSheduleContext'
function App() {
	const workShedule = useWorkShedule();
	const options = [
		{
			label: '人员设置',
			value: 'people',
		},
		{
			label: '班设置',
			value: 'shifts',
		},
		{
			label: '需求设置',
			value: 'require',
		},
		{
			label: '休息日设置',
			value: 'offdays',
		},
	];
	const [value, setValue] = useState(options[0].value);
	return (
		<>
			<div className={styles.blackContent}>
				<div className={styles.middle}>
					<Segmented
						options={options}
						onChange={setValue}
					/>
					{value==="people"&&<TableComponent tableName="people"/>}
					{value==="shifts"&&<TableComponent tableName="shifts"/>}
					{/* {value==="require"&&<TableComponent tableName="require"/>} */}
					{value==="offdays"&&<TableComponent tableName="offdays"/>}
					<CalendarComponent />
				</div>
				<Navlist classname={styles.navlist} />
			</div>
		</>
	);
}

function WithProvider() {
	return (
		<WorkSheduleProvider>
			<App/>
		</WorkSheduleProvider>
	)
}
export default WithProvider;
