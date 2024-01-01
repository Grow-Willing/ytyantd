import { Input, Row } from "antd";
import { createFromIconfontCN, SearchOutlined } from "@ant-design/icons";
import styles from "./index.module.less";
import { useNavigate } from "react-router-dom";
import Navlist from '@/component/navlist'
const MyIcon = createFromIconfontCN({
	scriptUrl: "/iconfont.js",
});

function App() {
	const navigate = useNavigate();
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
						<Navlist/>
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
				</div>
			</div>
		</>
	);
}

export default App;
