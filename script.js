window.onload = function() { // this function will be called when the page is loaded
    
    let gameState = 'stopped' // stopped, running, paused

    let timeoutId = null;
    const game_canvas = document.getElementById('gameCanvas');
    const game_cntx = game_canvas.getContext('2d');

    game_cntx.fillStyle = 'white';
    game_cntx.fillRect(0, 0, game_canvas.width, game_canvas.height);

    game_cntx.strokeStyle = 'black';
    game_cntx.strokeRect(0, 0, game_canvas.width, game_canvas.height);

    //representing the snake
    let snake = [
        {x: 150, y: 150},
        {x: 140, y: 150},
        {x: 130, y: 150},
        {x: 120, y: 150},
        {x: 110, y: 150}
    ];

    //set to true when snake is changing direction
    let changingDirection = false;

    let score = 0;
    // Define dx and dy globally
    let dx = 10;
    let dy = 0;

    //creating and drawing the snake

    function drawSnakePart(snakePart){
        game_cntx.fillStyle = 'lightgreen';
        game_cntx.strokeStyle = 'darkgreen';

        game_cntx.fillRect(snakePart.x, snakePart.y, 10, 10);

        game_cntx.strokeRect(snakePart.x, snakePart.y, 10, 10);
    }

    function changeDirection(event){

        const LEFT_KEY = 37;
        const RIGHT_KEY = 39;
        const UP_KEY = 38;
        const DOWN_KEY = 40;
    /*
        * Prevent the snake from reversing
        * Example scenario:
        * Snake is moving to the right. User presses down and immediately left
        * and the snake immediately changes direction without taking a step down first
    */

        if(changingDirection) return;
        changingDirection = true;
        const keyPressed = event.keyCode;

        const goingUp = dy === -10;
        const goingDown = dy === 10;
        const goingRight = dx === 10;
        const goingLeft = dx === -10;

        if(keyPressed === LEFT_KEY && !goingRight){
            moveSnakeLeft();
        }

        if(keyPressed === RIGHT_KEY && !goingLeft){
            moveSnakeRight();
        }

        if(keyPressed === UP_KEY && !goingDown){
            moveSnakeUp();
        }

        if(keyPressed === DOWN_KEY && !goingUp){
            moveSnakeDown();
        }
    }

    function drawSnake(){
        snake.forEach(drawSnakePart);
    }

    /*
    * The snake moves by adding a new head in the  direction it is moving and removing the tail
    *
    */

    function moveSnake(){

        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        snake.unshift(head);//add new head

        const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
        if(didEatFood){
            score += 10;
            document.getElementById('score').innerHTML = score;
            highScore(score);
            createFood();
        }else{
        snake.pop();
        }

    }

    //move one step horizontally
    function moveSnakeRight(){
        dx = 10;
        dy = 0;

        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        snake.unshift(head);

        const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
        if(didEatFood){
            score += 10;
            document.getElementById('score').innerHTML = score;
            highScore(score);
            createFood();
        }else{
        snake.pop();
        }
    }

    function moveSnakeLeft(){
        dx = -10;
        dy = 0;

        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        snake.unshift(head);

        const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
        if(didEatFood){
            score += 10;
            document.getElementById('score').innerHTML = score;
            highScore(score);
            createFood();
        }else{
        snake.pop();
        }
    }

    // move on step vertically

    function moveSnakeUp(){
    dx = 0;
    dy = -10;

    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    
    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    if(didEatFood){
            score += 10;
            document.getElementById('score').innerHTML = score; 
            highScore(score);          
            createFood();
    }else{
    snake.pop();
    }
    }

    //move one step down

    function moveSnakeDown(){
        dx = 0;
        dy = 10;

        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        snake.unshift(head);

        const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
        if(didEatFood){
            score += 10;
            document.getElementById('score').innerHTML = score;
            highScore(score);
            createFood();
        }else{
        snake.pop();
        }
    }

    //HighScore keeper funtion

    function highScore(score){
        if(localStorage.getItem('highScore') === null){
            localStorage.setItem('highScore', score);
        } else if (score > localStorage.getItem('highScore')) {
            localStorage.setItem('highScore', score);
        }
    
        let highScore = localStorage.getItem('highScore');
    
        if(highScore === null){
            highScore = 0;
        }
    
        document.getElementById('highScore').innerHTML = "High score: " + highScore;
    }

    //clear the canvas
    function clearCanvas(){
        game_cntx.fillStyle = 'white';
        game_cntx.strokeStyle = 'black';

        game_cntx.fillRect(0, 0, game_canvas.width, game_canvas.height);
        game_cntx.strokeRect(0, 0, game_canvas.width, game_canvas.height);
    }

    //This section is dedicated to the game loop\
    //The game loop is a function that calls itself recursively

    /*
    We want the snake to appear to move smoothly
    to do that we need to add a slight delay between each call, using the setTimeout function. We also need to make sure to call the draw function everytime we move the snake
    If we dont we will only see the snake move once
    */


    //food and score

    function randomTen(min, max){
        return Math.round((Math.random() * (max - min) + min) / 10) * 10;
    }

    /* This function will create a piece of food at a random location on the game canvas
    */

    function createFood(){
        foodX = randomTen(0, game_canvas.width - 10); //foodX = 10;
        foodY = randomTen(0, game_canvas.height - 10); //foodY = 10;

        snake.forEach(function isFoodOnSnake(part){
            const foodIsOnSnake = part.x == foodX && part.y == foodY;
            if(foodIsOnSnake){
                createFood();
            }
        });
    }
    /*
    * Draw the food on the canvas
    */

    function drawFood(){
        game_cntx.fillStyle = 'red';
        game_cntx.strokeStyle = 'darkred';

        //this will create a red square representing the food
        game_cntx.fillRect(foodX, foodY, 10, 10);
        
        game_cntx.strokeRect(foodX, foodY, 10, 10);
        //this will create a border around the food
    }

    //end game loop
    function didCollide(part){
        return part.x === snake[0].x && part.y === snake[0].y;
    }
    function didGameEnd(){
        for(let i = 4; i < snake.length; i++){
            if(didCollide(snake[i])){
                return true;
            }
        }
        const hitLeftWall = snake[0].x < 0;
        const hitRightWall = snake[0].x > game_canvas.width - 10;
        const hitTopWall = snake[0].y < 0;
        const hitBottomWall = snake[0].y > game_canvas.height - 10;

        return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
    }

    //main();

    function main(){
        if(gameState === 'paused') {
            return;
        }
        if(didGameEnd()){
            alert('Game Over');
            return;
        }
        timeoutId = setTimeout(function onTick(){
            changingDirection = false;
            clearCanvas();
            drawFood();
            moveSnake();
            drawSnake();
            main();
        }, 120);
    }

    
    document.addEventListener('keydown', changeDirection);

    document.getElementById('startButton').addEventListener('click', function() {
        if (gameState !== 'running') {
            gameState = 'running';
            main();
        }
    });

    document.getElementById('pauseButton').addEventListener('click', function() {
        if (gameState === 'running') {
            gameState = 'paused';
            pauseButton.innerHTML = 'Resume';
        } else if (gameState === 'paused') {
            gameState = 'running';
            pauseButton.innerHTML = 'Pause';
            main();
        }
    });

    document.getElementById('resetButton').addEventListener('click', function() {
        clearTimeout(timeoutId);
        gameState = 'stopped';
        snake =[{x: 150, y: 150},
                {x: 140, y: 150},
                {x: 130, y: 150},
                {x: 120, y: 150},
                {x: 110, y: 150}]; 
                // Reset the snake's position and direction
        pauseButton.innerHTML = 'Pause'; // Change the pause button text back to 'Pause'
        createFood();
        score = 0;
        gameState = 'running';
        main();
    });
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'p' || event.key === 'P') {
            const pauseButton = document.getElementById('pauseButton');
            if (gameState === 'running') {
                gameState = 'paused';
                pauseButton.innerText = 'Resume';
            } else if (gameState === 'paused') {
                gameState = 'running';
                pauseButton.innerText = 'Pause';
                main();
            }
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'r' || event.key === 'R') {
            clearTimeout(timeoutId);
            gameState = 'stopped';
            snake =[{x: 150, y: 150},
                    {x: 140, y: 150},
                    {x: 130, y: 150},
                    {x: 120, y: 150},
                    {x: 110, y: 150}]; 
                    // Reset the snake's position and direction
            pauseButton.innerHTML = 'Pause'; // Change the pause button text back to 'Pause'
            createFood();
            score = 0;
            gameState = 'running';
            main();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 's' || event.key === 'S') {
            if (gameState !== 'running') {
                gameState = 'running';
                main();
            }
        }
    });

    createFood();
}
