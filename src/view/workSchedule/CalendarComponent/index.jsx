import dayjs from 'dayjs';
import styles from "./index.module.less";
import React from 'react';
import { Calendar } from 'antd';
import classNames from 'classnames';
import { Lunar, HolidayUtil } from 'lunar-javascript';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);
function App() {
	//日历功能
	const [selectDate, setSelectDate] = React.useState(dayjs());
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
					[styles.current]: selectDate.isSame(date, 'date'),
					[styles.today]: date.isSame(dayjs(), 'date'),
					[styles.selected]: date.isBetween(rangetime[0], rangetime[1],null,"[]"),
				}),
				children: (
					<div className={styles.text}
						onMouseDown={()=>{
							let time=`${date.get('year')}-${date.get('month')+1}-${date.get('date')}`
							console.log("down",time);
							setRangetime([time,rangetime[1]]);
							setIsMouseDown(true);
						}}
						onMouseEnter={()=>{
							let time=`${date.get('year')}-${date.get('month')+1}-${date.get('date')}`
							console.log("enter",time);
							if (isMouseDown) {
								setRangetime([rangetime[0],time]);
							}
						}}
						onMouseUp={()=>{
							let time=`${date.get('year')}-${date.get('month')+1}-${date.get('date')}`
							console.log("up",time);
							setRangetime([rangetime[0],time]);
							setIsMouseDown(false);
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
			</div>
		</>
	);
}

export default App;
