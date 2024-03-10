import { useState, useEffect } from 'react';

export function useContextMenuStatus(closefunction=null) {
  const [contextMenu, setContextMenu] = useState(false);
  useEffect(() => {
    function handleclick() {
		// close
		setContextMenu(false);
		// 触发关闭函数用以更改内部控制变量
		closefunction();
    }
    function handleContextmenu() {
		// open
		setContextMenu(true);
    }
    window.addEventListener('click', handleclick);
    window.addEventListener('contextmenu', handleContextmenu);
    return () => {
      window.removeEventListener('click', handleclick);
      window.removeEventListener('contextmenu', handleContextmenu);
    };
  }, []);
  return contextMenu;
}
