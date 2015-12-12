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
		playerHP.text=playerInfo.health+"/"+playerMaxHealth();
		enemyHP.text=enemyInfo.health+"/"+enemyInfo.maxHealth;
		menu.visible=!enemy.alive;
		elite.visible=!enemy.alive;

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
				inventory:[],
				equipment:{
					'weapon':null,
					'offhand':null,
					'helmet':null,
					'chestplate':null,
					'pants':null,
					'gloves':null,
					'boots':null
				}
			}
		}

/*
		player.level=playerInfo.level;
		player.xp=playerInfo.xp;
		player.nextLevel=playerInfo.nextLevel;
		player.damage=playerInfo.damage;
		player.maxHealth=playerInfo.maxHealth;
		player.health=playerInfo.health;
		player.coins=playerInfo.coins;
		player.inventory=playerInfo.inventory;
*/

	}

	function initEnemy(){
		//enemy = game.add.button(game.world.width-100, game.world.centerY, 'enemy',attack, this);
		enemy=game.add.text(game.world.width-100,game.world.centerY+100,'enemy',{font:'30px Arial',fill:'#000'});
		enemy.inputEnabled = true;
		enemy.events.onInputDown.add(attack, this);
		enemy.events.onInputUp.add(buttonUp, this);
		enemy.anchor.setTo(0.5, 0.5);

		enemies=JSON.parse(localStorage.getItem('enemies'));
		
		if(!enemies){
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
			enemies={
				normal:enemyInfo,
				elite:{
					level:1,
					damage:10,
					maxHealth:100,
					health:100,
					upCost:50,
					coins:20,
					dropChance:100,
					summonCost:50,
					rarity:'elite'
				}
			}
		}else{
			enemyInfo=enemies.normal;
		}

		enemy.kill();

/*
		enemy.level=enemyInfo.level;
		enemy.damage=enemyInfo.damage;
		enemy.maxHealth=enemyInfo.maxHealth;
		enemy.health=enemyInfo.health;
		enemy.upCost=enemyInfo.upCost;
		enemy.coins=enemyInfo.coins;
		enemy.rarity=enemyInfo.rarity;
		enemy.dropChance=enemyInfo.dropChance;
		
		*/
	}

	function initUI(){
		menu=game.add.text(10,10,'Main Menu',{font:'20px Arial',fill:'#000'});
		menu.visible=false;
		menu.inputEnabled = true;
		menu.events.onInputDown.add(mainMenu, this);
		menu.events.onInputUp.add(buttonUp, this);

		elite=game.add.text(game.world.width-10,10,'',{font:'20px Arial',fill:'#000'});
		elite.visible=false;
		elite.anchor.setTo(1, 0);
		elite.inputEnabled = true;
		elite.events.onInputDown.add(toggleCreep, this);
		elite.events.onInputUp.add(buttonUp, this);
		if(enemyInfo.rarity=='normal'){
			elite.text='Elite( '+enemies.elite.summonCost+' coins )';
		}
		if(enemyInfo.rarity=='elite'){
			elite.text='Normal( 0 coins )';
		}

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
		playerLevel=game.add.text(playerLevelText.x+playerLevelText.width,80,playerInfo.level,{font:'20px Courier',fill:'#000'});
		playerXpText=game.add.text(10,120,'Exp:',{font:'20px Courier',fill:'#000'});
		playerXP=game.add.text(playerXpText.x+playerXpText.width,120,playerInfo.xp+'/'+playerInfo.nextLevel,{font:'20px Courier',fill:'#000'});
		playerDamageText=game.add.text(10,160,"Damage:"+playerDamage(),{font:'20px Courier',fill:'#000'});
		playerCoinsText=game.add.text(10,200,'Coins: ',{font:'20px Courier',fill:'#000'});
		playerCoins=game.add.text(playerCoinsText.x+playerCoinsText.width,200,playerInfo.coins,{font:'20px Courier',fill:'#000'});
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
		enemyLevel=game.add.text(game.world.width-10,80,enemyInfo.level,{font:'20px Courier',fill:'#000'});
		enemyLevel.anchor.setTo(1, 0);
		enemyLevelText=game.add.text(enemyLevel.x-enemyLevel.width,80,'Level: ',{font:'20px Courier',fill:'#000'});
		enemyLevelText.anchor.setTo(1, 0);
		enemyDamage=game.add.text(game.world.width-10,120,enemyInfo.damage,{font:'20px Courier',fill:'#000'});
		enemyDamage.anchor.setTo(1, 0);
		enemyDamageText=game.add.text(enemyDamage.x-enemyDamage.width,120,'Damage: ',{font:'20px Courier',fill:'#000'});
		enemyDamageText.anchor.setTo(1, 0);

		enemyUpText=game.add.text(game.world.width-10,160,'UP! cost:'+enemyInfo.upCost,{font:'20px Arial',fill:'#000'});
		enemyUpText.anchor.setTo(1, 0);
		enemyUpText.inputEnabled = true;
		enemyUpText.events.onInputDown.add(enemyUp, this);
		enemyUpText.events.onInputUp.add(buttonUp, this);
	}

	function enemyUp(button){
		if(!buy(enemyInfo.upCost))
			return;
		button.scale.setTo(0.7,0.7);
		if(enemyInfo.rarity=='normal'){
			enemyInfo.level++;
			enemyInfo.maxHealth+=5;
			enemyInfo.health=enemyInfo.maxHealth;
			enemyInfo.damage++;
			enemyInfo.coins++;
			enemyInfo.upCost*=2;
		}
		if(enemyInfo.rarity=='elite'){
			enemyInfo.level++;
			enemyInfo.maxHealth*=2;
			enemyInfo.health=enemyInfo.maxHealth;
			enemyInfo.damage*=2;
			enemyInfo.coins*=2;
			enemyInfo.upCost*=2;
			enemyInfo.summonCost*=2;
		}
		enemyDamage.text=enemyInfo.damage;
		enemyLevel.text=enemyInfo.level;
		enemyUpText.text="UP! cost:"+enemyInfo.upCost;
	}
	function drinkPotion(button){
		if(playerInfo.health==playerMaxHealth())
			return;
		if(!buy(potion.cost))
			return;
		if(playerInfo.health+potion.heal>playerMaxHealth()){
			playerInfo.health=playerMaxHealth();
		}else{
			playerInfo.health+=potion.heal;
		}
		
		button.scale.setTo(0.7,0.7);
		saveGameState();
	}
	function upgradePotion(button){
		if(!buy(potion.upCost))
			return;
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
			return false;
		if(playerInfo.coins-itemCost<0)
			return false;
		else
			playerInfo.coins-=itemCost;
		playerCoins.text=playerInfo.coins;
		saveGameState();
		return true;
	}

	function attack (button) {
		if(!player.alive)
			return;
		button.scale.setTo(0.7,0.7);
		enemyInfo.health-=playerDamage();
		if(enemyInfo.health<=0){
			enemyInfo.health=0;
			kill(enemy);
			
		}
	}
	
	function enemyAttack(){
		if(!enemy.alive||!player.alive)
			return;
		playerInfo.health-=enemyInfo.damage;
		if(playerInfo.health<=0){
			gameOver();
		}
	}

	function kill(enemy){
		enemy.kill();
		gainXP();
		gainDrop();
		if(enemyInfo.rarity=='normal'){
			respawn();
		}
		if(enemyInfo.rarity=='elite'){
			enemyRespawn=!enemyRespawn;
			respawnStatus.text='Respawn:'+(enemyRespawn?"ON":"OFF");
			toggleCreep(elite);
		}	
		saveGameState();
	}
	
	function respawn(){
		if(!enemyRespawn)
			return;

		enemy.reset(enemy.x,enemy.y);
		
		enemyInfo.health=enemyInfo.maxHealth;
		enemyDamage.text=enemyInfo.damage;
		enemyLevel.text=enemyInfo.level;
		enemyUpText.text="UP! cost:"+enemyInfo.upCost;
	}

	function toggleRespawn(button){
		button.scale.setTo(0.7,0.7);
		enemyRespawn=!enemyRespawn;
		respawn();
		respawnStatus.text='Respawn:'+(enemyRespawn?"ON":"OFF");
	}

	function gainXP(){
		if(enemyInfo.rarity=='normal'){
			playerInfo.xp+=enemyInfo.level;
			plus(playerXP,enemyInfo.level)
		}
		if(enemyInfo.rarity=='elite'){
			playerInfo.xp+=enemyInfo.level*100;
			plus(playerXP,enemyInfo.level*100)
		}
		
		//player.level=log(player.xp/10,1.1);
		if(playerInfo.xp>=playerInfo.nextLevel){
			levelUp();
		}
		
		playerXP.text=playerInfo.xp+"/"+playerInfo.nextLevel;
		playerLevel.text=playerInfo.level;

	}

	function levelUp(){
		playerInfo.level++;
		playerInfo.nextLevel+=Math.floor(10*Math.pow(1.5,playerInfo.level));
		playerInfo.damage++;
		playerInfo.maxHealth+=10;
		playerInfo.health+=10;
		playerDamageText.text="Damage:"+playerDamage();
		plus(playerLevel,1)
	}

	function log(number, base) {
    	return Math.log(number) / Math.log(base);
	}

	function plus(obj,num){
		if(num>0){
			num="+"+num;
		}
		var text=game.add.text(obj.x,obj.y-10,num,{font:'20px Courier',fill:'#000'});
		var textTween = game.add.tween(text).to( { y: text.y-20,alpha:0 }, 1000, "Linear", true);
		textTween.onComplete.add(function(){text.destroy();});
	}

	function gainDrop(){
		playerInfo.coins+=enemyInfo.coins;
		playerCoins.text=playerInfo.coins;
		plus(playerCoins,enemyInfo.coins)
		var chance=game.rnd.integerInRange(0,100);
		if(chance<=enemyInfo.dropChance){
			playerInfo.inventory.push(generateItem(enemyInfo));
			plus({x:game.world.centerX,y:game.world.centerY}," "+playerInfo.inventory[playerInfo.inventory.length-1].rarity+" "+playerInfo.inventory[playerInfo.inventory.length-1].type);
		}
	}

	function mainMenu(){
		game.state.start('menu');
	}

	function generateItem(enemy){
		var item={};
		var type=['weapon','offhand','helmet','chestplate','pants','gloves','boots'];
		item.type=game.rnd.pick(type);
		var rarity=['common','uncommon','rare'];
		if(enemyInfo.rarity=='normal'){
			var rarityChance=game.rnd.integerInRange(0,100);
			if(rarityChance<=80){
				item.rarity='common';
			}else{
				item.rarity='uncommon';
			}
		}
		if(enemyInfo.rarity=='elite'){
			var rarityChance=game.rnd.integerInRange(0,100);
			if(rarityChance<80){
				item.rarity='uncommon';
			}
			if(rarityChance<=100&&rarityChance>=80){
				item.rarity='rare';
			}
		}
		item.level=enemy.level-game.rnd.integerInRange(0,5);
		if(enemyInfo.rarity=='elite')
		{
			item.level=enemy.level+game.rnd.integerInRange(2,5);
		}
		if(item.level<=0)
			item.level=1;

		item.damage=game.rnd.integerInRange(1,item.level);
		item.health=game.rnd.integerInRange(1,item.level*4);

		if(item.rarity=='uncommon'){
			item.damage+=game.rnd.integerInRange(1,Math.ceil(item.level/4));
			item.health+=game.rnd.integerInRange(1,item.level*4/4);
		}
		if(item.rarity=='rare'){
			item.damage+=game.rnd.integerInRange(1,Math.ceil(item.level));
			item.health+=game.rnd.integerInRange(1,item.level*4);
		}
		if(item.type=='weapon'){
			item.health=0;
		}else{
			item.damage=0;
		}

		item.cost=item.damage*8+item.health*2;
		if(item.rarity=='uncommon')
			item.cost*=game.rnd.integerInRange(1,2);
		if(item.rarity=='rare')
			item.cost*=game.rnd.integerInRange(2,3);


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
		localStorage.removeItem('playerInfo');
		localStorage.removeItem('enemies');
		localStorage.removeItem('potion');
	}

	function saveGameState(){
		/*
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
		*/
		localStorage.setItem('playerInfo',JSON.stringify(playerInfo));
/*
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
		*/
		enemies[enemyInfo.rarity]=enemyInfo;
		localStorage.setItem('enemies',JSON.stringify(enemies));
	}

	function playerDamage(){
		var dmg=0;
		dmg+=playerInfo.damage;
		for(var slot in playerInfo.equipment){
			if(playerInfo.equipment[slot])
				dmg+=playerInfo.equipment[slot].damage;
		}

		return dmg;
	}


	function playerMaxHealth(){
		var hp=0;
		hp+=playerInfo.maxHealth;
		for(slot in playerInfo.equipment){
			if(playerInfo.equipment[slot])
				hp+=playerInfo.equipment[slot].health;
		}

		return hp;
	}

	function toggleCreep(button){
		if(enemyInfo.rarity=='normal'){
			if(!buy(enemies.elite.summonCost))
				return;
			plus(playerCoins,-enemies.elite.summonCost);
			button.text='Normal( 0 coins )';

			enemies.normal=enemyInfo;
			enemyInfo=enemies.elite;
			enemyDamage.text=enemyInfo.damage;
			enemyLevel.text=enemyInfo.level;
			enemyUpText.text="UP! cost:"+enemyInfo.upCost;
			return;
		}
		if(enemyInfo.rarity=='elite'){
			button.text='Elite( '+enemies.elite.summonCost+' coins )';

			enemies.elite=enemyInfo;
			enemyInfo=enemies.normal;
			enemyDamage.text=enemyInfo.damage;
			enemyLevel.text=enemyInfo.level;
			enemyUpText.text="UP! cost:"+enemyInfo.upCost;
			return;
		}


		button.scale.setTo(0.7,0.7);
	}