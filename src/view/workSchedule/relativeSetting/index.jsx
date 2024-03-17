import { Card, InputNumber, Space } from 'antd';
import { useEffect, useRef, useState } from "react";
import { useWorkSheduleDispatch, useWorkShedule } from '@/context/workSheduleContext'
const { Grid } = Card;
function App() {
	const workShedule = useWorkShedule();
	let configTemplate = workShedule.config.template,
		configdata = workShedule.config.data;
	let WorkSheduleDispatch=useWorkSheduleDispatch();
	let [editFlag, setEditFlag] = useState([]);
	let focusitem=useRef(null);
	let handleSave=(key,name,data)=>{
		WorkSheduleDispatch({type:"setconfig",key,name,data});
	}
	let rmEditFlag=()=>{
		setEditFlag([]);
	}
	useEffect(() => {
		if(editFlag.length){
			focusitem.current.focus({
				cursor: 'end',
			});
		}
	},[editFlag]);
	return (
		<>
			<Space wrap={true}>
				{
					Object.keys(configTemplate).map(key => {
						return (
							<Card
								hoverable
								key={key}
								title={configTemplate[key].title}
								style={{
									width:"300px",
									textAlign: 'center',
								}}
							>
								{
									configTemplate[key].children.map(items => {
										let { title, type, name } = items;
										return (
											<Grid
												key={name}
												style={{
													width: '100%',
													height: '70px',
													textAlign: 'center',
												}}
												onClick={() => {
													setEditFlag([key, items]);
												}}
											>
												{
													(editFlag.length&&key == editFlag[0] && items == editFlag[1]) ?
														(<>
															<InputNumber
																min={items.min ?? 0}
																max={items.max}
																ref={focusitem}
																value={configdata[key][name]}
																onChange={(value) => {
																	if (value ?? false) handleSave(key, name, value);
																}}
																onBlur={rmEditFlag}
																changeOnWheel
															/>
														</>) :
														(<>{title} : {configdata[key][name]}</>
													)
												}
											</Grid>
										)
									})
								}
							</Card>
						)
					})
				}
			</Space>
		</>
	);
}
export default App;
