var width = 1500;
var	height = 900;

var trendData;
var Ldiv;
var bgImg;

var bubs = [];
var years = [];

var countrySelected;
var categorySelected;

var countryColors = {
	"英剧":"#9b4454",
	"美剧":"#ff6d6e",
	"日剧":"#33b9d6",
	"韩剧":"#927ce0",
	"国产剧":"#ffa88a"
};

var groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

function preload(){
	trendData = loadJSON("json/trend.json");
	bgImg = loadImage("img/bg_trend.png");
}

function prepareData(data){
	years = groupBy(data,"year");
	halfs = {};
	for(x in years){
		half = Math.floor(years[x].length/2);
		halfs[x] = half;
	}

	for(i=0;i<data.length;i++){
		year = data[i].year
		comd_sort = data[i].comd_sort
		half = halfs[year]
		// data[i]["x"] = width/2 + (comd_sort-half)*15;
		data[i]["x"] = 50 + comd_sort*15;
		data[i]["y"] = (year - 2001)*30;
	}

}

function setup(){
	var trendCanvas = createCanvas(1200,520);
	trendCanvas.parent("trend2"); //定位canvas 
	//添加详细信息框
	trend2 = select("#trend2");
	Tinfo = createDiv("").id("Tinfo").parent("#trend2").position(800,30);

	//准备数据
	trendData = Object.values(trendData);
	prepareData(trendData);
	// console.log(trendData);
	for(i=0;i<trendData.length;i++){
		bubs[i] = new Bubble(trendData[i]);
	}
	

	
	
}

function draw(){
	//设置退出机制，hover信息框
	try{
		Ldiv.remove();
	}catch(err){
		
	}
	//定义筛选规则
	countrySelected = $("select#country-filter option:selected").attr("value");   //添加筛选器
	categorySelected = $("select#category-filter option:selected").attr("value");  //添加筛选器
	
	background(bgImg,100);  //背景色

	//新建筛选标签
	Tinfo.html("");

	//绘制纵轴
	for(i=2002;i<2018;i++){
		var texty = (i-2001)*30+5;
		var textinfo = i.toString();
		fill("#a7a5a6");		
		text(textinfo,20,texty);
	}

	//绘制基本形状，如果有多个图形，一般用for循环
	for(i=0;i<trendData.length;i++){
		bubs[i].mouseOver();
		bubs[i].display();
	}
}
