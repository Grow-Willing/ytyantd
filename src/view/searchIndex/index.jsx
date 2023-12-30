import { Input, Drawer, Space, Row } from "antd";
import { createFromIconfontCN, SearchOutlined } from "@ant-design/icons";
import styles from "./index.module.less";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const MyIcon = createFromIconfontCN({
	scriptUrl: "/iconfont.js",
});

function App() {
	let [isshow, setIsshow] = useState(false);
	const navigate = useNavigate();
	function switchContentShow() {
		setIsshow(!isshow);
	}
	function tologin() {
		navigate("/login");
	}
	return (
		<>
			<div className={styles.app}>
				<div className={styles.middlebox}>
					<Row justify="space-between" align="middle" className={styles.header}>
						<MyIcon
							type="icon-login-variant"
							className={styles.icon}
							onClick={tologin}
						/>
						<MyIcon
							type="icon-icon_fenlei-02"
							className={styles.icon}
							onClick={switchContentShow}
						/>
					</Row>
					<div className={styles.middle}>
						<div className={styles.logo}>搜索界面</div>
						<div className={styles.searchbar}>
							<Input
								className={styles.input}
								prefix={<SearchOutlined />}
								bordered={false}
							/>
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
								padding: "15px",
							},
						}}
						closeIcon={null}>
						<Space wrap="true">
							<Link className={styles.cell} to="/">
								<MyIcon type="icon-home" className={styles.cellicon} />
								<div className={styles.celldescription}>主页</div>
							</Link>
							<Link className={styles.cell} to="/setting">
								<MyIcon type="icon-settings" className={styles.cellicon} />
								<div className={styles.celldescription}>设置</div>
							</Link>
							<Link className={styles.cell} to="/account">
								<MyIcon type="icon-account" className={styles.cellicon} />
								<div className={styles.celldescription}>账号信息</div>
							</Link>
							<Link className={styles.cell} to="/search">
								<MyIcon type="icon-search" className={styles.cellicon} />
								<div className={styles.celldescription}>查询</div>
							</Link>
							<Link className={styles.cell} to="/upload">
								<MyIcon type="icon-search" className={styles.cellicon} />
								<div className={styles.celldescription}>上传</div>
							</Link>
						</Space>
					</Drawer>
				</div>
			</div>
		</>
	);
}

export default App;
