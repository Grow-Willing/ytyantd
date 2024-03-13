import styles from "./index.module.less";
import { Radio, Segmented } from 'antd';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CalendarComponent from "./CalendarComponent";
import TableComponent from "./TableComponent";
import DateComponent from "./dateComponent";
import RelativeSetting from "./relativeSetting";
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
			label: '日期和需求',
			value: 'require',
		},
		{
			label: '相关设置',
			value: 'relative',
		},
	];
	const [value, setValue] = useState(options[0].value);
	return (
		<>
			<div className={styles.blackContent}>
				<div className={styles.middle}>
					<div>
						<Segmented
							options={options}
							onChange={setValue}
						/>
					</div>
					{value==="people"&&<TableComponent tableName="people"/>}
					{value==="shifts"&&<TableComponent tableName="shifts"/>}
					{value==="require"&&(
						<>
							<DateComponent/>
							<CalendarComponent />
						</>
					)}
					{value==="relative"&&<RelativeSetting/>}
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
