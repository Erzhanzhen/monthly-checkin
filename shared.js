// ============ 原则数据 ============
var PRINCIPLES = [
  '你再不努力老家房子就被别人扒了！',
  '这个月养成习惯大于一切',
  '重回初中心流状态，专注一件事',
  '每小时要有具体产出',
  '做复利的事，不要每次都重新开始',
  '慎终如始，则无败事',
  '先做一个垃圾出来，再求完美',
  '不舒服就要找原因，不要麻木',
  '要有方法，而不是假努力'
];

// ============ 任务数据定义 ============
var TASKS = [
  // 一、习惯目标
  { id: 'h1', module: '习惯目标', emoji: '💤', title: '早睡目标', text: '10点躺床上，最晚10:30睡着，早6:30起床，确保8小时睡眠' },
  { id: 'h2', module: '习惯目标', emoji: '🥗', title: '防脱目标', text: '清淡饮食，不吃大油/奶油/奶茶，少喝茶，每周最多1次放纵大餐' },
  { id: 'h3', module: '习惯目标', emoji: '💪', title: '运动目标', text: '每周4次训练：2次胸肌训练 + 2次腹肌训练' },

  // 二、短视频目标
  { id: 'v1', module: '短视频目标', emoji: '🔍', title: '研究博主', text: '用AI研究两个博主的人设和选题思路' },
  { id: 'v2', module: '短视频目标', emoji: '🎬', title: '发布视频', text: '每两天发一个短视频，涨粉2000' },

  // 三、投资目标
  { id: 'i1', module: '投资目标', emoji: '🏗️', title: '黑客马拉松方案', text: '整理过往黑客松方案，策划完整黑客马拉松方案' },
  { id: 'i2', module: '投资目标', emoji: '📋', title: '新投资体系搭建', text: '完成一个流程的搭建，推进新投资体系' },
  { id: 'i3', module: '投资目标', emoji: '🤝', title: '发现项目', text: '想一个发现项目的方法，加一个创始人联系方式' },

  // 四、学习目标
  { id: 's1', module: '学习目标', emoji: '📖', title: '阅读书籍', text: '看挖掘用户需求的书籍30分钟' },
  { id: 's2', module: '学习目标', emoji: '🧠', title: '分析博主需求', text: '思考2个抖音博主人设对应的用户需求' },
  { id: 's3', module: '学习目标', emoji: '💡', title: '创业机会思考', text: '思考一个需求方向的创业项目机会' },
];

var MODULES = ['习惯目标', '短视频目标', '投资目标', '学习目标'];
var MODULE_EMOJIS = { '习惯目标': '🛌', '短视频目标': '📱', '投资目标': '💰', '学习目标': '📚' };

// ============ 数据管理 ============
var STORAGE_KEY = 'monthly_checkin_data';
var DATE_KEY = 'monthly_checkin_date';

