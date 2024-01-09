import {  Drawer, Space,FloatButton} from "antd";
import { createFromIconfontCN } from "@ant-design/icons";
import styles from "./index.module.less";
import { useState } from "react";
import { Link } from "react-router-dom";

const MyIcon = createFromIconfontCN({
	scriptUrl: "/iconfont.js",
});

function App({show=false,classname=""}) {
	let [isshow, setIsshow] = useState(show);
	function switchContentShow() {
		setIsshow(!isshow);
	}
	return (
		<>
		
			<FloatButton
				type="default"
				onClick={switchContentShow}
				icon={
					<MyIcon
						type="icon-icon_fenlei-02"
					/>
				}
				className={`${classname}`}
				style={{
					top: "0px",
					bottom:"0px",
					margin:"auto"
				}}
			/>
			{/* <MyIcon
				type="icon-icon_fenlei-02"
				className={`${styles.icon} ${classname}`}
				onClick={switchContentShow}
			/> */}
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
						<MyIcon type="icon-wenjian" className={styles.cellicon} />
						<div className={styles.celldescription}>上传</div>
					</Link>
					<Link className={styles.cell} to="/workSchedule">
						<MyIcon type="icon-paibanguanli" className={styles.cellicon} />
						<div className={styles.celldescription}>排班</div>
					</Link>
				</Space>
			</Drawer>
		</>
	);
}

export default App;
