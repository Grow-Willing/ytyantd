import { Button, Select, Space, Table, Tooltip,InputNumber, Modal, Slider, message } from 'antd';
import { useEffect, useState } from "react";
import EditableCell from './editablecell'
import CellModel from './cellModel'
import { PlusOutlined,DeleteOutlined,ImportOutlined,createFromIconfontCN} from "@ant-design/icons";
import {useWorkShedule,useWorkSheduleDispatch} from '@/context/workSheduleContext';
import axios from 'axios';
import urlconfig from "@/url/index";
import Excel from 'exceljs'

const MyIcon = createFromIconfontCN({
	scriptUrl: "/iconfont.js",
});

function App({tableName}) {
	const [isModelOpen, setIsModelOpen] = useState(false);
	const [modelData, setModelData] = useState({});
	let toggleModel=(modelData)=>{
		setModelData(modelData);
		setIsModelOpen(!isModelOpen);
	}
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
		};
		columns.forEach(element => {
			newData[element.dataIndex]=element.default
		});
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
		if (col.description) {
			ret.title=()=>(
				<Tooltip placement="top" title={col.description}>
					{col.title}
				</Tooltip>
			)
		}
		if(col.type){
			switch (col.type) {
				case "list":
				case "select":{
					ret.title=()=>(
						<Tooltip placement="top" title={col.description??`编辑${col.title}`}>
							<Button
								type="link"
								onClick={toggleModel.bind(this,col)}
							>
								{col.title}
							</Button>
						</Tooltip>
					)
					break;
				}
				default:
					break;
			}
			ret.render=(text, record, index)=>{
				switch (col.type) {
					case "select":{
						let dependency=workSchedule.dependency[col.dataIndex].value;
						dependency??=[];
						return (<Select
							placeholder={`请选择${col.title}`}
							options={dependency.map((v,i)=>{
								return {value:i,label:v}
							})}
							value={text<dependency.length?text:null}
							onChange={(value)=>{handleSave(index,col.dataIndex,value)}}
						>
						</Select>);
					}
					case "list":{
						let dependency=workSchedule.dependency[col.dataIndex].value;
						dependency??=[];
						return (<Select
							allowClear
							placeholder={`请选择${col.title}`}
							mode="multiple"
							style={{width: '100%',}}
							filterOption={(inputValue, option)=>(option?.label ?? '').toLowerCase().includes(inputValue.toLowerCase())}
							options={dependency.map((v,i)=>{
								return {value:i,label:v}
							})}
							value={text.filter((v)=>v<dependency.length)}
							onChange={(value)=>{handleSave(index,col.dataIndex,value)}}
						>
						</Select>);
					}
					case "number":{
						return <InputNumber
							min={col.min??0}
							max={col.max}
							value={text}
							onChange={(value)=>{
								handleSave(index,col.dataIndex,value);
							}}
							changeOnWheel
						/>;
					}
					case "range":{
						return <Slider
							range
							min={col.min??0}
							max={col.max}
							value={text}
							onChange={(value)=>{
								if(value??false)handleSave(index,col.dataIndex,value);
							}}
						/>;
					}
					default:{
						let dependency=workSchedule.dependency[col.dataIndex].value;
						return <div>{JSON.stringify(dependency)}</div>
					}
				}
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
		fileinput.accept = ".xlsx,.xls";
		fileinput.onchange = (e) => {
			console.log(e.target.files);
			for (let i = 0; i < e.target.files.length; i++) {
				let file = e.target.files[i];
				console.log(`… file[${i}].name = ${file.name}`);
				var reader = new FileReader(); //读取操作就是由它完成.
				reader.readAsBinaryString(file);//读取文件的内容,也可以读取文件的URL
				reader.onload = function (evt) {
						//当读取完成后回调这个函数,然后此时文件的内容存储到了result中,直接操作即可
						var data = evt.target.result;
						const workbook = new Excel.Workbook();
						workbook.xlsx.load(data).then((wb) => {
							// wb.eachSheet(function(worksheet, sheetId) {
							// 	console.log(worksheet.name);
							// 	worksheet.eachRow(function(row, rowNumber) {
							// 		console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
							// 	});
							// });
							//先解析dependency，别的会用到
							let dependency=[],config={};
							let worksheet=wb.getWorksheet('设置');
							worksheet.eachRow(function(row, rowNumber) {
								let truevalues=row.values.filter((v)=>v);
								let title = truevalues[0];
								switch (title) {
									case "资质":
										dependency.push({
											name:"qualification",
											value:truevalues.slice(1)
										});
										break;
									case "等价组":
										dependency.push({
											name:"equalGroup",
											value:truevalues.slice(1)
										});
										break;
									case "日期":
										config["day"]=truevalues.slice(1);
										break;
									case "休息天数":
										config["offday_config"]=truevalues.slice(1);
										break;
									default:
										break;
								}
							});
							
							worksheet=wb.getWorksheet('人员');
							let sheetName="people";
							let savedColumn=workSchedule[sheetName].columns,
								inputColum;
							let people={data:[],key:0};
							worksheet.eachRow(function(row, rowNumber) {
								if(rowNumber==1){
									inputColum=row.values.map((v,i)=>{return {title:v,index:i}}).filter((v)=>v);
									//校验数组是否一致
									if(inputColum.length!==savedColumn.length)//长度
										return;
									let a=inputColum.toSorted((aa,bb) => aa.title.localeCompare(bb.title,'zh')),
										b=savedColumn.toSorted((aa,bb) => aa.title.localeCompare(bb.title,'zh'));
									if(!b.every((v,i)=>v.title==a[i].title)) return;//标题需要一致
								}else{
									let nextdata={
										//下标1开始，去除标题行，共两行
										key:workSchedule[sheetName].key+rowNumber-2,
									};
									inputColum.forEach((v,i) => {
										let k=savedColumn[i].dataIndex,
											val=row.values[v.index];
										console.log(val);
										if(savedColumn[i].type=="list"){
											nextdata[k]=val.split(",");
										}else{
											nextdata[k]=val;
										}
									});
									people.data.push(nextdata);
									people.key=Math.max(people.key,workSchedule[sheetName].key+rowNumber-2);
								}
							});
							worksheet=wb.getWorksheet('班列表');
							savedColumn=workSchedule.shifts.columns;
							let shifts={data:[],key:0};
							worksheet.eachRow(function(row, rowNumber) {
								if(rowNumber==1){
									inputColum=row.values.map((v,i)=>{return {title:v,index:i}}).filter((v)=>v);
									//校验数组是否一致
									if(inputColum.length!==savedColumn.length)//长度
										return;
									let a=inputColum.toSorted((aa,bb) => aa.title.localeCompare(bb.title,'zh')),
										b=savedColumn.toSorted((aa,bb) => aa.title.localeCompare(bb.title,'zh'));
									if(!b.every((v,i)=>v.title==a[i].title)) return;//标题需要一致
								}else{
									let nextdata={
										//下标1开始，去除标题行，共两行
										key:workSchedule[sheetName].key+rowNumber-2,
									};
									inputColum.forEach((v,i) => {
										let k=savedColumn[i].dataIndex,
											val=row.values[v.index];
										switch (savedColumn[i].type) {
											case "list":
												nextdata[k]=val.split(",");
												break;
											case "range":
												nextdata[k]=val.split(",");
												break;
											
											default:
												nextdata[k]=val;
												break;
										}
									});
									shifts.data.push(nextdata);
									shifts.key=Math.max(shifts.key,workSchedule[sheetName].key+rowNumber-2);
								}
							});
							let payload={people,shifts,dependency,config};
							console.log("调用dispatch");
							WorkSheduleDispatch({type: 'importData', data: payload});
						});
				}

			}
			console.log(workSchedule);
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
							let {url:scheduleurl,method:schedulemethod}=urlconfig.getschedule;
							let requestData={
								person_list:workSchedule["people"].data,
								input_shift_list:workSchedule["shifts"].data,
								// offday_config:workSchedule["offdays"].data,
								offday_config:workSchedule["config"].data.offday_config,
								equalGroup_list:workSchedule["dependency"].equalGroup.value,
								qualification:workSchedule["dependency"].qualification.value,
								num_shift_daily:1,
								input_num_days:workSchedule["day"].input_num_days,
								requirelist:workSchedule["require"],
							};
							axios({
								method: schedulemethod,
								url: scheduleurl,
								data: requestData,
								timeout:3000
							}).then(function (response) {
								let {code,data,msg}= response.data;
								WorkSheduleDispatch({type: 'setrequest',loading:false,data});
								console.log(data);
							}).catch(function (error) {
								if (error.response) {
									// 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
									message.error("请求异常");
									console.log(error.response.data);
									console.log(error.response.status);
									console.log(error.response.headers);
								} else if (error.request) {
									// 请求已经成功发起，但没有收到响应
									// `error.request` 在浏览器中是 XMLHttpRequest 的实例，
									// 而在node.js中是 http.ClientRequest 的实例
									message.error("网络不佳");
									console.log(error.request);
								} else {
									// 发送请求时出了点问题
									console.log('Error', error.message);
								}
								console.log(error.config);
							});
							WorkSheduleDispatch({type: 'setrequest',loading:true});
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
			<CellModel data={modelData} key={JSON.stringify(modelData)} open={isModelOpen} onOk={toggleModel.bind(this,{})} onCancel={toggleModel.bind(this,{})}/>
		</>
	);
}

export default App;
