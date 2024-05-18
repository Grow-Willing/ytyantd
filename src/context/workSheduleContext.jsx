import { createContext, useContext, useReducer } from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);
const WorkSheduleContext = createContext(null);

const WorkSheduleDispatchContext = createContext(null);
import axios from "axios";

const initialWorkShedulestate = {
	people:{
		columns:[
			{
				title: '姓名',
				dataIndex: 'name',
				default:"新员工",
			},
			{
				title: '资质',
				dataIndex: 'qualification',
				type:"list",
				default:[],
			},
			{
				title:"等价组",
				dataIndex:"equalGroup", 
				type:"select",
				default:null,
				description:"同组的成员班表顺序一样，但可能会错开在不同天；不同组互不影响"
			},
		],
		key:0,
		data:[]
	},
	shifts:{
		columns:[
			{
				title: '班名称',
				dataIndex: 'name',
				default:"新班",
			},
			{
				title: '上班人数',
				dataIndex: 'peopleNeedCount',
				type:"range",
				default:[1,1],
				get max(){
					return initialWorkShedulestate.people.data.length;
				}
			},
			{
				title: '班时长',
				dataIndex: 'length',
				type:"number",
				default:1,
				description:"此班所算工时"
			},
			{
				title: '一轮排班上班天数',
				dataIndex: 'bancount',
				type:"number",
				default:1,
			},
			{
				title: '最短连续天数',
				dataIndex: 'minlength',
				type:"number",
				default:0,
			},
			{
				title: '最大连续天数',
				dataIndex: 'maxlength',
				type:"number",
				default:4,
			},
			{
				title: '资质',
				dataIndex: 'qualification',
				description:"需要什么资质才可以上此班",
				type:"list",
				default:[],
			},
		],
		key:0,
		data:[]
	},
	dependency:{
		equalGroup:{
			used:["people"],
			value:[
				"第一小队",
				"第二小队",
				"第三小队",
			]
		},
		qualification:{
			used:["people","shifts"],
			value:[
				"CCNA",
				"CCNP",
				"CCIE"
			]
		}
	},
	// 整体设置项
	config:{
		template:{
			offday_config:{
				"title":"休息日设置",
				children:[
					{
						title: '最短连续天数',
						type: Number,
						name:"minlength",
					},
					{
						title: '最大连续天数',
						type: Number,
						name:"maxlength"
					},
				]
				
			},
		},
		data:{
			offday_config:{
				"minlength":2,
				"maxlength":8,
			},
		}
	},
	require:[],
	// 保存求解日期
	day:{
		_range:[dayjs(),dayjs()],
		set range(x){
			if(!Array.isArray(x)) return;
			if(x.length !== 2) return;
			this._range[0]=dayjs.isDayjs(x[0])?x[0]:dayjs(x[0]);
			this._range[1]=dayjs.isDayjs(x[1])?x[1]:dayjs(x[1]);
		},
		get range(){
			return this._range;
		},
		get input_num_days(){
			return Math.abs(this.range[0].diff(this.range[1],"day"))+1;
		},
	},
	//请求返回的数据
	request:{
		loading:false,
		data:[]
	}
};
export function WorkSheduleProvider({ children }) {
	const [WorkShedule, dispatch] = useReducer(
		WorkSheduleReducer,
		initialWorkShedulestate
	);

	return (
		<WorkSheduleContext.Provider value={WorkShedule}>
			<WorkSheduleDispatchContext.Provider value={dispatch}>
				{children}
			</WorkSheduleDispatchContext.Provider>
		</WorkSheduleContext.Provider>
	);
}

export function useWorkShedule() {
	return useContext(WorkSheduleContext);
}

export function useWorkSheduleDispatch() {
	return useContext(WorkSheduleDispatchContext);
}

