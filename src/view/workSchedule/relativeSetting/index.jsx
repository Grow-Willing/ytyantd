import { Card, Space } from 'antd';
import { useState } from "react";
import { WorkSheduleProvider, useWorkShedule } from '@/context/workSheduleContext'
const { Grid } = Card;
function App() {
	const workShedule = useWorkShedule();
	let configTemplate = workShedule.config.template,
		configdata = workShedule.config.data;
	return (
		<>
			<Space wrap={true}>
				{
					Object.keys(configTemplate).map(key=>{
						return (
							<Card
								hoverable
								key={key}
								title={configTemplate[key].title}
								style={{
									textAlign: 'center',
								}}
							>
								{
									configTemplate[key].children.map(items=>{
										let {title,type,name} =items;
										return (
											<Grid
												key={name}
												style={{
													width: '100%',
													textAlign: 'center',
												}}
											>
												{title}:{configdata[key][name]}
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

function WithProvider() {
	return (
		<App />
	)
}
export default WithProvider;
