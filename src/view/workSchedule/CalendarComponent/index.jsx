import dayjs from 'dayjs';
import styles from "./index.module.less";
import React, { useState } from 'react';
import { Calendar, Form, Menu, Modal, Select } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import {useContextMenuStatus} from '@/hook/useContextMenuStatus'
import {useWorkSheduleDispatch,useWorkShedule} from '@/context/workSheduleContext';
import classNames from 'classnames';
import { Lunar, HolidayUtil } from 'lunar-javascript';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);
function App() {
	//日历功能
	const [selectDate, setSelectDate] = useState(dayjs());
	const [contextmenu, setContextmenu] = useState();
	const [isMouseDown, setIsMouseDown] = useState(false);
	let isContextMenuOpen=useContextMenuStatus(()=>{setContextmenu(null)});
	const workShedule = useWorkShedule();
	let rangetime=workShedule.day.range;
	let WorkSheduleDispatch=useWorkSheduleDispatch();
	let setTime=(time)=>{
		if(time[1].isBefore(time[0])){
			WorkSheduleDispatch({type: 'setday',data:[time[1],time[0]]});
		}else{
			WorkSheduleDispatch({type: 'setday',data:time});
		}
	}
	const [isModalOpen, setIsModalOpen] = useState(false);
	let defaultmodalData={
		title:"人员需求设置",
		who:null,
		do:null,
		what:null,
		time:null,
	};
	const [modalData, setModalData] = useState(defaultmodalData);
	let peoplelist = workShedule.people.data.map((v,i)=>{
		return {
			value:i,
			label:v.name
		}
	});
	let shiftlist = workShedule.shifts.data.map((v,i)=>{
		return {
			value:i,
			label:v.name
		}
	});
	const [form] = Form.useForm();
	let openRequireModel=(time)=>{
		setIsModalOpen(true);
		let nextdata={...modalData};
		nextdata.time = time;
		setModalData(nextdata);
	}
	let setRequire=()=>{
		console.log(modalData.time.diff(workShedule.day.range[0],"day"));
		WorkSheduleDispatch({
			type:"setRequire",
			payload:{
				n:modalData.who,
				s:modalData.what,
				d:modalData.time.diff(workShedule.day.range[0],"day"),
				v:modalData.do
			}
		});
		setIsModalOpen(false);
		setModalData(defaultmodalData);
	}
	let cellRender = (date, info) => {
		const d = Lunar.fromDate(date.toDate());
		const lunar = d.getDayInChinese();
		const solarTerm = d.getJieQi();
		const h = HolidayUtil.getHoliday(date.get('year'), date.get('month') + 1, date.get('date'));
		const displayHoliday = h?.getTarget() === h?.getDay() ? h?.getName() : undefined;
		if (info.type === 'date') {
			return React.cloneElement(info.originNode, {
				...info.originNode.props,
				className: classNames(styles.dateCell, {
					[styles.today]: date.isSame(dayjs(), 'date'),
					[styles.selected]: date.isBetween(rangetime[0], rangetime[1],"day","[]"),
				}),
				children: (
					<div className={styles.text}
						onMouseDown={(e)=>{
							if(e.button == 0&&!isMouseDown){
								let time=date.format();
								console.log("down",time);
								setTime([date,date]);
								setIsMouseDown(true);
							}
						}}
						onMouseEnter={()=>{
							let time=date.format();
							console.log("enter",time);
							if (isMouseDown) {
								setTime([rangetime[0],date]);
							}
						}}
						onMouseUp={()=>{
							let time=date.format();
							console.log("up",time);
							if (isMouseDown) {
								setTime([rangetime[0],date]);
							}
							setIsMouseDown(false);
						}}
						onContextMenu={(e)=>{
							let menudata={
								mouse:{
									clientX:e.clientX,
									clientY:e.clientY,
								},
								date
							}
							setContextmenu(menudata);
							e.preventDefault();
						}}
					>
						{date.get('date')}
						{info.type === 'date' && (
							<div className={styles.lunar}>{displayHoliday || solarTerm || lunar}</div>
						)}
					</div>
				),
			});
		}
		if (info.type === 'month') {
			// Due to the fact that a solar month is part of the lunar month X and part of the lunar month X+1,
			// when rendering a month, always take X as the lunar month of the month
			const d2 = Lunar.fromDate(new Date(date.get('year'), date.get('month')));
			const month = d2.getMonthInChinese();
			return (
				<div
					className={classNames(styles.monthCell, {
						[styles.monthCellCurrent]: selectDate.isSame(date, 'month'),
					})}
				>
					{date.get('month') + 1}月（{month}月）
				</div>
			);
		}
	};
	const onDateChange = (value, selectInfo) => {
		if (selectInfo.source === 'date' || selectInfo.source === 'month') {
			setSelectDate(value);
		}
	};
	return (
		<>
			<div style={{
				margin: "5px",
				border: "1px solid rgb(217, 217, 217)",
				borderRadius: "8px"
			}}>
				<Calendar fullCellRender={cellRender} fullscreen={false} onSelect={onDateChange} />
				<Menu
					hidden={!contextmenu||!isContextMenuOpen}
					onClick={({ key, keyPath,domEvent:e })=>{
						console.log({  key, keyPath,e },contextmenu.date);
						switch (key) {
							case "startSetStartDay":{
								// let time=contextmenu.date.format();
								setTime([contextmenu.date,contextmenu.date]);
								setIsMouseDown(true);
								break;
							}
							case "startDay":{
								// let time=contextmenu.date.format();
								setTime([contextmenu.date,rangetime[1]]);
								break;
							}
							case "endDay":{
								// let time=contextmenu.date.format();
								setTime([rangetime[0],contextmenu.date]);
								setIsMouseDown(false);
								break;
							}
							case "setrequire":{
								// let time=contextmenu.date.format();
								openRequireModel(contextmenu.date);
								break;
							}
							default:
								break;
						}
						e.stopPropagation();
						setContextmenu(null);
					}}
					onBlur={()=>{
						setContextmenu(null);
					}}
					style={{
						position:"fixed",
						zIndex:1,
						width:"200px",
						left:contextmenu?.mouse?.clientX??0,
						top:contextmenu?.mouse?.clientY??0,
						boxShadow:"rgba(0, 0, 0, 0.15) 0px 2px 15px 5px",
						borderRadius:"5px"
					}}
					selectable={false}
					mode="vertical"
					items={[
						{
							label: "从这里开始选择",
							key: 'startSetStartDay',
							icon: <MailOutlined />,
						},
						{
							label: "设定为开始日期",
							key: 'startDay',
							icon: <MailOutlined />,
						},
						{
							label: "设定为结束日期",
							key: 'endDay',
							icon: <MailOutlined />,
						},
						{
							label: "设置需求",
							key: 'setrequire',
							icon: <MailOutlined />,
						},
					]}
				/>
				<Modal
					title={modalData.title}
					centered
					open={isModalOpen}
					onOk={setRequire}
					onCancel={()=>setIsModalOpen(false)}
				>
					<Form
						form={form}
					>
						<Form.Item
							name="n"
							label="需求人"
						>
							<Select
								placeholder="需求人"
								value={modalData.who}
								onChange={(value)=>{
									let newdata={...modalData};
									newdata.who=value;
									setModalData(newdata);
								}}
								options={peoplelist}
							/>
						</Form.Item>
						<Form.Item
							name="v"
							label="必须/不能上某个班"
						>
							<Select
								placeholder="必须/不能上某个班"
								value={modalData.do}
								onChange={(value)=>{
									let newdata={...modalData};
									newdata.do=value;
									setModalData(newdata);
								}}
								options={[
									{
										value: 0,
										label: '不能上',
									},
									{
										value: 1,
										label: '必须上',
									},
								]}
							/>
						</Form.Item>
						<Form.Item
							name="s"
							label="？班"
						>
							<Select
								placeholder="？班"
								value={modalData.what}
								onChange={(value)=>{
									let newdata={...modalData};
									newdata.what=value;
									setModalData(newdata);
								}}
								options={shiftlist}
							/>
						</Form.Item>
					</Form>
				</Modal>
			</div>
		</>
	);
}

export default App;
