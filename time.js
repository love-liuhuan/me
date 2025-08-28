// 设定认识的时间，月份从 0 开始，所以 8 月对应 7 
const meetTime = new Date(2025, 7, 25, 0, 45, 9); 

function updateTimer() {
  const now = new Date();
  const timeDiff = now - meetTime; 

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  // 更新页面上的时间显示
  document.getElementById('days').textContent = days;
  document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
  document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
  document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

// 初始调用一次，确保页面加载就有正确时间
updateTimer();
// 每隔 1 秒更新一次时间
setInterval(updateTimer, 1000); 