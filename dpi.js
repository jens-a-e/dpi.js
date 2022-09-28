const dpcm = dpi => dpi/2.54

let [binary, script, pxw, pxh, dpimin, dpimax] = process.argv

pxw = Number(pxw)
pxh = Number(pxh)
dpimin = Number(dpimin || 0)
dpimax = Number(dpimax || 600)

// console.log({pxw,pxh,dpimin,dpimax})

if(![pxw, pxh, dpimin, dpimax].every(arg => arg != undefined || arg != null)) process.exit(1)

const findResolutions = pixels => {
  const results = []
  for(let dpi = dpimin; dpi<dpimax; dpi++) {
    let cm = pixels/dpcm(dpi)
    if(Number.isInteger(cm)) {
      results.push({dpi, cm})
    }
  }
  return results
}

const widths = findResolutions(pxw)
const heights = findResolutions(pxh)

const findDPI = (match, map) => map.find(({dpi}) => dpi == match)

//console.log(widths)
//console.log(heights)

let map = {}
if (widths.length >= heights.length) {
  map = widths.reduce((results, {dpi, cm: width}) => {
    let height = heights.find(({dpi: _dpi}) => _dpi == dpi)
    if (height) results.push({dpi, width, height: height.cm })
    return results
  }, [])
} else {
  map = heights.reduce((results, {dpi, cm: height}) => {
     let width = widths.find(({dpi: _dpi}) => _dpi == dpi)
     if (width) results.push({dpi, width: width.cm, height})
     return results
  }, [])
}

console.log(`For a source image ${pxw}px wide and ${pxh}px wide, the following dpi values and sizes are possible in a dpi range of ${dpimin}dpi to ${dpimax}dpi`)
map.forEach(({dpi, width, height}) => console.log(`${width}cm x ${height}cm @ ${dpi}dpi`))