function getToday() {
  var d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

function loadData() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch(e) { return {}; }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getTodayChecked() {
  var data = loadData();
  var today = getToday();
  return data[today] || {};
}

function setTaskChecked(taskId, checked) {
  var data = loadData();
  var today = getToday();
  if (!data[today]) data[today] = {};
  if (checked) {
    data[today][taskId] = Date.now();
  } else {
    delete data[today][taskId];
  }
  // 清理30天前的旧数据
  var cutoff = new Date(Date.now() - 30 * 24 * 3600 * 1000);
  for (var k in data) {
    if (data.hasOwnProperty(k) && new Date(k) < cutoff) delete data[k];
  }
  saveData(data);
}

function getStreak() {
  var data = loadData();
  var streak = 0;
  var d = new Date();
  while (true) {
    var dateStr = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
    var dayData = data[dateStr] || {};
    var checked = Object.keys(dayData).length;
    if (checked === 0) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

function getTotalCheckins() {
  var data = loadData();
  var total = 0;
  for (var day in data) {
    if (data.hasOwnProperty(day)) {
      total += Object.keys(data[day]).length;
    }
  }
  return total;
}

function formatTime(ts) {
  var d = new Date(ts);
  return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
}

// ============ 每小时打卡数据 ============
var HOURLY_KEY = 'monthly_hourly_data';

var WORK_SLOTS = [
  { id:'s1',  time:'06:30', end:'07:30', label:'06:30-07:30' },
  { id:'s2',  time:'07:30', end:'08:30', label:'07:30-08:30' },
  { id:'s3',  time:'08:30', end:'09:30', label:'08:30-09:30' },
  { id:'s4',  time:'09:30', end:'10:30', label:'09:30-10:30' },
  { id:'s5',  time:'10:30', end:'11:30', label:'10:30-11:30' },
  { id:'s6',  time:'11:30', end:'12:30', label:'11:30-12:30' },
  { id:'s7',  time:'12:30', end:'13:30', label:'12:30-13:30' },
  { id:'s8',  time:'13:30', end:'14:30', label:'13:30-14:30' },
  { id:'s9',  time:'14:30', end:'15:30', label:'14:30-15:30' },
  { id:'s10', time:'15:30', end:'16:30', label:'15:30-16:30' },
  { id:'s11', time:'16:30', end:'17:30', label:'16:30-17:30' },
  { id:'s12', time:'17:30', end:'18:30', label:'17:30-18:30' },
  { id:'s13', time:'18:30', end:'19:30', label:'18:30-19:30' },
  { id:'s14', time:'19:30', end:'20:30', label:'19:30-20:30' },
  { id:'s15', time:'20:30', end:'21:30', label:'20:30-21:30' },
];

var NIGHT_SLOTS = [
  { id:'n1', time:'21:30', end:'22:00', label:'21:30-22:00', goal:'🌙 自由活动，放松休息' },
  { id:'n2', time:'22:00', end:'22:30', label:'22:00-22:30', goal:'🛏️ 躺在床上，准备入睡' },
  { id:'n3', time:'22:30', end:'06:30', label:'22:30前入睡', goal:'😴 入睡，确保充足睡眠' },
  { id:'n4', time:'06:30', end:'—', label:'06:30起床', goal:'⏰ 早起，开始新的一天' },
];

var CYCLE_END = new Date(2026, 6, 12);

function loadHourly() {
  try { var r = localStorage.getItem(HOURLY_KEY); return r ? JSON.parse(r) : {}; }
  catch(e) { return {}; }
}
function saveHourly(data) { localStorage.setItem(HOURLY_KEY, JSON.stringify(data)); }
function getTodayHourly() {
  var d = loadHourly();
  var t = getToday();
  if (!d[t]) d[t] = { goals: {}, done: {} };
  return d[t];
}

function setHourlyGoal(slotId, type, goal) {
  var d = loadHourly();
  var t = getToday();
  if (!d[t]) d[t] = { goals: {}, done: {} };
  if (!d[t].goals[slotId]) d[t].goals[slotId] = {};
  d[t].goals[slotId][type] = goal;
  saveHourly(d);
}

function getHourlyGoal(today, slotId, type) {
  var g = today.goals[slotId];
  if (typeof g === 'string') return ''; // 兼容旧数据
  return (g && g[type]) || '';
}

function toggleHourlyDone(slotId, type) {
  var d = loadHourly();
  var t = getToday();
  if (!d[t]) d[t] = { goals: {}, done: {} };
  if (!d[t].done[slotId] || typeof d[t].done[slotId] === 'boolean') {
    d[t].done[slotId] = {};
  }
  d[t].done[slotId][type] = !(d[t].done[slotId][type] === true);
  saveHourly(d);
  renderHourly();
}

function isHourlyDone(today, slotId, type) {
  var d = today.done[slotId];
  if (typeof d === 'boolean') return d; // 兼容旧数据
  return !!(d && d[type]);
}

function clearAllHourly() {
  if (!confirm('确定清空今日所有时刻目标和完成状态？')) return;
  var d = loadHourly();
  d[getToday()] = { goals: {}, done: {} };
  saveHourly(d);
  renderHourly();
}

function copyYesterdayHourly() {
  var d = loadHourly();
  var yesterday = new Date(Date.now() - 86400000);
  var yk = yesterday.getFullYear()+'-'+String(yesterday.getMonth()+1).padStart(2,'0')+'-'+String(yesterday.getDate()).padStart(2,'0');
  if (!d[yk] || Object.keys(d[yk].goals||{}).length === 0) {
    alert('昨日无数据可复制');
    return;
  }
  d[getToday()] = { goals: Object.assign({}, d[yk].goals), done: {} };
  saveHourly(d);
  renderHourly();
}
