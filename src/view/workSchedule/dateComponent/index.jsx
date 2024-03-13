import { Button, DatePicker, Input, Space, Tooltip } from 'antd';
import { useState } from "react";
import { useWorkSheduleDispatch, useWorkShedule } from '@/context/workSheduleContext'
import { createFromIconfontCN} from "@ant-design/icons";
const MyIcon = createFromIconfontCN({
	scriptUrl: "/iconfont.js",
});
function App() {
	const workShedule = useWorkShedule();
	let range = workShedule.day.range,
		WorkSheduleDispatch=useWorkSheduleDispatch();;
	return (
		<>
			<Space.Compact>
				<DatePicker.RangePicker
					style={{
						width: '70%',
					}}
					value={range}
					onChange={(dates)=>{
						WorkSheduleDispatch({type: 'setday',data:dates});
					}}
				/>
				<Input
					size='small'
					disabled
					style={{
						width: '15%',
					}}
					value={`共 ${workShedule.day.input_num_days} 天`}
				/>
				<Tooltip placement="top" title="生成班表">
					<Button 
						icon={<MyIcon type="icon-paibanguanli" />}
					/>
				</Tooltip>
			</Space.Compact>
		</>
	);
}

function WithProvider() {
	return (
		<App />
	)
}
export default WithProvider;
