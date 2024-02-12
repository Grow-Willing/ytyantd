import styles from "./index.module.less";
import { Space, Table } from 'antd';
import { useEffect, useState } from "react";
import EditableCell from './editablecell'


function App() {
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const onSelectChange = (newSelectedRowKeys) => {
		console.log('selectedRowKeys changed: ', newSelectedRowKeys);
		setSelectedRowKeys(newSelectedRowKeys);
	};
	const defaultColumns = [
		{
			title: '姓名',
			dataIndex: 'name',
			width:"30%"
		},
		{
			title: '资质',
			dataIndex: 'qualification',
		},
	];
	let [newColumns, setNewColumns] = useState([...defaultColumns,{
		title: '操作',
		key: 'action',
		width:20,
		render: (text, record, index) => (
			<Space size="middle">
				<a onClick={handleDelete.bind(this,index)}>Delete</a>
			</Space>
		),
	}]);
	const [data, setData] = useState([{key:0,name:"员工1",qualification:0}]);
	const handleAdd = () => {
		const newData = {
			key: data.length,
			name: `Edward King ${data.length}`,
		};
		setData([...data, newData]);
	};
	let handleDelete = (key) => {
		const newData = data.filter((item) => item.key !== key);
		setData(newData);
	};
	let handleSave = (row,k,v) => {
		let newData = data.map((d, i) => {
			if (i == row) {
				let nextvalue={ ...d};
				nextvalue[k]=v;
				return nextvalue;
			}
			return d;
		})
		setData(newData);
	};
	let columns=newColumns.map((col) => {
		return {
			...col,
			onCell: (record) => ({
				record,
				dataIndex: col.dataIndex,
				title: col.title,
				onChange:handleSave
			}),
		};
	});
	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
		selections: [
			{
				key: 'addNewRow',
				text: '添加新行',
				onSelect: handleAdd,
			},
		],
	}
	return (
		<>
			<Table
				components={{
					body: {
						cell: EditableCell,
					},
				}}
				rowSelection={rowSelection}
				columns={columns}
				dataSource={data}
				bordered={true}
			/>
		</>
	);
}

export default App;
