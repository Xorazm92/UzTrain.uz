import { MouseEvent } from 'react';

const openContextMenu = (e: MouseEvent<HTMLElement>) => {
  e.preventDefault();

  const contextMenu = document.getElementById('context-menu');
  // console.log(contextMenu);

  contextMenu!.style.transition = 'none';
  contextMenu!.style.opacity = '1';

  let x = e.nativeEvent.offsetX;
  let y = e.nativeEvent.offsetY;

  const winWidth = window.innerWidth;
  const winHeight = window.innerHeight;
  const cmWidth = contextMenu!.offsetWidth;
  const cmHeight = contextMenu!.offsetHeight;

  x = x > winWidth - cmWidth ? winWidth - cmWidth : x;
  y = y > winHeight - cmHeight ? winHeight - cmHeight : y;

  contextMenu!.style.left = `${x}px`;
  contextMenu!.style.top = `${y}px`;


}

export default openContextMenu