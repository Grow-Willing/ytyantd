import { Input, Drawer } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './index.less'
import { useState } from 'react';
function App() {
	let [isshow, setIsshow] = useState(false);
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
						<Input style={{ boxShadow: "none" }} prefix="hhh" bordered={false} />
					</div>
				</div>
				<Drawer
					open={isshow}
					onClose={switchContentShow}
					contentWrapperStyle={{
						"--borderRadius":"15px",
						height:"300px",
						margin:"auto 10px auto auto",
						borderRadius:"var(--borderRadius)",
					}}
					styles={{
						content:{
							borderRadius: "var(--borderRadius)",
						},
						body:{
							padding:"15px"
						}
					}}
					closeIcon={null}
				>
					<p>Some contents.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa..</p>
					<p>Some contents...</p>
					<p>Some contents...</p>
				</Drawer>
			</div>
		</>
	)
}

export default App
