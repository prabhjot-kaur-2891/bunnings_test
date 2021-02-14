import React, { Component } from 'react'
import InputData from './InputData'
import { CSVLink, CSVDownload } from "react-csv";

function App() {
  let CatalogA = InputData('/input/catalogA.csv');
  let CatalogB = InputData('/input/catalogB.csv');
  let BarcodesA = InputData('/input/barcodesA.csv');
  let BarcodesB = InputData('/input/barcodesB.csv');

  // Merge Barcodes of both the catalogs
  const mergedBarcodes = BarcodesA.concat(BarcodesB);
  //console.log('mergeB',mergeBarcodes);

  // Find the duplicate barcodes
  const findDuplicates = mergedBarcodes.reduce((a, e) => {
    a[e.Barcode] = ++a[e.Barcode] || 0;
    return a;
  }, {});

  const duplicates = mergedBarcodes.filter(e => findDuplicates[e.Barcode]);
  const duplicateSKUs = getUniqueListBy(duplicates, 'SKU'); // Find the SKUs of duplicate products

  // Remove the duplicate products from catalog B
  var uniqSKU_A = [];
  var uniqSKU_B = [];
  if(duplicateSKUs.length > 0) {
    for(var i = 0; i < duplicateSKUs.length; i++) {
      let SKU = (duplicateSKUs[i].SKU);
      BarcodesB = BarcodesB.filter(item => item.SKU.indexOf(SKU) === -1);
    }
    uniqSKU_B = getUniqueListBy(BarcodesB, ['SKU']);
  }

  uniqSKU_A = getUniqueListBy(BarcodesA, ['SKU']);
  var result = [];
  if(uniqSKU_A.length > 0) {
    uniqSKU_A.forEach(function (productsObj, index) {
      let SKU = productsObj['SKU'];
      let productObj = CatalogA.find(item => item.SKU.indexOf(SKU) !== -1);
      let obj = {
        SKU: productObj.SKU,
        Description: productObj.Description,
        Source: 'A'
      }
      result.push(obj);    
    });
  }
  
  if(uniqSKU_B.length > 0) {
    uniqSKU_B.forEach(function (productsObj, index) {
      let SKU = productsObj['SKU'];
      let productObj = CatalogB.find(item => item.SKU.indexOf(SKU) !== -1);
      let obj = {
        SKU: productObj.SKU,
        Description: productObj.Description,
        Source: 'B'
      }
      result.push(obj);    
    });
  }
  console.log(result);

  function getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
  }

  const headers = [
    { label: "SKU", key: "SKU" },
    { label: "Description", key: "Description" },
    { label: "Source", key: "Source" }
  ];

  const csvReport = {
    data: result,
    headers: headers,
    filename: 'result_output.csv'
  };

  return (
    <div className="App">
      <CSVLink {...csvReport}>Export to CSV</CSVLink>
    </div>
  );
}

export default App;
