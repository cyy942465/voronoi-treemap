// 常数变量
const _2PI = 2 * Math.PI;

// 布局参数
const svgWidth = 960;
const svgHeight = 700;
const treemapRadius = 205;
const treemapCenter = [svgWidth / 2, svgHeight / 2 + 5];

// treemap 参数
let _voronoiTreemap = d3.voronoiTreemap();
let hierarchy;
let circlingPolygon; // 圆形多边形

// draw参数
let fontScale = d3.scaleLinear(); // 用于缩放每个cell里面的文本

// d3选集
let svg;
let treemapContainer;

// 数据处理
d3.json("../data/globalEconomyByGDP.json").then(function(rootData) {
  // console.log(rootData);
  // 获取根节点
  hierarchy = d3.hierarchy(rootData).sum(function(d) { return d.weight; });
  console.log(hierarchy);
  // 计算被裁剪圆形多边形的二维点数组
  initData();
  // 初始化布局
  initLayout();
  _voronoiTreemap.clip(circlingPolygon)
    (hierarchy);
  console.log(hierarchy.leaves());
  // 绘制分割区域
  drawTreemap(hierarchy);
})

// 用于根据半径计算圆形多边形的二维点数组
function computeCirclingPolygon(radius) {
  const points = 60;
  const increment = _2PI / points;
  let circlingPolygonList = [];

  for (let i = 0, a = 0 ; i < points; i++, a += increment) {
    circlingPolygonList.push(
      [radius + radius * Math.cos(a), radius + radius * Math.sin(a)]
    );
  }

  return circlingPolygonList;
}

function initData() {
  circlingPolygon = computeCirclingPolygon(treemapRadius);
  fontScale.domain([3,20]).range([8,20]).clamp(true);
}

// 初始化svg并绘制圆形
function initLayout() {
  svg = d3.select('#container')
    .append('svg')
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  treemapContainer = svg.append("g")
    .classed("treemap-container", true)
    .attr("transform", `translate(${treemapCenter})`);

  treemapContainer.append("path")
    .classed("world", true)
    .attr("transform", `translate(${[-treemapRadius,-treemapRadius]})`)
    .attr("d","M" + circlingPolygon.join('L') + "Z");
}

// 绘制分割区域
function drawTreemap(hierarchy) {
  const leaves = hierarchy.leaves();

  // 绘制cells
  let cells = treemapContainer.append("g")
    .classed("cells", true)
    .attr("transform",`translate(${[-treemapRadius,-treemapRadius]})`)
    .selectAll("cells")
    .data(leaves)
    .enter()
      .append('path')
      .classed("cell", true)
      .attr("d", function(d) {
        return "M" + d.polygon.join('L') + 'Z';
      })
      .attr("fill", function(d) {
        return d.parent.data.color;
      });
  
  // 绘制文本
  
}