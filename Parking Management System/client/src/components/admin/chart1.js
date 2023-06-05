import axios from 'axios'

const data1 = {
  labels: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],
  datasets: [
    {
      label: 'New Owner Added',
      borderColor: '#2C3333',
      data: []
    }
  ]
}

const data2 = {
  labels: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],
  datasets: [
    {
      label: 'New Vehicle Added',
      borderColor: '#2C3333',
      data: []
    }
  ]
}

const options = {
  responsive: true
}

const fetchData = () => {
  return new Promise((resolve, reject) => {
    axios
      .get('http://localhost:8001/admin/get-chart')
      .then((result) => {
        const data = result.data
        data1.datasets[0].data = data.arr1
        data2.datasets[0].data = data.arr2
        resolve()
      })
      .catch((error) => {
        reject(error)
      })
  })
}

fetchData()
  .then(() => {

  })
  .catch((error) => {
    console.error(error)
  })
export { data1, data2, options }
