var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
/*ctx.fillStyle = "#C7C7E2";
ctx.fillRect(0,0,100,100);
ctx.font = "24px Arial";
ctx.textAlign = "left";
ctx.textBaseline = "bottom";
ctx.fillText("hello",110,30);//以(110,30)為基準*/
var bgImage = new Image();
bgImage.src = "img/background.png";
var heroImage = new Image();
heroImage.src = "img/hero.png";
var bulletImage = new Image();
bulletImage.src = "img/b2.png";
var monsterImage = new Image();
monsterImage.src = "img/e1.png";
var score = 0;
var keysDown = {};
var bullet_list=[];
var monster_list =[];

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);
addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

var hero = {
	hp:100,
	x:canvas.width / 2,
	y:canvas.height / 2,
	width:30,
	height:30,
	speed:8,
	draw:function(){
 		ctx.drawImage(heroImage,this.x,this.y);
 },
 	attack:function(){
 		var bullet ={
			width:15,
			height:15,
			dx:3,
			dy:0,
			x:0,
			y:0,
			from:"hero",
			draw:function(){
			 		ctx.drawImage(bulletImage,this.x,this.y);
			 },
			 move:function(){
			 	this.x+=this.dx;
			 	this.y+=this.dy;
			 }
		};
		bullet.x=hero.x+hero.width
		bullet.y=hero.y;
		bullet_list.push(bullet);
 	}

};
var lastattack = Date.now();
var keyDown = function(){
	if(37 in keysDown){ //左
	hero.x -= hero.speed;
	}
	if(38 in keysDown){ //上
    hero.y -= hero.speed;
	}
	if(39 in keysDown){ //右
    hero.x += hero.speed;
	}
	if(40 in keysDown){ //下
    hero.y += hero.speed;
	}
	if(32 in keysDown){
		if(Date.now()-lastattack>300){
			hero.attack();
			lastattack=Date.now();
		}
	}
};


var addmonster = function(){
	var monster = {
		x:canvas.width/2,
		y:canvas.height/2,
		width:30,
		height:30,
		dx:4,
		dy:0,
		draw:function(){
			 		ctx.drawImage(monsterImage,this.x,this.y);
			 },
		move:function(){
			 	this.x-=this.dx;
			
		}
	};
	monster.x=canvas.width-50;
	monster.y=Math.floor(Math.random()*(canvas.height-monster.height));
	monster_list.push(monster);
}

var bulletCollision = function(bullets, monsters, hero){
    for(var i=0;i<bullets.length;i++){
        if(bullets[i].from=="hero"){
            for(var j=0;j<monsters.length;j++){
                if(!( monsters[j].x+monsters[j].width<= bullets[i].x || monsters[j].x > bullets[i].x+bullets[i].width ||
                monsters[j].y+monsters[j].height <= bullets[i].y || monsters[j].y > bullets[i].y+bullets[i].height)){
                    bullets.splice(i, 1);
                    monsters.splice(j, 1);
                    i--;
                    j--;
                    score+=10;
                    break;
                }
            }
        }
        else if(bullets[i].from=="monster"){
            if(!( bullets[i].x+bullets[i].width<= hero.x || bullets[i].x > hero.x+hero.width ||
            bullets[i].y+bullets[i].height <= hero.y || bullets[i].y > hero.y+hero.height)){
                bullets.splice(i, 1);
                j--;
                hero.hp-=10;
            }
        }
    }
}

var monsterCollision = function(monsters, hero) {
    for(var j=0;j<monsters.length;j++){
        if(!( monsters[j].x+monsters[j].width<= hero.x || monsters[j].x > hero.x+hero.width ||
            monsters[j].y+monsters[j].height <= hero.y || monsters[j].y > hero.y+hero.height)){
            monsters.splice(j, 1);
            j--;
            if(hero.hp>0){
				 hero.hp-=10;
			}

        }
    }
}

var reset = function(){
	bullet_list=[];
	monster_list=[];
	hero.hp=100;
	score=0;
	hero.x=canvas.width/2;
	hero.y=canvas.height/2;
	flag = 0;
};

var dopause = function(){
 if(flag == -1){
 	flag = 0;
 }else{
 	flag = -1;
 }
};

var draw = function(){
	ctx.fillStyle = ctx.createPattern(bgImage,"repeat");
	ctx.fillRect(0,0,canvas.width,canvas.height);
	hero.draw();
	
	for (var i = 0; i < bullet_list.length; i++) {
		bullet_list[i].draw();
	};
	for (var i = 0; i < monster_list.length; i++) {
		monster_list[i].draw();
	};
	ctx.fillStyle = "red";
	ctx.fillRect(hero.x,hero.y-20,hero.hp,10);
	ctx.font = "24px Arial";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("score:"+ score,10,10);
	if(hero.hp == 0){
		ctx.fillStyle = "red";
		ctx.font = "100px Arial";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText("GameOver",canvas.width/2,canvas.height/2);
	}
};
var update = function(){
	if(hero.hp<=0){
		flag = -1;
	}
	if(hero.x <0){
		hero.x = 0;
	}
	if(hero.y <0){
		hero.y = 0;
	}
	if(hero.x+hero.width > canvas.width){
		hero.x = canvas.width-hero.width;
	}
	if(hero.y+hero.height> canvas.height){
		hero.y = canvas.height-hero.height;
	}
	for (var i = 0; i < bullet_list.length; i++) {
		bullet_list[i].move();
		if(bullet_list[i].x>canvas.x){
			bullet_list[i].splice(i, 1);
		}
	};
	for (var i = 0; i < monster_list.length; i++) {
			monster_list[i].move();

			if(monster_list[i].x+monster_list[i].width<0){
				monster_list.splice(i,1);
				i--;
			}
	};

	bulletCollision(bullet_list, monster_list, hero);
	monsterCollision(monster_list,hero);


};

var lastadd = Date.now();
var flag = 0;
var main = function(){
	if(flag == 0){
		keyDown();
	if(Date.now()-lastadd>1000){
		addmonster();
		lastadd = Date.now();
	}
	update();
	draw();


	
}
	requestAnimationFrame(main);
};
main();