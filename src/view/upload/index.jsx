import styles from "./index.module.less";
import { message, Button, Input, Row, Space } from 'antd';
import { createFromIconfontCN } from "@ant-design/icons";
import axios from "axios";
import { startTransition, useState } from "react";
import { useNavigate } from "react-router-dom";
import urlconfig from "@/url/index";
import Navlist from '@/component/navlist';
import EditableText from './editableText'

const MyIcon = createFromIconfontCN({
	scriptUrl: "/iconfont.js",
});
function App() {
	const navigate = useNavigate();
	//{filename,file}
	const [fileList, setFileList] = useState([]);
	const [uploading, setUploading] = useState(false);

	let { url, method } = urlconfig.uploadfile;
	let handleupload = () => {
		if (!fileList.length) {
			message
		}
		let formdata = new FormData();
		fileList.forEach((file) => {
			formdata.append(file.filename, file.file);
		})

		fileupload({url,method,file:fileList[0].file}).finally(() => {
			setUploading(false);
		});
		setUploading(true);
	}
	let fileupload=({url,method,file,requestData={}})=>{
		let batchsize=10*1024*1024;
		let batchcounts=Math.ceil(file.size/batchsize);
		return axios({
			url,
			method,
			data: {
				batchcounts,
				filesize:file.size,
				...requestData
			},
			timeout: 5000
		}).then(function (response) {
			let { data: { uploadId,url } } = response.data;
			message.success("上传链接获取成功", 3, null);
			let sliceList=[];
			url.forEach((value,index)=>{
				let start=index*batchsize,
					end=(index+1)*batchsize;
				if(end>fileList[0].file.size){
					end=fileList[0].file.size;
				}
				let senddata=fileList[0].file.slice(start,end);
				let pice=axios({
					url:value,
					method:"put",
					data:senddata,
					timeout:5000,
					headers: {
						'Content-Type': 'application/octet-stream'
					},
				}).then(function (response) {
					message.success(`分片${index+1}上传成功`, 3, null);
					console.log(response.data);
				});
				sliceList.push(pice);
			})
			let { uploaddoneurl, uploaddonemethod } = urlconfig.uploaddone;
			Promise.all(sliceList).then(()=>axios({
				url:uploaddoneurl,
				method:uploaddonemethod,
				params:{
					uploadId
				}
			})).then(function (response) {
				message.success("文件上传成功", 3, null);
			})
		}).catch(function (error) {
			if (error.response) {
				// 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
				console.log(error.response.data);
				console.log(error.response.status);
				console.log(error.response.headers);
			} else if (error.request) {
				// 请求已经成功发起，但没有收到响应
				// `error.request` 在浏览器中是 XMLHttpRequest 的实例，
				// 而在node.js中是 http.ClientRequest 的实例
				console.log(error.request);
			} else {
				// 发送请求时出了点问题
				console.log('Error', error.message);
			}
			console.log(error.config);
			message.error("请求失败", 3, null);
		})
	}
	let handledrop = (e) => {
		e.preventDefault();
		if (e.dataTransfer.items) {
			// Use DataTransferItemList interface to access the file(s)
			[...e.dataTransfer.items].forEach((item, i) => {
				// If dropped items aren't files, reject them
				if (item.kind === "file") {
					const file = item.getAsFile();
					setFileList(oldArray => [...oldArray, { filename: file.name, file,edit:false}])
					console.log(`… file[${i}].name = ${file.name}`);
					console.log(file.type);
				}
			});
		} else {
			// Use DataTransfer interface to access the file(s)
			[...e.dataTransfer.files].forEach((file, i) => {
				setFileList(oldArray => [...oldArray, { filename: file.name, file,edit:false }])
				console.log(`… file[${i}].name = ${file.name}`);
			});
		}
	}
	let handledragover = (e) => {
		e.preventDefault();
	}
	let hanldevaluechange = (index, value) => {
		let nextfileList = fileList.map((f, i) => {
			if (i == index) {
				for (let j = 0; j < fileList.length; j++) {
					if (fileList[j].filename == value&&i!=j) {//存在重名
						message.error("重名了");
						return f;
					}
				}
				return {...f, filename: value, edit: false};
			}
			return f;
		})
		setFileList(nextfileList);
	}
	let startEdit=(index)=>{
		let nextfileList = fileList.map((f, i) => {
			if (i == index) {
				return { ...f,edit: true };
			}
			return f;
		})
		setFileList(nextfileList);
	}
	return (
		<>
			<Row
				className={styles.Content}
				justify="center"
				align="middle"
			>
				<div
					className={styles.middle}
					onDrop={handledrop}
					onDragOver={handledragover}
				>
					<Button className={styles.uploadbtn} type="primary" onClick={handleupload} loading={uploading} disabled={!fileList.length || uploading}>
						上传
					</Button>
					<div>
					{
						fileList.length ? (<Space direction="vertical">
							{
								fileList.map((file, index) => {
									return (
										<EditableText key={index} text={file.filename}/>
									)
								})
							}
						</Space>) : (
							<div>111</div>
						)}
					</div>
				</div>
				<Navlist classname={styles.navlist} />
			</Row>
		</>
	);
}

export default App;
