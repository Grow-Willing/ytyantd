import styles from "./index.module.less";
import { message, Button, Input } from 'antd';
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import urlconfig from "@/url/index";
import Navlist from '@/component/navlist';
function App() {
	const navigate = useNavigate();
	//{filename,file}
	const [fileList, setFileList] = useState([]);
	const [uploading, setUploading] = useState(false);

	let { url, method } = urlconfig.upload;

	let handleupload = () => {
		if (!fileList.length) {
			message
		}
		let formdata = new FormData();
		fileList.forEach((file) => {
			formdata.append(file.filename, file.file);
		})
		axios({
			url,
			method,
			data: formdata,
			timeout: 5000
		}).then(function (response) {
			let { code, data: { token }, msg } = response.data;
			message.success("请求成功", 3, null);
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
		}).finally(() => {
			setUploading(false);
		});
		setUploading(true);
	}
	let handledrop = (e) => {
		e.preventDefault();
		if (e.dataTransfer.items) {
			// Use DataTransferItemList interface to access the file(s)
			[...e.dataTransfer.items].forEach((item, i) => {
				// If dropped items aren't files, reject them
				if (item.kind === "file") {
					const file = item.getAsFile();
					setFileList(oldArray => [...oldArray, { filename: file.name, file }])
					console.log(`… file[${i}].name = ${file.name}`);
				}
			});
		} else {
			// Use DataTransfer interface to access the file(s)
			[...e.dataTransfer.files].forEach((file, i) => {
				setFileList(oldArray => [...oldArray, { filename: file.name, file }])
				console.log(`… file[${i}].name = ${file.name}`);
			});
		}
	}
	let handledragover = (e) => {
		e.preventDefault();
	}
	let hanldevaluechange=(index,value) => {
		let nextfileList=fileList.map((f, i) =>{
			if(i==index){
				for(let j=0; j<fileList.length; j++){
					if(fileList[j].filename==value){//存在重名
						message.error("重名了");
						return f;
					}
				}
				return {filename: value,file:f.file};
			}
			return f;
		})
		setFileList(nextfileList);
	}
	return (
		<>
			<div className={styles.blackContent}>
				<div className={styles.middle} onDrop={handledrop} onDragOver={handledragover}>
					<Button type="primary" onClick={handleupload} loading={uploading} disabled={!fileList.length||uploading}>
						上传
					</Button>
					{fileList.map((file, index) => {
						return (
							<Input
								key={index}
								value={file.filename}
								style={{ boxShadow: "none" }}
								prefix={`${index+1}.`}
								bordered={false}
								onChange={(e)=>{hanldevaluechange(index,e.target.value)}}
							/>
						)
					})}
				</div>
				<Navlist classname={styles.navlist}/>
			</div>
		</>
	);
}

export default App;
