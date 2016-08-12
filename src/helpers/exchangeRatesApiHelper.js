import XMLHttpRequest from 'xhr2'

const baseURL = 'http://api.fixer.io/'

export default function getExchangeRate(date, currencies, baseCurrency = 'USD', callback) {
  const request = new XMLHttpRequest()
  if (callback) {
    request.onreadystatechange = () => {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          const response = JSON.parse(request.responseText)['rates']
          const result = Object.keys(response).map((key) => {
            return {
              currency: key,
              term: date instanceof Date ? date.getTime() : date,
              rate: response[key]
            }
          })
          callback(result)
        } else {
          callback({})
        }
      }
    }
  }

  let url = baseURL
  let tempDate = date
  if (date instanceof Date) {
    tempDate = date
  } else {
    const offset = new Date().getTimezoneOffset()
    tempDate = new Date(date - offset*60000)
  }
  url += tempDate.toISOString().substring(0, 10)

  url += '?symbols=' + currencies + '&base=' + baseCurrency

  request.open('GET', url, true)
  request.send(null)
}
