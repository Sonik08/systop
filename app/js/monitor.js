const path = require('path')
const osu = require('node-os-utils')
const cpu = osu.cpu
const mem = osu.mem
const os = osu.os

let cpuOverload = 5
let memoryOverload = 90

let alertFrequency = 1

// Run every 2 seconds
setInterval(() => {
  // CPU usage 
  cpu.usage().then(info => {
    document.getElementById('cpu-usage').innerText = parseFloat(info).toFixed(2) + '%';

    document.getElementById('cpu-progress').style.width = parseFloat(info).toFixed(2) + '%'

    // make progress bar red on cpuOverload
    if (info >= cpuOverload) {
      document.getElementById('cpu-progress').style.background = 'red'
    } else {
      document.getElementById('cpu-progress').style.background = '#30c88b'
    }

    if( info >= cpuOverload && runNotify(alertFrequency)){
        notifyUser({
          title: 'Cpu Overload',
          body: `CPU is over ${cpuOverload}%`,
          icon: path.join(__dirname, 'img', 'cpu-hot.jpg')
        })
    
        localStorage.setItem('lastNotify', +new Date())
    }
  })

  // CPU free
  cpu.free().then(info => {
    document.getElementById('cpu-free').innerText = parseFloat(info).toFixed(2) + '%'
  })

  // Uptime
  document.getElementById('sys-uptime').innerText = secondsToDhms(os.uptime())
  
  

}, 1000)

// Set model
document.getElementById('cpu-model').innerText = cpu.model()

// Computer name
document.getElementById('comp-name').innerText = os.hostname()

// OS
document.getElementById('os').innerText = `${os.type()} ${os.arch()}`

// Total Memory
mem.info().then(info => {
  document.getElementById('mem-total').innerText = info.totalMemMb
})

function secondsToDhms(seconds){
  seconds = +seconds
  const days = Math.floor(seconds / (3600 * 24))
  const hours = Math.floor((seconds % (3600 * 24)) / 3600) 
  const minutes = Math.floor((seconds % 3600)/ 60)
  seconds = Math.floor(seconds % 60)
  return `${days}d, ${hours}h, ${minutes}m, ${seconds}s`
}

// Send Notification
function notifyUser(options) {
  new Notification(options.title, options)
}

// Check time passed for the Notification
function runNotify(frequency){
  if(localStorage.getItem('lastNotify') === null) {
    // Store Timestamp
    localStorage.setItem('lastNotify', +new Date())
    return true
  } 
  const notifiyTime = new Date(parseInt(localStorage.getItem('lastNotify')))
  const now = new Date();
  const diffTime = Math.abs(now - notifiyTime)
  const minutesPassed = Math.ceil(diffTime / (1000*60))

  if(minutesPassed > frequency){
    return true
  } else {
    return false
  }
}