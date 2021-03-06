import React, { Component } from 'react'
import Papa from 'papaparse'

export default function(file) {
  const [rows, setRows] = React.useState([])
  React.useEffect(() => {
    async function getData() {
      const response = await fetch(file)
      const reader = response.body.getReader()
      const result = await reader.read() // raw array
      const decoder = new TextDecoder('utf-8')
      const csv = decoder.decode(result.value) // the csv text
      const results = Papa.parse(csv, { header: true }) // object with { data, errors, meta }
      const rows = results.data // array of objects
      setRows(rows)
    }
    getData()
  }, []) // [] means just do this once, after initial render
  console.log(rows);
  return (
    <div className="app">
      {/* <Table cols={tripColumns} rows={rows} /> */}
    </div>
  )
}

