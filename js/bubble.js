// Tinfohtml = new Array ("12","22","33","44","55");
var  Tinfohtml= {
	"英剧":"英剧点主要分布在图像左侧，面积较大的即评分高的点数量很多，说明豆瓣用户在讨论英剧方面话题热度高，且这些电视剧更容易获得好评。",
	"美剧":"美剧点分布较为平均，面积较大的即评分高的点数量较多，可以认为豆瓣用户对美剧的评价较好，也比较积极在豆瓣平台发表自己的态度。",
	"日剧":"日剧点分布比较均匀，面积大的点即评分高的点约占半数，因此我们认为日剧在豆瓣中拥有一定的话题热度，也比较能够获得好评。",
	"韩剧":"韩剧点数量较前三国数量少，评分高的点数量约占三成，可见韩剧的话题讨论热度和评价都不温不火，在豆瓣用户中没有得到较多的关注。",
	"国产剧":"国产剧点数量和分数普遍较低，整体来看并不能吸引豆瓣用户的评分热情。我们猜测国产剧的话题热度并不由其本身质量优异决定，也许有其他社会因素影响了观众们的态度。"
};

function Bubble(record){

	this.x = record.x;
	this.y = record.y;
	this.r = record.grade*record.grade/10 + 2;
	this.name = record.name;
	this.year = record.year;
	this.grade = record.grade;
	this.director = record.director;
	this.actor = record.actor;
	this.category = record.category;	
	this.country = record.country;
	this.category = record.category;
	this.img = record.img;

	var over = false;	

	//定义绘制形状的具体规则
	this.display = function(){
		noStroke();

		// 筛选功能，修改颜色
		if((countrySelected==this.country&&categorySelected=="all")||( countrySelected==this.country&&this.category.indexOf(categorySelected) >=0)){
			fill(countryColors[this.country]); //如何高亮颜色？？？
		}else if(countrySelected=="all"&&this.category.indexOf(categorySelected) >=0){
			fill("#5d75ff");
		}
		else{
			fill("#a7a5a6");
		}
		//添加筛选标签
		if(countrySelected==this.country){
			Tinfo.html(Tinfohtml[this.country]); //取字典中的值
		}		
		
		ellipse(this.x,this.y,this.r,this.r); // 画圆

		//添加鼠标hover状态
		if(over){
			cursor(HAND); //鼠标样式
			fill(224,76,90);  // 修改颜色
			ellipse(this.x,this.y,this.r,this.r); //重新画圆

			//新建信息框，使用p5.dom.js
			Ldiv = createDiv('').id("trendLegend").parent("#trend2").position(mouseX-150,mouseY-120);

			TVimg = createImg(this.img).class("TVimg").parent(Ldiv);// 不同国别具有不同的外边框 
			TVinfo = createDiv("").class("TVinfo").parent(Ldiv);

			Ninfo = createP(this.name).class("Ninfo").parent(TVinfo); 
			Ginfo = createP(this.grade).class("Ginfo").parent(TVinfo);
			Yinfo = createP("首播时间："+this.year).class("Yinfo").parent(TVinfo);
			// Ytips = createSpan("年份").class("tips").parent(Yinfo);
			Sinfo = createP("题材："+this.category).class("Sinfo").parent(TVinfo);
			Dinfo = createP("导演："+this.director).class("Dinfo").parent(TVinfo);
			Ainfo = createP("演员："+this.actor).class("Ainfo").parent(TVinfo);
			
		}
	}

	//定义鼠标hover状态的具体规则
	this.mouseOver = function(){
		d = dist(mouseX, mouseY,this.x,this.y);
		if(d<9/2){
			// this.r = 50;
			over = true;
		}else{
			// this.r=9;
			over = false;
		}

	}





}