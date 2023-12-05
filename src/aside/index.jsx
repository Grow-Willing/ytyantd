import { CaretLeftFilled } from '@ant-design/icons';
import PropTypes from 'prop-types';
import './index.less'

export default function Index({isshow,switchContentShow,children}) {
	Index.propTypes = {
		isshow: PropTypes.bool,
		switchContentShow: PropTypes.func,
		children: PropTypes.node
	}
  return (
	<div className={isshow?"relativeBox show":"relativeBox"}>
		<CaretLeftFilled className='arrow'onClick={switchContentShow}/>
		<div className='content'>
			{children}
		</div>
	</div>
  )
}
