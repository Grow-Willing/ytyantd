import { Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './index.less'
import { useState } from 'react';
import Aside from '../aside'
function App() {
	let [isshow,setIsshow]=useState(false);
	function switchContentShow() {
		setIsshow(!isshow);
	}
	return (
		<>
			<div className="middlebox">
				<div className="header" onClick={switchContentShow}>
					<UserOutlined />
				</div>
				<div className="middle">
					<div className="logo">
						搜索界面
					</div>
					<div className='searchbar'>
						<Input style={{boxShadow:"none"}} prefix="hhh" bordered={false} />
					</div>
				</div>
				<Aside isshow={isshow} switchContentShow={switchContentShow}>
					{
						Array.from({length:11}).map((v,i)=>(
							<div key={i} className='testlist'>
								testlist1111<br/><br/><br/><br/><br/><br/><br/><br/>111111111111111111111111
							</div>
						)
					)}
				</Aside>
			</div>
		</>
	)
}

export default App
