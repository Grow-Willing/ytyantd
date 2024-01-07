import styles from "./index.module.less";
import { message, Button, Tooltip, Row, Space, Modal } from 'antd';
import { createFromIconfontCN } from "@ant-design/icons";
import axios from "axios";
import { startTransition, useState } from "react";
import { useNavigate } from "react-router-dom";
import urlconfig from "@/url/index";
import Navlist from '@/component/navlist';
import EditableText from './editableText'
import SparkMD5 from 'spark-md5';

const MyIcon = createFromIconfontCN({
	scriptUrl: "/iconfont.js",
});
function App() {
	const navigate = useNavigate();
	//{filename,file}
	const [fileList, setFileList] = useState([]);
	//是否正在上传
	const [uploading, setUploading] = useState(false);

	let { url, method } = urlconfig.uploadfile;
	let handleupload = () => {
		if (!fileList.length) {
			message
		}
		let fileFetchList = [];
		fileList.forEach((file) => {
			let fileFetch = fileupload({
				url,
				method,
				file: file.file,
				requestData: {
					filename: file.filename
				}
			})
			fileFetchList.push(fileFetch);
			setUploading(true);
		})
		Promise.all(fileFetchList).finally(() => {
			setUploading(false);
		});
	}
	let fileupload = ({ url, method, file, requestData = {} }) => {
		let batchsize = 10 * 1024 * 1024;
		let batchcounts = Math.ceil(file.size / batchsize);
		return countMD5(file, batchsize).then((md5) => axios({
			url,
			method,
			data: {
				md5,
				batchcounts,
				filetype: "pdf",
				filesize: file.size,
				...requestData
			},
			timeout: 5000
		}).then(function (response) {
			let { data: { fileId, contentId, url } } = response.data;
			console.log(contentId);
			message.success("上传链接获取成功", 3, null);
			let sliceList = [];
			url.forEach((value, index) => {
				let start = index * batchsize,
					end = (index + 1) * batchsize;
				if (end > file.size) {
					end = file.size;
				}
				let senddata = file.slice(start, end);
				let pice = axios({
					url: value,
					method: "put",
					data: senddata,
					timeout: 5000,
					headers: {
						'Content-Type': 'application/octet-stream'
					},
				}).then(function (response) {
					message.success(`分片${index + 1}上传成功`, 3, null);
					console.log(response.data);
				});
				sliceList.push(pice);
			})
			let { url: uploaddoneurl, method: uploaddonemethod } = urlconfig.uploaddone;
			Promise.all(sliceList).then(() => axios({
				url: uploaddoneurl,
				method: uploaddonemethod,
				params: {
					fileId,
					contentId,
					batchcounts
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
		}))
	}
	let countMD5 = (file, batchsize) => {
		return new Promise((res, rej) => {
			const fileReader = new FileReader();
			const sparkMD5 = new SparkMD5();
			let index = 0;
			const loadFile = () => {
				const slice = file.slice(index, index + batchsize);
				fileReader.readAsBinaryString(slice);
			}
			loadFile();
			fileReader.onload = e => {
				sparkMD5.appendBinary(e.target.result);
				if (index < file.size) {
					index += batchsize;
					loadFile();
				} else {
					let md5 = sparkMD5.end();
					console.log(md5);
					res(md5);
				}
			};
		})
	}

	//拖拽事件
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
					console.log(file.type);
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

	//edtiableText按钮
	let hanldevaluechange = (index, value) => {
		let correct = true;
		let nextfileList = fileList.map((f, i) => {
			if (i == index) {
				for (let j = 0; j < fileList.length; j++) {
					if (fileList[j].filename == value && i != j) {//存在重名
						message.error(`存在重名的${value}`);
						correct = false;
						return f;
					}
				}
				return { ...f, filename: value };
			}
			return f;
		})
		setFileList(nextfileList);
		return correct;
	}
	let handlerdelete = (index) => {
		let nextfileList = fileList.filter((value, i) => index !== i);
		setFileList(nextfileList);
	}
	let handleraddtag = (index) => {
		setIsModalOpen(true);
	}

	//打标签modal
	const [isModalOpen, setIsModalOpen] = useState(false);
	const handleOk = () => {
		setIsModalOpen(false);
	};
	const handleCancel = () => {
		setIsModalOpen(false);
	};
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
							fileList.length ? (<Space direction="vertical" size="0">
								{
									fileList.map((file, index) => {
										return (
											<EditableText
												key={index}
												text={file.filename}
												onChange={(value) => hanldevaluechange(index, value)}
												addicons={[
													{
														title: "删除",
														node: <MyIcon
															type="icon-delete"
															onClick={handlerdelete.bind(this, index)}
														/>
													}, {
														title: "打标签",
														node: <MyIcon
															type="icon-add-tag"
															onClick={handleraddtag.bind(this, index)}
														/>,
													}
												]}
											/>
										)
									})
								}
							</Space>) : (
								<div>111</div>
							)}
						<Modal title="添加标签" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
							<p>Some contents...</p>
							<p>Some contents...</p>
							<p>Some contents...</p>
						</Modal>
					</div>
				</div>
				<Navlist classname={styles.navlist} />
			</Row>
		</>
	);
}

export default App;
