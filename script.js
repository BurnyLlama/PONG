import canvasCreate from "./engine/canvas.js"
import drawing from "./engine/drawing.js"
import update from "./engine/update.js"
import keyboard from "./engine/keyboard.js"

const { canvas, ctx, screenshot } = canvasCreate()
const draw = drawing(canvas, ctx)


let score = 0

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    speed: {
        x: 0.5,
        y: -0.5
    },
    draw: () => 
        draw.circ(ball.x, ball.y, 10, "white"),
    move: dt => {
        ball.x += ball.speed.x * dt
        ball.y += ball.speed.y * dt
    }
}


let paddle = {
    x: canvas.width / 2,
    y: canvas.height - 40,
    speed: 1,
    width: 200,
    draw: () => 
        draw.rect(paddle.x - paddle.width / 2, paddle.y, paddle.width, 10, "white"),
    move: (dt, coefficient) => 
        paddle.x += paddle.speed * dt * coefficient
}

const gameOver = () => {
    paddle.speed = 0

    draw.text("GAME OVER!", canvas.width / 2, 120, "white", "white", 1, 600, {
        family: "sans-serif",
        size: "64",
        textAlign: "center",
        textBaseline: "center",
        direction: "ltr"
    })

    draw.text(`Score: ${score}`, canvas.width / 2, 200, "white", "white", 1, 600, {
        family: "sans-serif",
        size: "32",
        textAlign: "center",
        textBaseline: "center",
        direction: "ltr"
    })

    draw.text("(Press [S] to take a screenshot or [R] to restart.)", canvas.width / 2, 250, "white", "white", 1, 600, {
        family: "sans-serif",
        size: "16",
        textAlign: "center",
        textBaseline: "center",
        direction: "ltr"
    })

    if (keyboard.key("KeyR")) {
        score = 0

        ball.x = canvas.width / 2
        ball.y = canvas.height / 2
        ball.speed.y *= -1

        paddle.x = canvas.width / 2
        paddle.speed = 1
    }
}


keyboard.init(key => {
    if (ball.y >= canvas.height) 
        if (key == "KeyS") 
            screenshot()
})

update(dt => {
    // Drawing
    draw.fill("black")
    ball.draw()
    paddle.draw()

    // Ball movement
    ball.move(dt)
    if (ball.y <= 10) 
        ball.speed.y *= -1

    if (ball.x <= 10 || ball.x >= canvas.width - 10) 
        ball.speed.x *= -1

    if (ball.x >= paddle.x - paddle.width / 2 && 
        ball.x <= paddle.x + paddle.width / 2 &&
        ball.y >= paddle.y - 10 && ball.y <= paddle.y) {
            score += 1
            ball.speed.y *= -1
        }

    if (ball.y >= canvas.height) 
        gameOver()


    // Paddle movement
    if (keyboard.key("KeyA"))
        paddle.move(dt, -1)

    if (keyboard.key("KeyD"))
        paddle.move(dt, 1)
}, 60)