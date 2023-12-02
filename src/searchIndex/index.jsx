import { Input } from 'antd';
import { UserOutlined , CaretLeftFilled, CaretRightFilled } from '@ant-design/icons';
import './index.less'
import { useState } from 'react';
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
				<div className={isshow?"relativeBox show":"relativeBox"}>
					<CaretLeftFilled className='arrow'onClick={switchContentShow}/>
					<div className='contentList'>
						aaaa
					</div>
				</div>
			</div>
		</>
	)
}

export default App
