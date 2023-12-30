import styles from "./index.module.less";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
export default function Index() {
	let eyesRef = useRef(null);
	useEffect(() => {
		document.documentElement.style.height="100%";
		document.body.style.height="100%";
		document.body.style.background="#28254C";
		var pageX =  window.screen.width;
		var pageY =  window.screen.height;
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
			//verticalAxis
			mouseY = event.pageY;
			let yAxis = (pageY / 2 - mouseY) / pageY * 300;
			//horizontalAxis
			mouseX = event.pageX / -pageX;
			let xAxis = -mouseX * 100 - 100;
			console.log(mouseX,mouseY,xAxis,yAxis);
			eyesRef.current.style.transform='translate(' + xAxis + '%,' + (-yAxis) + '%)';
		};
		document.onmousemove=throttle(mousemoveFunc,10);
	}, []);
	return (
		<div className={styles.body}>
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