function WorkSheduleReducer(lastWorkShedule, action) {
	switch (action.type) {
		case 'setColumns': {
			if(action.tableName&&action.columns&&Object.keys(lastWorkShedule).includes(action.tableName)){
				let newstate={...lastWorkShedule};
				if(typeof action.columns === "function"){
					newstate[action.tableName]["columns"] = action.columns(lastWorkShedule[action.tableName]["columns"]);
				}else{
					newstate[action.tableName]["columns"] = action.columns;
				}
				return newstate;
			}
			return lastWorkShedule;
		}
		case 'importData': {
			let {people,shifts,dependency,config} = action.data;
			console.log(people,shifts,dependency,config);
			if(people&&shifts&&dependency&&config){
				let newstate={...lastWorkShedule};
				newstate["people"].data=[...people.data];
				newstate["shifts"].data=[...shifts.data];
				newstate["day"].range=config["day"];
				if(config["offday_config"]&&config["offday_config"].length==2){
					let offday_config={
						"minlength":config["offday_config"][0],
						"maxlength":config["offday_config"][1],
					}
					newstate["config"].data["offday_config"]=offday_config;
				}
				dependency.forEach((v,i)=>{
					newstate.dependency[v.name].value=[...v.value];
				})
				return newstate;
			}
			return lastWorkShedule;
		}
		case 'setData': {
			if(action.tableName&&action.data&&Object.keys(lastWorkShedule).includes(action.tableName)){
				let newstate={...lastWorkShedule};
				if(typeof action.data === "function"){
					newstate[action.tableName]["data"] = action.data(lastWorkShedule[action.tableName]["data"]);
				}else{
					newstate[action.tableName]["data"] = action.data;
				}
				return newstate;
			}
			return lastWorkShedule;
		}
		case 'setKey': {
			if(action.tableName&&action.key&&Object.keys(lastWorkShedule).includes(action.tableName)){
				let newstate={...lastWorkShedule};
				if(typeof action.key === "function"){
					newstate[action.tableName]["key"] = action.key(lastWorkShedule[action.tableName]["key"]);
				}else{
					newstate[action.tableName]["key"] = action.key;
				}
				return newstate;
			}
			return lastWorkShedule;
		}
		case 'setDependency':{
			if(action.key&&Object.keys(lastWorkShedule.dependency).includes(action.key)){
				let newstate={...lastWorkShedule};
				if(Array.isArray(newstate.dependency[action.key].value)){
					if(typeof action.index === 'number'){
						newstate.dependency[action.key].value[action.index]=action.value;
					}else{
						newstate.dependency[action.key].value=action.value;
						newstate.dependency[action.key].used.forEach(element => {
							newstate[element].data=newstate[element].data.map(v=>{
								let newret={...v};
								newret[action.key]=[];
								return newret;
							})
						});
					}
				}
				return newstate;
			}
			return lastWorkShedule;
		}
		case 'setinput_num_days':{
			if(typeof action.data == 'number'){
				let newstate={...lastWorkShedule};
				newstate.input_num_days = action.data;
				return newstate;
			}
			return lastWorkShedule;
		}
		case 'setday':{
			if(Array.isArray(action.data)&&action.data.length==2&&dayjs.isDayjs(action.data[0])&&dayjs.isDayjs(action.data[1])){
				let newstate={...lastWorkShedule};
				newstate.day.range = action.data;
				return newstate;
			}
			return lastWorkShedule;
		}
		case 'setconfig':{
			try {
				if(Object.keys(lastWorkShedule.config.template).includes(action.key)&&action.name&&action.data){
					let newstate={...lastWorkShedule};
					newstate.config.data[action.key][action.name] = action.data;
					return newstate;
				}
			} catch (error) {
				console.log(error);
				return lastWorkShedule;
			}
			return lastWorkShedule;
		}
		case 'setrequest':{
			try {
				if(action.loading){
					let newstate={...lastWorkShedule};
					newstate.request.loading = true;
					return newstate;
				}else{
					let newstate={...lastWorkShedule};
					newstate.request.loading = false;
					if(Array.isArray(action.data)){
						newstate.request.data = action.data[0];
					}else{
						newstate.request.data = null;
					}
					return newstate;
				}
			} catch (error) {
				console.log(error);
				return lastWorkShedule;
			}
		}
		case 'setRequire':{
			try {
				let {n,s,d,v}=action.payload;
				if(!n && n!=0 | !s && s!=0 | !d && d!=0 | !v && v!=0 ) {
					let newstate={...lastWorkShedule};
					let newitem={n,s,d,v};
					newstate.require=[...newstate.require,newitem];
					return newstate;
				}else{
					return lastWorkShedule;
				}
			} catch (error) {
				console.log(error);
				return lastWorkShedule;
			}
		}
		default: {
			throw Error('Unknown action: ' + action.type);
		}
	}
}
