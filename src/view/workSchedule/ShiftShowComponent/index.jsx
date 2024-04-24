import dayjs from 'dayjs';
import styles from "./index.module.less";
import React, { useState } from 'react';
import { Calendar, Menu, Segmented, Table } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import {useContextMenuStatus} from '@/hook/useContextMenuStatus'
import {useWorkSheduleDispatch,useWorkShedule} from '@/context/workSheduleContext';
import classNames from 'classnames';
import { Lunar, HolidayUtil } from 'lunar-javascript';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);
function App() {
	const workShedule = useWorkShedule();
	let dataSource= workShedule.people.data.map((people,index)=>{
		let list=[];
		for(let i=0;i<workShedule.day.input_num_days;i++) {
			let todayShiftList=workShedule.request.data[index+i]??[];
			let returndata="";
			for(let j=0;j<todayShiftList.length;j++) {
				if(todayShiftList[j]=="1"){
					returndata+=`${workShedule.shifts.data[i].name}\n`
				}
			}
			list.push(returndata);
		}
		return {
			name:people.name,
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
	const [optionsvalue, setOptionsvalue] = useState(options[0].value);
	let rangetime=workShedule.day.range;
	return (
		<>
			<Segmented
				options={options}
				onChange={setOptionsvalue}
			/>
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
