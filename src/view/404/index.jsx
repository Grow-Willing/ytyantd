import styles from "./index.module.less";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
export default function Index() {
	let eyesRef = useRef(null);
	// useEffect(() => {
	// 	var mouseY = 0;
	// 	var mouseX = 0;
	// 	function throttle(func, wait) {
	// 		let timeout;
	// 		return function() {
	// 			let context = this;
	// 			let args = arguments;
	// 			if (!timeout) {
	// 				timeout = setTimeout(() => {
	// 					timeout = null;
	// 					func.apply(context, args)
	// 				}, wait)
	// 			}
	// 		}
	// 	}
	// 	let mousemoveFunc=function (event) {
	// 		var pageX =  document.documentElement.clientWidth;
	// 		var pageY =  document.documentElement.clientHeight;
	// 		//verticalAxis
	// 		mouseY = event.pageY;
	// 		let yAxis = (pageY / 2 - mouseY) / pageY * 300;
	// 		//horizontalAxis
	// 		mouseX = event.pageX / -pageX;
	// 		let xAxis = -mouseX * 100 - 100;
	// 		console.log(mouseX,mouseY,xAxis,yAxis);
	// 		eyesRef.current.style.transform='translate(' + xAxis + '%,' + (-yAxis) + '%)';
	// 	};
	// 	document.onmousemove=throttle(mousemoveFunc,10);
	// 	return ()=>{
	// 		document.onmousemove=null;
	// 	}
	// }, []);
	var mouseY = 0;
	var mouseX = 0;
	function throttle(func, wait) {
		let timeout;
		return function() {
			let context = this;
			let args = arguments;
			if (!timeout) {
				timeout = setTimeout(() => {
					timeout = null;
					func.apply(context, args)
				}, wait)
			}
		}
	}
	let mousemoveFunc=function (event) {
		var pageX =  document.documentElement.clientWidth;
		var pageY =  document.documentElement.clientHeight;
		//verticalAxis
		mouseY = event.pageY;
		let yAxis = (pageY / 2 - mouseY) / pageY * 300;
		//horizontalAxis
		mouseX = event.pageX / -pageX;
		let xAxis = -mouseX * 100 - 100;
		console.log(mouseX,mouseY,xAxis,yAxis);
		eyesRef.current.style.transform='translate(' + xAxis + '%,' + (-yAxis) + '%)';
	};
	return (
		<div className={styles.body} onMouseMove={throttle(mousemoveFunc,10)}>
			<div className={styles.box}>
				<div className={styles.box__ghost}>
					<div className={styles.symbol}></div>
					<div className={styles.symbol}></div>
					<div className={styles.symbol}></div>
					<div className={styles.symbol}></div>
					<div className={styles.symbol}></div>
					<div className={styles.symbol}></div>

					<div className={styles.box__ghost_container}>
						<div className={styles.box__ghost_eyes} ref={eyesRef}>
							<div className={styles.box__eye_left}></div>
							<div className={styles.box__eye_right}></div>
						</div>
						<div className={styles.box__ghost_bottom}>
							<div></div>
							<div></div>
							<div></div>
							<div></div>
							<div></div>
						</div>
					</div>
					<div className={styles.box__ghost_shadow}></div>
				</div>

				<div className={styles.box__description}>
					<div className={styles.box__description_container}>
						<div className={styles.box__description_title}>404错误！</div>
						<div className={styles.box__description_text}>
							看来我们找不到你要找的那一页
						</div>
					</div>

					<Link to={-1} className={styles.box__button}>
						返回
					</Link>
				</div>
			</div>
		</div>
	);
}
