const canvas = document.getElementById('game')
const context = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const paddleWidth = 18
const paddleHeight = 120
const paddleSpeed = 8
const ballRadius = 12
const initialBallSpeed = 8
const maxBallSpeed = 40
const netWidth = 5
const netColor = '#fff'
const backgroundColor = '#000'
const textColor = '#fff'

function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(canvas.width / 2 - netWidth / 2, i, netWidth, 10, netColor)
    }
}

function drawRect(x, y, width, height, color) {
    context.fillStyle = color
    context.fillRect(x, y, width, height)
}

function drawCircle(x, y, radius, color) {
    context.fillStyle = color
    context.beginPath()
    context.arc(x, y, radius, 0, Math.PI * 2, false)
    context.closePath()
    context.fill()
}

function drawText(text, x, y, fontSize = 60, fontWeight = 'bold', font = 'Courier New') {
    context.fillStyle = textColor
    context.font = `${fontWeight} ${fontSize}px ${font}`
    context.textAlign = 'center'
    context.fillText(text, x, y)
}

function createPaddle(x, y, width, height, color) {
    return { x, y, width, height, color, score: 0 }
}

function createBall(x, y, radius, velocityX, velocityY, color) {
    return { x, y, radius, velocityX, velocityY, color, speed: initialBallSpeed }
}

const user = createPaddle(0, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, '#fff')
const com = createPaddle(canvas.width - paddleWidth, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, '#fff')

const ball = createBall(canvas.width / 2, canvas.height / 2, ballRadius, initialBallSpeed, initialBallSpeed, '#fff')

canvas.addEventListener('mousemove', movePaddle)

function movePaddle(e) {
    const rect = canvas.getBoundingClientRect()
    user.y = e.clientY - rect.top - user.height / 2
}

function collision(b, p) {
    return (
        b.x + b.radius > p.x && b.x - b.radius < p.x + p.width && b.y + b.radius > p.y && b.y - b.radius < p.y + p.height
    )
}

function resetBall() {
    ball.x = canvas.width / 2
    ball.y = Math.random() * (canvas.height - ball.radius * 2) + ball.radius
    ball.velocityX = -ball.velocityX
    ball.speed = initialBallSpeed
}

function update() {
    if (ball.x - ball.radius < 0) {
        com.score++
        resetBall()
    } else if (ball.x + ball.radius > canvas.width) {
        user.score++
        resetBall()
    }

    ball.x += ball.velocityX
    ball.y += ball.velocityY

    com.y += (ball.y - (com.y + com.height / 2)) * 0.1

    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY
    }

    let player = ball.x + ball.radius < canvas.width / 2 ? user : com
    if (collision(ball, player)) {
        const collidePoint = ball.y - (player.y + player.height / 2)
        const collisionAngle = (Math.PI / 4) * (collidePoint / (player.height / 2))
        const direction = ball.x + ball.radius < canvas.width / 2 ? 1 : -1
        ball.velocityX = direction * ball.speed * Math.cos(collisionAngle)
        ball.velocityY = ball.speed * Math.sin(collisionAngle)

        ball.speed += 0.2;
        if (ball.speed > maxBallSpeed) {
            ball.speed = maxBallSpeed
        }
    }
}

function render() {
    drawRect(0, 0, canvas.width, canvas.height, backgroundColor)
    drawNet()

    drawText(user.score, canvas.width / 4, canvas.height / 2)
    drawText(com.score, (3 * canvas.width) / 4, canvas.height / 2)

    drawRect(user.x, user.y, user.width, user.height, user.color)
    drawRect(com.x, com.y, com.width, com.height, com.color)
    
    drawCircle(ball.x, ball.y, ball.radius, ball.color)
}

function gameLoop() {
    update()
    render()
}

const framePerSec = 60
setInterval(gameLoop, 1000 / framePerSec)