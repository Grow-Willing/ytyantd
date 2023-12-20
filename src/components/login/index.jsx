import { Input, Space, Checkbox, Button, Row } from 'antd';
import styles from './index.module.less'
function App() {
	return (
		<>
			<div className={styles.blackContent}>
				<div className={styles.whiteContent}></div>
				<div className={styles.middle}>
					<div className={styles.halfContent}>
						<Space direction="vertical" size="middle" className={styles.leftform}>
							用户名
							<div className={styles.inputContent}>
								<Input style={{ boxShadow: "none" }}bordered={false} />
							</div>
							密码
							<div className={styles.inputContent}>
								<Input.Password style={{ boxShadow: "none" }}bordered={false} />
							</div>
							<Row justify={'space-between'} align={"middle"}>
								<Checkbox>
									记住我
								</Checkbox>
								<Button type="link">忘记密码？</Button>
							</Row>
							<Button type="primary" block>登录</Button>
						</Space>
					</div>
					<div className={styles.halfContent} style={{transform:"translateX(-1px)",backgroundColor:"#1c3b67"}}>
						<Space direction="vertical" size="middle" className={styles.rightform}>
							用户名
							<div className={styles.inputContent}>
								<Input style={{ boxShadow: "none" }}bordered={false} />
							</div>
							密码
							<div className={styles.inputContent}>
								<Input.Password style={{ boxShadow: "none" }}bordered={false} />
							</div>
							<Row justify={'space-between'} align={"middle"}>
								<Checkbox style={{color:"white"}}>
									记住我
								</Checkbox>
								<Button type="link" danger>忘记密码？</Button>
							</Row>
							<Button type="primary" block danger>登录</Button>
						</Space>
					</div>
				</div>
			</div>
		</>
	)
}

export default App
