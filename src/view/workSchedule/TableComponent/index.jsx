import { Button, Space, Table, Tooltip } from 'antd';
import { useEffect, useState } from "react";
import EditableCell from './editablecell'
import { PlusOutlined,DeleteOutlined,ImportOutlined,createFromIconfontCN} from "@ant-design/icons";
import {useWorkShedule,useWorkSheduleDispatch} from '@/context/workSheduleContext';

const MyIcon = createFromIconfontCN({
	scriptUrl: "/iconfont.js",
});

function App({tableName}) {
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const onSelectChange = (newSelectedRowKeys) => {
		console.log('selectedRowKeys changed: ', newSelectedRowKeys);
		setSelectedRowKeys(newSelectedRowKeys);
	};
	let workSchedule=useWorkShedule();
	let {data,columns,key}=workSchedule[tableName];
	let WorkSheduleDispatch=useWorkSheduleDispatch();
	let setData=(v)=>{WorkSheduleDispatch({type: 'setData',tableName,data:v})};
	let setKey=(v)=>{WorkSheduleDispatch({type: 'setKey',tableName,key:v})};
	let handleAdd = () => {
		const newData = {
			key,
			equalGroup:0
		};
		setData([...data, newData]);
		setKey(key+1);
	};
	let handleDelete = (key) => {
		setData((data)=>data.filter((item) => item.key !== key));
	};
	let handleSave = (row,k,v) => {
		setData((data) => data.map((d, i) => {
			if (i == row) {
				let nextvalue={ ...d};
				nextvalue[k]=v;
				return nextvalue;
			}
			return d;
		}));
	};

	let newColumns=columns.map((col) => {
		let ret={
			...col,
			width:`${100/columns.length}%`,
			// onCell: (record) => ({
			// 	record,
			// 	dataIndex: col.dataIndex,
			// 	title: col.title,
			// 	onChange:handleSave
			// }),
		};
		if(col.type==="dependency"){
			let dependency=workSchedule.dependency[col.dataIndex];
			ret.render=(text, record, index)=>{
				if(typeof text === "number"){
					return <div>{dependency[text]}</div>;
				}
				return <div>1</div>
			}
		}else{
			ret.render=(text,record)=>
				<EditableCell
					record={record}
					dataIndex={col.dataIndex}
					title={col.title}
					onChange={handleSave}
				/>;
		}
		return ret;
	});
	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
		columnWidth:"32px",
		preserveSelectedRowKeys:false
	}
	//点击上传文件
	let handleClickupload = () => {
		let fileinput = document.createElement("input");
		fileinput.type = "file";
		fileinput.onchange = (e) => {
			console.log(e.target.files);
			for (let i = 0; i < e.target.files.length; i++) {
				let file = e.target.files[i];
				console.log(`… file[${i}].name = ${file.name}`);
			}
		};
		fileinput.click();
	}
	return (
		<>
			<Space.Compact block>
				<Tooltip placement="top" title="添加新行">
					<Button
						icon={<PlusOutlined />}
						onClick={handleAdd}
					/>
				</Tooltip>
				<Tooltip placement="top" title="删除选中">
					<Button
						icon={<DeleteOutlined />}
						disabled={!selectedRowKeys.length}
						onClick={()=>{
							selectedRowKeys.forEach((v)=>{
								handleDelete(v);
							})
							setSelectedRowKeys([]);
						}}
					/>
				</Tooltip>
				<Tooltip placement="top" title="从文件导入">
					<Button
						icon={<ImportOutlined />}
						onClick={handleClickupload}
					/>
				</Tooltip>
				<Tooltip placement="top" title="生成班表">
					<Button
						icon={<MyIcon type="icon-paibanguanli" />}
						onClick={()=>{

						}}
					/>
				</Tooltip>
			</Space.Compact>
			<Table
				// components={{
				// 	body: {
				// 		cell: EditableCell,
				// 	},
				// }}
				rowSelection={rowSelection}
				columns={newColumns}
				dataSource={data}
				bordered={true}
				onChange={(pagination, filters, sorter)=>{
					console.log(pagination, filters, sorter)
				}}
			/>
		</>
	);
}

export default App;
