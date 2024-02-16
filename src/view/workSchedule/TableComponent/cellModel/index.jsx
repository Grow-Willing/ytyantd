import { List, Modal } from 'antd';
import {useWorkShedule} from '@/context/workSheduleContext';

function App({data,...resprops}) {
	let workSchedule=useWorkShedule();
	let getchildenode=()=>{
		switch (data.type) {
			case "list":
			case "select":{
				let dependency=workSchedule.dependency[data.dataIndex];
				dependency??=[];
				return (<List
					itemLayout="horizontal"
					dataSource={dependency}
					renderItem={(item, index) => (
						<List.Item>
							{item}
						</List.Item>
					)}
				/>);
			}
			// case "number":{
			// 	return <InputNumber
			// 		min={data.min??0}
			// 		max={data.max}
			// 		value={text}
			// 		onChange={(value)=>{
			// 			if(value??false)handleSave(record.key,data.dataIndex,value);
			// 		}}
			// 		changeOnWheel
			// 	/>;
			// }
			default:{
				let dependency=workSchedule.dependency[data.dataIndex];
				return <div>{JSON.stringify(dependency)}</div>
			}
		}
	}
	return (
		<>
			<Modal title={data.title} {...resprops}>
				{getchildenode()}
			</Modal>
		</>
	);
}

export default App;
