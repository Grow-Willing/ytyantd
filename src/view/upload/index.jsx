import styles from "./index.module.less";
import React from 'react';
import { message, Button } from 'antd';
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import urlconfig from "@/url/index";
function App() {
	const navigate = useNavigate();
	const [fileList, setFileList] = useState([]);
	const [uploading, setUploading] = useState(false);

	let {url,method}=urlconfig.upload;

	let handleupload=()=>{
		if(!fileList.length){
			message
		}
		let formdata=new FormData();
		fileList.forEach((file)=>{
			formdata.append(file.name,file);
		})
		axios({
			url,
			method,
			data:formdata,
			timeout:5000
		}).then(function (response) {
			let {code,data:{token},msg}= response.data;
			message.success("请求成功",3,null);
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
			message.error("请求失败",3,null);
		}).finally(()=>{
			setUploading(false);
		});
		setUploading(true);
	}
	let handledrop=(e)=>{
		e.preventDefault();
		if (e.dataTransfer.items) {
				// Use DataTransferItemList interface to access the file(s)
			[...e.dataTransfer.items].forEach((item, i) => {
				// If dropped items aren't files, reject them
				if (item.kind === "file") {
					const file = item.getAsFile();
					setFileList(oldArray => [...oldArray, file])
					console.log(`… file[${i}].name = ${file.name}`);
				}
			});
		} else {
			// Use DataTransfer interface to access the file(s)
			[...e.dataTransfer.files].forEach((file, i) => {
				setFileList(oldArray => [...oldArray, file])
				console.log(`… file[${i}].name = ${file.name}`);
			});
		}
	}
	let handledragover=(e)=>{
		e.preventDefault();
	}
	return (
		<>
			<div className={styles.blackContent}>
				<div className={styles.middle} onDrop={handledrop} onDragOver={handledragover}>
					<Button type="primary" onClick={handleupload} loading={uploading} disabled={uploading}>
						上传
					</Button>
					{fileList.map((file,index)=>(<div>{index}---------{file.name}</div>))}
				</div>
			</div>
		</>
	);
}

export default App;
