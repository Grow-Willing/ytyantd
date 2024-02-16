import styles from "./index.module.less";
import { Flex, Space } from 'antd';
import { useState } from "react";
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
		{
			label: '关联设置',
			value: 'relations',
		},
	];
	const [value, setValue] = useState(options[0].value);
	return (
		<>
			<Space direction="vertical">
				<div>
                    111
				</div>
				<div>
                    111
				</div>
				<div>
                    111
				</div>
			</Space>
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
