export const defaultFuture = {
  count: 4,
  monthInterval: 3
}

export const defaultPast = {
  count: 12,
  monthInterval: 1
}

export default function getTerms(date, future = false, past = false) {
  if (future === true) {
    future = defaultFuture
  } else if (future === false) {
    future = {count:0}
  }

  if (past === true) {
    past = defaultPast
  } else if (past === false) {
    past = {count:0}
  }

  let startDate
  if (date instanceof Date) {
    startDate = date
  } else {
    startDate = new Date(date)
  }

  const result = []

  for (var i = 1; i <= future['count']; i++) {
    const date = new Date(
      startDate.getFullYear() + Math.floor(i*future['monthInterval']/12),
      startDate.getMonth() + i*future['monthInterval']%12,
      startDate.getDate(),
      startDate.getHours(),
      startDate.getMinutes(),
      startDate.getSeconds()
    ).getTime()
    result.push(date)
  }

  for (i = 1; i <= past['count']; i++) {
    const date = new Date(
      startDate.getFullYear() - Math.floor(i*past['monthInterval']/12),
      startDate.getMonth() - i*past['monthInterval']%12,
      startDate.getDate(),
      startDate.getHours(),
      startDate.getMinutes(),
      startDate.getSeconds()
    ).getTime()
    result.push(date)
  }

  result.sort((a,b) => a-b)

  return result
}
