const prompts = require('prompts');
class gameProperties {
    constructor(hitPoints, attackDamage, chanceOfAttackHit){
    this.hitPoints = hitPoints;
    this.attackDamage = attackDamage;
    this.chanceOfAttackHit = chanceOfAttackHit;
    }
    lookAround() {
        console.log('---------\nyou look around\nYou are in The dungeon and it is a big and damn room with broken statues all around\n \nThere are doorways leading to:\nHallway\n \n \n---------');
}
dungeon(){
  console.log('You are in the Dungeon');
}
    async goToRoom() {
    let continueGame = true;
    const initialActionChoices = [
      {title: 'Hallway', value: 'hallway'},
    ];
    const response = await prompts({
      type: 'select',
      name: 'value',
      message: 'Which room you want to go to?',
      choices: initialActionChoices
    });
    console.log('You choose ' + response.value);
    switch(response.value) {
      case 'hallway':
          continueGame = false;
          you.goToHallway();
          break;
    }

    if (continueGame) {
      goToRoom();
    }
}
moveToDungeon(){
  console.log('You are again in the Dungeon');
  gameLoop();
}
attackRat() {
  console.log('You attack the small sewer rat');
  if (Math.floor(Math.random() * 4) == 0){
    console.log("Your attack is missed and small sewer rat isn't destroyed");
  }
  else {
    rat.hitpoints = rat.hitpoints-2;
    console.log('Your attack is succeeded and small sewer rat is destroyed');
  }
  gameLoopInHallway();
  
}
async attackInHallway(){
      let continueAttack = true;
      const initialActionChoices = [
        {tittle: 'Small sewer rat', value: 'small sewer rat'},
      ];
      const response = await prompts({
        type: 'select',
        name: 'value',
        message: 'Which enemy you want to attack?',
        choices: initialActionChoices
      });
      console.log('You choose ' + response.value);
      switch(response.value) {
        case 'small sewer rat':
          continueAttack = false;
            you.attackRat();
          break;
      }

      if (continueAttack) {
        attackInHallway();
      }
}
    lookAroundInTheHallway() {
      console.log('-------\nYou look around\nYou are in Hallway and it is a long and dark hallway with dark pools of water on the floor and some fungus growing on the walls\n \nThere are doorways leading to:\nThe dungeon\nChamber\n \n ');
      if(rat.hitpoints == 0){
        console.log('No enemies, to attack here');
        gameLoopInHallway();
      }
      else{
      console.log('You see a Small sewer rat\nSmall sewer rat attacks you with its sharp teeths');
      if (Math.floor(Math.random() * 2) == 0){
        console.log('Small sewer rat attacks misses!');
        gameLoopInHallway();
      }
      else {
        you.hitpoints = you.hitpoints-1;
        if (you.hitpoints > 0){
        console.log('Small sewer rat attacks are succeeded\nYou got hit and has remaining hitpoints '+ you.hitpoints);
        gameLoopInHallway();
      }
        else {
          console.log('No hitpoints left for you and you die!\nGame Over!');
        }
    }
      console.log('--------------------------------');
    }
  }
    goToHallway() {
      console.log('You move to Hallway');
     gameLoopInHallway();
    }
    async goToRoomInTheHallway() {
      let continueGame = true;
        const initialActionChoices = [
            {title: 'Move to Dungeon', value: 'moveToDungeon'},
            {title: 'Chamber', value: 'chamber'},
        ];
        const response = await prompts({
            type: 'select',
            name: 'value',
            message: 'Which room you want to go to?',
            choices: initialActionChoices
        });
        console.log('You choose ' + response.value);
        switch(response.value) {
            case 'moveToDungeon':
                continueGame = false;
                you.moveToDungeon();
                break;
            case 'chamber':
                continueGame = false;
                you.goToChamber();
                break;
        }

        if (continueGame) {
            goToRoom();
        }
    }
    goToChamber(){
      console.log('You move to Chamber');
      gameLoopInChamber();
    }
    lookAroundInTheChamber() {
      console.log('--------\nYou look around\nYou are in the Chamber and it is a small chamber, which is illuminated by a glowing portal of somekind\n \nThere are doorways leading to:\nHallway\nPortal\n \n ');
      if (dragon.hitpoints == 0){
        console.log('No enemies, to attack here');
        gameLoopInChamber();
      }
      else {
      console.log('You see a Giant Dragon\nGiant Dragon attacks Player with it Sharp claws and fire breath');
      if (Math.floor(Math.random() * 10) == 0){
        console.log('Giant Dragon attacks are missed');
        gameLoopInChamber();
      }
      else {
        you.hitpoints = you.hitpoints-8;
        if (you.hitpoints > 0){
        console.log('Giant Dragon hits you with 8 points\nYou got hit and has remaining hitpoints' + player.hitpoints);
        gameLoopInChamber();
      }
        else {
          console.log('No hitpoints left for you and you die!\nGame Over!');
        }
      }
    }
    }
    async goToRoomInTheChamber() {
      let continueGame = true;
        const initialActionChoices = [
            {title: 'Hallway', value: 'hallway'},
            {title: 'Portal', value: 'portal'},
        ];
        const response = await prompts({
            type: 'select',
            name: 'value',
            message: 'Which room you want to go to?',
            choices: initialActionChoices
        });
        console.log('You choose ' + response.value);
        switch(response.value) {
            case 'hallway':
                continueGame = false;
                player.goToHallway();
                break;
            case 'theglowingportal':
                continueGame = false;
                console.log('You move to Portal\nCongratulations, you have reached to the destination.');
                break;
        }

        if (continueGame) {
            goToRoomInTheChamber();	
        }
    }
    async attackInChamber(){
      let continueAttack = true;
      const initialActionChoices = [
        {tittle: 'Giant Dragon', value: 'giant dragon'},
      ];
      const response = await prompts({
        type: 'select',
        name: 'value',
        message: 'Which enemy you want to attack?',
        choices: initialActionChoices
      });
      console.log('You choose ' + response.value);
      switch(response.value) {
        case 'giant dragon':
          continueAttack = false;
            you.attackGiantDragon();
          break;
      }

      if (continueAttack) {
        attackInHallway();
      }
}
    attackGiantDragon(){
      console.log('You attack the Giant Dragon');
      if (Math.floor(Math.random() * 4) == 0){
        console.log("Your attack missed and the Giant Dragon isn't destroyed");
      }
      else {
        dragon.hitpoints = dragon.hitpoints-2;
        console.log('You hit the Giant Dragon');
        if (dragon.hitpoints == 0){
        console.log('Giant Dragon got hit and is destroyed!')}
        else {
          console.log('Giant Dragon got hit and it has reamining hitpoints' + dragon.hitpoints)
        }
      }
      gameLoopInChamber();
    }
}
let you = new gameProperties(10, 2, 75);
let rat = new gameProperties(2, 1, 50);
let dragon = new gameProperties(4, 8, 90);
async function gameLoop() {
    let continueGame = true;
    const initialActionChoices = [
        { title: 'Look Around', value: 'lookAround' },
        { title: 'Go to room', value: 'goToRoom' },
        { title: 'Attack', value: 'attack' },
        { title: 'Exit game', value: 'exit' }
    ];
    const response = await prompts({
        type: 'select',
        name: 'value',
        message: 'Choose your action',
        choices: initialActionChoices
      });
      console.log('You choose ' + response.value);
      switch(response.value) {
        case 'lookAround':
          you.lookAround();
          break;
        
        case 'goToRoom':
          continueGame = false;
          you.goToRoom();
          break;
        
        case 'attack':
          you.attackInDungeon();
          break;
        
        case 'exit':
          continueGame = false;
          break;
      }
      
      if(continueGame) {
        gameLoop();
      }    
}
async function gameLoopInHallway() {
  let continueGame = true;
  const initialActionChoices = [
      { title: 'Look Around', value: 'lookAround' },
      { title: 'Go to room', value: 'goToRoom' },
      { title: 'Attack', value: 'attack' },
      { title: 'Exit game', value: 'exit' }
  ];
  const response = await prompts({
      type: 'select',
      name: 'value',
      message: 'Choose your action',
      choices: initialActionChoices
    });
    console.log('You choose ' + response.value);
    switch(response.value) {
      case 'lookAround':
        continueGame = false;
        you.lookAroundInTheHallway();
        break;
      
      case 'goToRoom':
        continueGame = false;
        you.goToRoomInTheHallway();
        break;
      
      case 'attack':
        continueGame = false;
        if (rat.hitpoints == 2){
        you.attackInHallway();
        }
        else {
          console.log('No enemies, to attack here')
          gameLoopInHallway();
        }
        break;
      
      case 'exit':
        continueGame = false;
        break;
    }
    
    if(continueGame) {
      gameLoopInHallway();
    }   
}
async function gameLoopInChamber() {
  let continueGame = true;
  const initialActionChoices = [
      { title: 'Look Around', value: 'lookAround' },
      { title: 'Go to room', value: 'goToRoom' },
      { title: 'Attack', value: 'attack' },
      { title: 'Exit game', value: 'exit' }
  ];
  const response = await prompts({
      type: 'select',
      name: 'value',
      message: 'Choose your action',
      choices: initialActionChoices
    });
    console.log('You choose ' + response.value);
    switch(response.value) {
      case 'lookAround':
        continueGame = false;
        you.lookAroundInTheChamber();
        break;
      
      case 'goToRoom':
        continueGame = false;
        you.goToRoomInTheChamber();
        break;
      
      case 'attack':
        continueGame = false;
        if (dragon.hitpoints != 0){
          you.attackInChamber();
          }
        else {
            console.log('There is nothing to attack here')
            gameLoopInChamber();
          }
        break;
      
      case 'exit':
        continueGame = false;
        break;
    }
    
    if(continueGame) {
      gameLoopInChamber();
    }   
}
process.stdout.write('\033c');
console.log('WELCOME TO THE DUNGEONS OF LORD OBJECT ORIENTUS!')
console.log('================================================')
console.log('You walk down the stairs to the dungeons')
gameLoop();