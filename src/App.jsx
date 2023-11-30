import { Input } from 'antd';
import './App.less'
function App() {

  return (
    <>
		<div className="App">
			<div className="middle">
				<div className="logo">
					搜索界面
				</div>
				<div className='searchbar'>
					<Input prefix="hhh" bordered={false} />
				</div>
			</div>
		</div>
    </>
  )
}

export default App
