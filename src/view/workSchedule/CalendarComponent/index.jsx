import dayjs from 'dayjs';
import styles from "./index.module.less";
import React from 'react';
import { Calendar, Menu } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { Lunar, HolidayUtil } from 'lunar-javascript';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);
function App() {
	//日历功能
	const [selectDate, setSelectDate] = React.useState(dayjs());
	const [contextmenu, setContextmenu] = React.useState();
	const [rangetime, setRangetime] = React.useState([dayjs(),dayjs()]);
	const [isMouseDown, setIsMouseDown] = React.useState(false);
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
						onMouseDown={()=>{
							let time=date.format();
							console.log("down",time);
							setRangetime([time,time]);
							setIsMouseDown(true);
						}}
						onMouseEnter={()=>{
							let time=date.format();
							console.log("enter",time);
							if (isMouseDown) {
								setRangetime([rangetime[0],time]);
							}
						}}
						onMouseUp={()=>{
							let time=date.format();
							console.log("up",time);
							setRangetime([rangetime[0],time]);
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
					hidden={!contextmenu}
					onClick={({ key, keyPath })=>{
						console.log({  key, keyPath });
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
							label: "设定为开始日期",
							key: 'startDay',
							icon: <MailOutlined />,
						},
						{
							label: "设定结束日期",
							key: 'endDay',
							icon: <MailOutlined />,
						}
					]}
				/>
			</div>
		</>
	);
}

export default App;
