var playState={
	
	preload:function(){
		
		game.load.image('enemy', 'assets/enemy.png');
		game.load.image('respawn', 'assets/respawn.png');
		game.load.image('player', 'assets/player.png');
	},
	
	
	create:function(){
		game.time.advancedTiming=true;
		game.stage.backgroundColor = '#ccc';

		potion={
			'heal':10,
			'cost':10,
			'upCost':100
		}

		enemyRespawn=false;

		initPlayer();
		initEnemy();
		initUI();


		game.time.events.loop(Phaser.Timer.SECOND, enemyAttack, this);
	},
	
	update:function(){
		playerHP.text=player.health+"/"+player.maxHealth;
		enemyHP.text=enemy.health+"/"+enemy.maxHealth;
		menu.visible=!enemy.alive;


	},
	
	render:function(){
		//game.debug.text(this.time.fps || '--', 2, 14, "#000");

	}

		
}


	function initPlayer(){
		//player = game.add.button(100, game.world.centerY, 'player',foo, this);
		player=game.add.text(100,game.world.centerY+100,'player',{font:'30px Arial',fill:'#000'});
		player.anchor.setTo(0.5, 0.5);
		player.inputEnabled = true;
		player.events.onInputDown.add(drinkPotion, this);
		player.events.onInputUp.add(buttonUp, this);

		playerInfo=JSON.parse(localStorage.getItem('playerInfo'));
		if(!playerInfo){
			playerInfo={
				level:0,
				xp:0,
				nextLevel:Math.floor(10*Math.pow(1.5,0)),
				damage:1,
				maxHealth:100,
				health:100,
				coins:0,
				inventory:[]
			}
		}


		player.level=playerInfo.level;
		player.xp=playerInfo.xp;
		player.nextLevel=playerInfo.nextLevel;
		player.damage=playerInfo.damage;
		player.maxHealth=playerInfo.maxHealth;
		player.health=playerInfo.health;
		player.coins=playerInfo.coins;
		player.inventory=playerInfo.inventory;


	}

	function initEnemy(){
		//enemy = game.add.button(game.world.width-100, game.world.centerY, 'enemy',attack, this);
		enemy=game.add.text(game.world.width-100,game.world.centerY+100,'enemy',{font:'30px Arial',fill:'#000'});
		enemy.inputEnabled = true;
		enemy.events.onInputDown.add(attack, this);
		enemy.events.onInputUp.add(buttonUp, this);
		enemy.anchor.setTo(0.5, 0.5);

		enemyInfo=JSON.parse(localStorage.getItem('enemyInfo'));
		if(!enemyInfo){
			enemyInfo={
				level:1,
				damage:1,
				maxHealth:5,
				health:5,
				upCost:5,
				coins:1,
				dropChance:10,
				rarity:'normal'
			}
		}


		enemy.level=enemyInfo.level;
		enemy.damage=enemyInfo.damage;
		enemy.maxHealth=enemyInfo.maxHealth;
		enemy.health=enemyInfo.health;
		enemy.upCost=enemyInfo.upCost;
		enemy.coins=enemyInfo.coins;
		enemy.rarity=enemyInfo.rarity;
		enemy.dropChance=enemyInfo.dropChance;
		enemy.kill();
	}

	function initUI(){
		menu=game.add.text(10,10,'Main Menu',{font:'20px Arial',fill:'#000'});
		menu.visible=false;
		menu.inputEnabled = true;
		menu.events.onInputDown.add(mainMenu, this);
		menu.events.onInputUp.add(buttonUp, this);

		respawnStatus=game.add.text(game.world.centerX,40,'Respawn:OFF',{font:'30px Courier',fill:'#000'});
		respawnStatus.anchor.setTo(0.5, 0.5);
		//respawnButton=game.add.button(game.world.centerX, 150, 'respawn',toggleRespawn, this);
		respawnButton=game.add.text(game.world.centerX,150,'respawn',{font:'30px Arial',fill:'#000'});
		respawnButton.anchor.setTo(0.5, 0.5);
		respawnButton.inputEnabled = true;
		respawnButton.events.onInputDown.add(toggleRespawn, this);
		respawnButton.events.onInputUp.add(buttonUp, this);

		playerHP=game.add.text(10,40,'',{font:'30px Courier',fill:'#000'});
		playerLevelText=game.add.text(10,80,'Level:',{font:'20px Courier',fill:'#000'});
		playerLevel=game.add.text(playerLevelText.x+playerLevelText.width,80,player.level,{font:'20px Courier',fill:'#000'});
		playerXpText=game.add.text(10,120,'Exp:',{font:'20px Courier',fill:'#000'});
		playerXP=game.add.text(playerXpText.x+playerXpText.width,120,player.xp+'/'+player.nextLevel,{font:'20px Courier',fill:'#000'});
		playerDamage=game.add.text(10,160,"Damage:"+player.damage,{font:'20px Courier',fill:'#000'});
		playerCoinsText=game.add.text(10,200,'Coins: ',{font:'20px Courier',fill:'#000'});
		playerCoins=game.add.text(playerCoinsText.x+playerCoinsText.width,200,player.coins,{font:'20px Courier',fill:'#000'});
		playerHeal=game.add.text(10,240,'Heal '+potion.heal+' HP ('+potion.cost+' coins )',{font:'20px Arial',fill:'#000'});
		playerHeal.inputEnabled = true;
		playerHeal.events.onInputDown.add(drinkPotion, this);
		playerHeal.events.onInputUp.add(buttonUp, this);
		playerHealUp=game.add.text(10,280,'Upgrade Potion('+potion.upCost+" coins )",{font:'20px Arial',fill:'#000'});
		playerHealUp.inputEnabled = true;
		playerHealUp.events.onInputDown.add(upgradePotion, this);
		playerHealUp.events.onInputUp.add(buttonUp, this);

		enemyHP=game.add.text(game.world.width-10,40,'',{font:'30px Courier',fill:'#000'});
		enemyHP.anchor.setTo(1, 0);
		enemyLevel=game.add.text(game.world.width-10,80,enemy.level,{font:'20px Courier',fill:'#000'});
		enemyLevel.anchor.setTo(1, 0);
		enemyLevelText=game.add.text(enemyLevel.x-enemyLevel.width,80,'Level: ',{font:'20px Courier',fill:'#000'});
		enemyLevelText.anchor.setTo(1, 0);
		enemyDamage=game.add.text(game.world.width-10,120,enemy.damage,{font:'20px Courier',fill:'#000'});
		enemyDamage.anchor.setTo(1, 0);
		enemyDamageText=game.add.text(enemyDamage.x-enemyDamage.width,120,'Damage: ',{font:'20px Courier',fill:'#000'});
		enemyDamageText.anchor.setTo(1, 0);

		enemyUpText=game.add.text(game.world.width-10,160,'UP! cost:'+enemy.upCost,{font:'20px Arial',fill:'#000'});
		enemyUpText.anchor.setTo(1, 0);
		enemyUpText.inputEnabled = true;
		enemyUpText.events.onInputDown.add(enemyUp, this);
		enemyUpText.events.onInputUp.add(buttonUp, this);
	}

	function enemyUp(button){
		buy(enemy.upCost);
		button.scale.setTo(0.7,0.7);
		enemy.level++;
		enemy.maxHealth+=5;
		enemy.health=enemy.maxHealth;
		enemy.damage++;
		enemy.coins++;
		enemy.upCost*=2;
		enemyDamage.text=enemy.damage;
		enemyLevel.text=enemy.level;
		enemyUpText.text="UP! cost:"+enemy.upCost;
	}
	function drinkPotion(button){
		if(player.health==player.maxHealth)
			return;
		buy(potion.cost);
		if(player.health+potion.heal>player.maxHealth){
			player.health=player.maxHealth;
		}else{
			player.health+=potion.heal;
		}
		
		button.scale.setTo(0.7,0.7);
	}
	function upgradePotion(button){
		buy(potion.upCost);
		potion.heal*=2;
		potion.cost*=2;
		potion.upCost*=2;
		playerHeal.text='Heal '+potion.heal+' HP ('+potion.cost+' coins )';
		playerHealUp.text='Upgrade Potion('+potion.upCost+" coins )";
		button.scale.setTo(0.7,0.7);
	}
	function buttonUp(button){
		button.scale.setTo(1,1);
	}

	function buy(itemCost){
		if(!player.alive)
			return;
		if(player.coins-itemCost<0)
			return;
		else
			player.coins-=itemCost;
		playerCoins.text=player.coins;
	}

	function attack (button) {
		if(!player.alive)
			return;
		button.scale.setTo(0.7,0.7);
		enemy.health-=player.damage;
		if(enemy.health<=0){
			enemy.health=0;
			kill(enemy);
			
		}
	}
	
	function enemyAttack(){
		if(!enemy.alive||!player.alive)
			return;
		player.health-=enemy.damage;
		if(player.health<=0){
			gameOver();
		}
	}

	function kill(enemy){
		enemy.kill();
		gainXP();
		respawn();
		gainDrop();
		saveGameState();
	}
	
	function respawn(){
		if(!enemyRespawn)
			return;

		enemy.reset(enemy.x,enemy.y);
		
		enemy.health=enemy.maxHealth;
		enemyDamage.text=enemy.damage;
		enemyLevel.text=enemy.level;
	}

	function toggleRespawn(button){
		button.scale.setTo(0.7,0.7);
		enemyRespawn=!enemyRespawn;
		respawn();
		respawnStatus.text='Respawn:'+(enemyRespawn?"ON":"OFF");
	}

	function gainXP(){
		player.xp+=enemy.level;
		plus(playerXP,enemy.level)
		//player.level=log(player.xp/10,1.1);
		if(player.xp>=player.nextLevel){
			levelUp();
		}
		
		playerXP.text=player.xp+"/"+player.nextLevel;
		playerLevel.text=player.level;

	}

	function levelUp(){
		player.level++;
		player.nextLevel+=Math.floor(10*Math.pow(1.5,player.level));
		player.damage++;
		player.maxHealth+=10;
		player.health+=10;
		playerDamage.text="Damage:"+player.damage;
		plus(playerLevel,1)
	}

	function log(number, base) {
    	return Math.log(number) / Math.log(base);
	}

	function plus(obj,num){
		if(num<0){
			num="-"+num;
		}else{
			num="+"+num;
		}
		var text=game.add.text(obj.x,obj.y-10,num,{font:'20px Courier',fill:'#000'});
		var textTween = game.add.tween(text).to( { y: text.y-20,alpha:0 }, 1000, "Linear", true);
		textTween.onComplete.add(function(){text.destroy();});
	}

	function gainDrop(){
		player.coins+=enemy.coins;
		playerCoins.text=player.coins;
		plus(playerCoins,enemy.coins)
		var chance=game.rnd.integerInRange(0,100);
		if(chance<=enemy.dropChance){
			player.inventory.push(generateItem(enemy));
			plus({x:game.world.centerX,y:game.world.centerY}," "+player.inventory[player.inventory.length-1].rarity+" "+player.inventory[player.inventory.length-1].type);
		}
	}

	function mainMenu(){
		game.state.start('menu');
	}

	function generateItem(enemy){
		var item={};
		var type=['weapon','shield','helmet','chestplate','pants','gloves','boots'];
		item.type=game.rnd.pick(type);
		var rarity=['common','uncommon','rare'];
		if(enemy.rarity=='normal'){
			var rarityChance=game.rnd.integerInRange(0,100);
			if(rarityChance<=80){
				item.rarity='common';
			}else{
				item.rarity='uncommon';
			}
		}
		item.level=enemy.level-game.rnd.integerInRange(0,5);
		if(item.level<=0)
			item.level=1;

		item.damage=game.rnd.integerInRange(1,item.level);
		item.health=game.rnd.integerInRange(1,item.level*4);

		if(item.rarity=='uncommon'){
			item.damage+=game.rnd.integerInRange(1,Math.ceil(item.level/4));
			item.health+=game.rnd.integerInRange(1,item.level*4/4);
		}
		if(item.type=='weapon'){
			item.health=0;
		}else{
			item.damage=0;
		}
		item.cost=item.damage*8+item.health*2;
		return item;
		/*
		var item={
			'type':game.rnd.pick(type),
			'rarity':'common',
			'level':1,
			'damage':3,
			'health':0,
			'regen':0,
			'defence':0,
			'cost':10
		}
		*/
	}

	function gameOver(){
		player.kill();
		localStorage.removeItem('player');
		localStorage.removeItem('enemy');
		localStorage.removeItem('potion');
	}

	function saveGameState(){
		playerInfo={
			level:player.level,
			xp:player.xp,
			nextLevel:player.nextLevel,
			damage:player.damage,
			maxHealth:player.maxHealth,
			health:player.health,
			coins:player.coins,
			inventory:player.inventory
		}
		localStorage.setItem('playerInfo',JSON.stringify(playerInfo));

		enemyInfo={
			level:enemy.level,
			damage:enemy.damage,
			maxHealth:enemy.maxHealth,
			health:enemy.health,
			upCost:enemy.upCost,
			coins:enemy.coins,
			dropChance:enemy.dropChance,
			rarity:enemy.rarity
		}
		localStorage.setItem('enemyInfo',JSON.stringify(enemyInfo));
	}