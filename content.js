function getTodayDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = ("0" + (today.getMonth() + 1)).slice(-2)
  const day = ("0" + today.getDate()).slice(-2)
  return `${year}-${month}-${day}`
}

function clickRowWithTodayDate() {
  const today = getTodayDate()
  const table = document.querySelector('table.access-table')
  if (!table) return

  const rows = table.querySelectorAll('tbody tr')
  rows.forEach(row => {
    const dateCell = row.querySelector('td')
    if (dateCell && dateCell.textContent.trim() === today) {
      const lastCell = row.querySelector('td:nth-child(5)')
      const divElement = lastCell.querySelector('div')
      
      if (divElement) {
        divElement.click()
      }
    }
  })
}

function getAccessTable() {
  const accessTable = document.querySelector('table.access-details')
  return accessTable
}

function getSwipeDetailsTable() {
  const swipeDetailsTable = document.querySelector('table.swipe-details')
  return swipeDetailsTable
}

function getRequiredExitTimes(entryTimes, exitTimes) {
  function parseTime(timeStr) {
      const [h, m, s] = timeStr.split(":").map(Number)
      const now = new Date()
      now.setHours(h, m, s, 0)
      return now
  }
  
  let totalTimeMs = 0
  const pairCount = Math.min(entryTimes.length, exitTimes.length)

  for (let i = 0; i < pairCount; i++) {
      const entry = parseTime(entryTimes[i])
      const exit = parseTime(exitTimes[i])
      totalTimeMs += exit - entry
  }
  
  if (entryTimes.length > exitTimes.length) {
      const lastEntry = parseTime(entryTimes[entryTimes.length - 1])
      const now = new Date()
      totalTimeMs += now - lastEntry
  }
  
  const fourHoursMs = 4 * 60 * 60 * 1000
  const sixHoursMs = 6 * 60 * 60 * 1000
  
  const remaining4h = fourHoursMs - totalTimeMs
  const remaining6h = sixHoursMs - totalTimeMs
  
  const now = new Date()
  const exitAt4h = new Date(now.getTime() + Math.max(0, remaining4h))
  const exitAt6h = new Date(now.getTime() + Math.max(0, remaining6h))
  
  const formatTime = (date) =>
      date.toTimeString().split(" ")[0]

  return {
      canLeaveAt4Hours: formatTime(exitAt4h),
      canLeaveAt6Hours: formatTime(exitAt6h),
      totalHoursSoFar: (totalTimeMs / (1000 * 60 * 60)).toFixed(2),
      lastEntry: entryTimes[entryTimes.length - 1]
  }
}

function calculateEntryExitTimes() {
  const today = getTodayDate()
  const table = document.querySelector('table.swipe-details')
  if (!table) return

  const rows = table.querySelectorAll('tbody tr')
  let entryTimes = []
  let exitTimes = []

  rows.forEach(row => {
    const dateCell = row.querySelector('td:nth-child(1)')
    const timeCell = row.querySelector('td:nth-child(2)')
    const actionCell = row.querySelector('td:nth-child(4)')
    
    if (dateCell && dateCell.textContent.trim() === today) {
      const time = timeCell ? timeCell.textContent.trim() : null
      const action = actionCell ? actionCell.textContent.trim() : null

      if (action === "Entry To Work Area") {
        entryTimes.push(time)
      } else if (action === "Exit From Work Area") {
        exitTimes.push(time)
      }
    }
  })


  return getRequiredExitTimes(entryTimes, exitTimes)
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "open-today-swipe-detail") {
    const swipeDetailsTable = getSwipeDetailsTable()
    if (!swipeDetailsTable) {
      clickRowWithTodayDate()
    }
    sendResponse(null)
  }
  if (msg.type === "action-load-time") {

    const result = calculateEntryExitTimes()
    sendResponse(result)
  }
  // return true  // Keep the message channel open for asynchronous response
})
