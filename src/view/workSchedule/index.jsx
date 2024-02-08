import dayjs from 'dayjs';
import styles from "./index.module.less";
import React from 'react';
import { Calendar, Radio } from 'antd';
import classNames from 'classnames';
import { Lunar, HolidayUtil } from 'lunar-javascript';
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import urlconfig from "@/url/index";
import Navlist from '@/component/navlist';
function App() {
	const navigate = useNavigate();
	const options = [
		{
			label: '按次排班',
			value: 'count',
		},
		{
			label: '按天排班',
			value: 'day',
		},
		{
			label: '按月排班',
			value: 'month',
		},
	];
	const [value, setValue] = useState(options[0].value);
	let onChange = (e) => {
		setValue(e.target.value);
	};
	const [selectDate, setSelectDate] = React.useState(dayjs());
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
			}),
			children: (
			  <div className={styles.text}>
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
		if (selectInfo.source === 'date') {
		  setSelectDate(value);
		}
	  };
	return (
		<>
			<div className={styles.blackContent}>
				<div className={styles.middle}>
					<Radio.Group
						options={options}
						onChange={onChange}
						value={value}
						optionType="button"
						buttonStyle="solid"
					/>
					<div style={{
						margin:"5px",
						border:"1px solid rgb(217, 217, 217)",
						borderRadius:"8px"
					}}>
						<Calendar fullCellRender={cellRender} fullscreen={false} onSelect={onDateChange}/>
					</div>
				</div>
				<Navlist classname={styles.navlist} />
			</div>
		</>
	);
}

export default App;
