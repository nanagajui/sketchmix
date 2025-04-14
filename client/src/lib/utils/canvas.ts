export function getCoordinates(
  e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent, 
  canvas: HTMLCanvasElement
): [number, number] {
  const rect = canvas.getBoundingClientRect();
  let x, y;
  
  if ('touches' in e) {
    // Touch event
    const touch = e.touches[0];
    x = touch.clientX - rect.left;
    y = touch.clientY - rect.top;
  } else {
    // Mouse event
    x = (e as MouseEvent).clientX - rect.left;
    y = (e as MouseEvent).clientY - rect.top;
  }
  
  return [x, y];
}

export function drawLine(
  ctx: CanvasRenderingContext2D, 
  x1: number, 
  y1: number, 
  x2: number, 
  y2: number, 
  size: number, 
  color: string
) {
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = size;
  
  if (color === 'eraser') {
    ctx.strokeStyle = '#ffffff';
    ctx.globalCompositeOperation = 'destination-out';
  } else {
    ctx.strokeStyle = color;
    ctx.globalCompositeOperation = 'source-over';
  }
  
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

export function isCanvasEmpty(canvas: HTMLCanvasElement): boolean {
  const ctx = canvas.getContext('2d');
  if (!ctx) return true;
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  return !imageData.some(channel => channel !== 0);
}

export function downloadCanvasAsImage(canvas: HTMLCanvasElement, filename: string = 'drawing.png') {
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
