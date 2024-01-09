
import { useState, useRef, useEffect } from "react";
import { Input, Space, Tooltip } from 'antd';
import { createFromIconfontCN } from "@ant-design/icons";
import styles from "./index.module.less";

const MyIcon = createFromIconfontCN({
	scriptUrl: "/iconfont.js",
});

export default function Index({text="",onChange=()=>{},addicons=[]}) {
	const [editText, setEditText] = useState(text);
	const [editing, setEditing] = useState(false);
	const inputRef = useRef(null);
	let changehandler=(e)=>{
		let newvalue=e.target.value,
			lastvalue=editText;
		if(newvalue!=lastvalue){//changed
			let result=onChange(newvalue);
			if(result!==false)
				setEditText(newvalue);
		}
		changeEditing();
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
	useEffect(() => {
		setEditText(text);
	},[text]);
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
						onBlur={changehandler}
						onPressEnter={changehandler}
					/>
				):(<>
					<span className={styles.editText}>
						{editText}
					</span>
					<Space align="center" className={styles.iconlist}>
						<Tooltip title="编辑" color="#108ee9">
							<MyIcon
								type="icon-edit"
								onClick={changeEditing}
							/>
						</Tooltip>
						{
							addicons.map(({title,node},index)=>{
								return (
									<Tooltip key={index} title={title} color="#108ee9">
										{node}
									</Tooltip>
								)
								
							})
						}
					</Space>
				</>)
			}
		</div>
	)
}
