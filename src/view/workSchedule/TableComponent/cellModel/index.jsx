import { Button, List, Modal, Space } from 'antd';
import {useWorkShedule,useWorkSheduleDispatch} from '@/context/workSheduleContext';
import EditableText from "@/component/editableText";
import { PlusOutlined,DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
function App({data,onOk,...resprops}) {
	let workSchedule=useWorkShedule();
	let WorkSheduleDispatch=useWorkSheduleDispatch();
	let dependency=workSchedule.dependency[data.dataIndex]?.value;
	dependency??=[];
	let [list,setList]=useState(dependency);
	let getchildenode=()=>{
		switch (data.type) {
			case "list":
			case "select":{
				return (<Space
					direction='vertical'
					style={{
						width:"100%",
					}}
				>
					{list.map((v,i)=>{
						return (<EditableText key={i} text={v}
							onChange={(val)=>{
								let newlist=[...list];
								newlist[i]=val;
								setList(newlist);
							}}
							addicons={[
								{
									title: "删除",
									node: <DeleteOutlined
										onClick={()=>{
											let newlist=list.filter((val,ind)=>{
												return ind!==i;
											});
											setList(newlist);
										}}
									/>
								}
							]}
						/>)
					})}
					<Button
						type="dashed"
						onClick={() => {
							let newlist=[...list];
							newlist.push(null);
							setList(newlist);
						}}
						style={{
							width: '100%',
						}}
						icon={<PlusOutlined />}
					/>
				</Space>);
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
			<Modal
				title={data.title}
				onOk={(...args)=>{
					let newlist= Array.from(new Set(list)).filter((v)=>v===0||v);
					WorkSheduleDispatch({type:"setDependency",key:data.dataIndex,value:newlist});
					onOk(...args);
				}}
				{...resprops}
			>
				{getchildenode()}
			</Modal>
		</>
	);
}

export default App;
