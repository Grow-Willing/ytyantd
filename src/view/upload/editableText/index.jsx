
import { useState, useRef, useEffect } from "react";
import { Input, Space, Tooltip } from 'antd';
import { createFromIconfontCN } from "@ant-design/icons";
import styles from "./index.module.less";

const MyIcon = createFromIconfontCN({
	scriptUrl: "/iconfont.js",
});

export default function Index({text="",onBlur=()=>{}}) {
	const [editText, setEditText] = useState(text);
	const [editing, setEditing] = useState(false);
	const inputRef = useRef(null);
	let blurhandler=(e)=>{
		setEditText(e.target.value);
		changeEditing();
		onBlur.call(this, e.target.value);
	}
	let changeEditing=()=>{
		setEditing(!editing);
	}
	useEffect(() => {
		if(editing){
			inputRef.current.focus({
				cursor: 'end',
			});
		}
	});
	return (
		<div className={styles.editable}>
			{
				editing?(
					<Input
						ref={inputRef}
						defaultValue={editText}
						className={styles.editText}
						// style={{ boxShadow: "none" }}
						bordered={false}
						onBlur={blurhandler}
					/>
				):(<>
					<span className={styles.editText}>
						{editText}
					</span>
					<Space align="center">
						<Tooltip title="编辑" color="#108ee9">
							<MyIcon
								type="icon-edit"
								className={styles.icon}
								onClick={changeEditing}
							/>
						</Tooltip>
						<Tooltip title="删除" color="#108ee9">
							<MyIcon
								type="icon-delete"
								className={styles.icon}
							/>
						</Tooltip>
						<Tooltip title="打标签" color="#108ee9">
							<MyIcon
								type="icon-add-tag"
								className={styles.icon}
							/>
						</Tooltip>
					</Space>
				</>)
			}
		</div>
	)
}
