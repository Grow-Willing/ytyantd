import { Input, Drawer } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styles from './index.module.less'
import { useState } from 'react';
function App() {
	let [isshow, setIsshow] = useState(false);
	function switchContentShow() {
		setIsshow(!isshow);
	}
	return (
		<>
			<div className={styles.app}>
				<div className={styles.middlebox}>
					<div className={styles.header} onClick={switchContentShow}>
						<UserOutlined />
					</div>
					<div className={styles.middle}>
						<div className={styles.logo}>
							搜索界面
						</div>
						<div className={styles.searchbar}>
							<Input style={{ boxShadow: "none" }} prefix="hhh" bordered={false} />
						</div>
					</div>
					<Drawer
						open={isshow}
						onClose={switchContentShow}
						contentWrapperStyle={{
							"--borderRadius": "15px",
							height: "300px",
							margin: "auto 10px auto auto",
							borderRadius: "var(--borderRadius)",
						}}
						styles={{
							content: {
								borderRadius: "var(--borderRadius)",
							},
							body: {
								padding: "15px"
							}
						}}
						closeIcon={null}
					>
						<p>Some contents.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa..</p>
						<p>Some contents...</p>
						<p>Some contents...</p>
					</Drawer>
				</div>
			</div>
		</>
	)
}

export default App
