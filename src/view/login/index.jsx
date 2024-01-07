import { Input, Space, Checkbox, Button, Row, message } from "antd";
import styles from "./index.module.less";
import { useState } from "react";
import axios from "axios";
import { useNavigate  } from "react-router-dom";
import urlconfig from "@/url/index";
import Navlist from '@/component/navlist';
function App() {
	let {url:loginurl,method:loginmethod}=urlconfig.login;
	const navigate = useNavigate();
	let [username, updateUsername] = useState(""),
		[password, updatePassword] = useState("");
	let login = () => {
		axios({
			method: loginmethod,
			url: loginurl,
			data: { username: username, password: password },
			timeout:5000
		}).then(function (response) {
			let {code,data:{token},msg}= response.data;
			axios.defaults.headers['Authorization']=token;
			console.log(code,token,msg);
			if(token){
				navigate(-1);
			}
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
	};
	let getinfo=()=>{
		axios({
			method: "get",
			url: "/api/login",
			data: { username: username, password: password },
		}).then(function (response) {
			console.log(response.data);
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
		});
	}
	return (
		<>
			<div className={styles.blackContent}>
				<div className={styles.whiteContent}></div>
				<div className={styles.middle}>
					<div className={styles.halfContent}>
						<Space
							direction="vertical"
							size="middle"
							className={styles.leftform}>
							用户名
							<div className={styles.inputContent}>
								<Input
									style={{ boxShadow: "none" }}
									bordered={false}
									onChange={(e) => {
										updateUsername(e.target.value);
									}}
									onPressEnter={login}
								/>
							</div>
							密码
							<div className={styles.inputContent}>
								<Input.Password
									style={{ boxShadow: "none" }}
									bordered={false}
									onChange={(e) => {
										updatePassword(e.target.value);
									}}
									onPressEnter={login}
								/>
							</div>
							<Row justify={"space-between"} align={"middle"}>
								<Checkbox>记住我</Checkbox>
								<Button type="link">忘记密码？</Button>
							</Row>
							<Button type="primary" block onClick={login}>
								登录
							</Button>
						</Space>
					</div>
					<div
						className={styles.halfContent}
						style={{
							transform: "translateX(-1px)",
							backgroundColor: "#1c3b67",
						}}>
						<Space
							direction="vertical"
							size="middle"
							className={styles.rightform}>
							用户名
							<div className={styles.inputContent}>
								<Input style={{ boxShadow: "none" }} bordered={false} />
							</div>
							密码
							<div className={styles.inputContent}>
								<Input.Password
									style={{ boxShadow: "none" }}
									bordered={false}
								/>
							</div>
							<Row justify={"space-between"} align={"middle"}>
								<Checkbox style={{ color: "white" }}>记住我</Checkbox>
								<Button type="link" danger>
									忘记密码？
								</Button>
							</Row>
							<Button type="primary" block danger onClick={getinfo}>
								登录
							</Button>
						</Space>
					</div>
				</div>
				<Navlist classname={styles.navlist}/>
			</div>
		</>
	);
}

export default App;
