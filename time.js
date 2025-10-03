const meetTime = new Date(2025, 7, 17, 8, 16, 9); // 认识于 2025年8月17日08:16:09
// const meetTime = new Date(2025, 8, 29, 9, 40, 9); // 在一起于 2025年9月29日09:40:09


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
