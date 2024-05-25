import dayjs from 'dayjs';
import styles from "./index.module.less";
import React, { useState } from 'react';
import { Segmented, Table } from 'antd';
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import {useWorkSheduleDispatch,useWorkShedule} from '@/context/workSheduleContext';

import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);
function App() {
	const workShedule = useWorkShedule();
	let dataSource= workShedule.people.data.map((people,index)=>{
		let list=[];
		let peopleCounts=workShedule.people.data.length;
		let num_days=workShedule.tmp.num_days??0;
		for(let i=0;i<workShedule.day.input_num_days;i++) {
			let todayShiftList=workShedule.request.data[index*num_days+i%num_days]??[];
			let returndata="";
			for(let j=0;j<todayShiftList.length;j++) {
				if(todayShiftList[j]=="1"){
					returndata+=`${workShedule.shifts.data[j].name}\n`
				}
			}
			if(returndata==""){
				returndata+="休";
			}
			list.push(returndata);
		}
		return {
			name:people.name,
			key:index,
			...list
		}
	});
	let columns=Array.from({length: workShedule.day.input_num_days}, (val, i) =>{
		return {
			dataIndex: i,
			title: i+1,
		}
	})
	columns.splice(0, 0, {
		dataIndex:"name",
		title:"姓名",
		fixed:"left"
	});
	const options = [
		{
			label: '列表模式',
			value: 'list',
			icon: <BarsOutlined />,
		},
		{
			label: '表格模式',
			value: 'table',
			icon: <AppstoreOutlined />,
		},
	];
	const [optionsvalue, setOptionsvalue] = useState(options[0].value);
	return (
		<>
			{/* <Segmented
				options={options}
				onChange={setOptionsvalue}
			/> */}
			<Table
				columns={columns}
				dataSource={dataSource}
				scroll={{
					x: true,
				}}
			/>
		</>
	);
}

export default App;
