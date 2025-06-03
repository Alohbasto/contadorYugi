// Variables globales
let player1Life = 8000;
let player2Life = 8000;
let historial = []; // Para función deshacer
let calculadoraAbierta = false;

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar life points iniciales
    actualizarLifePoints();
    
    // Event listeners para botones LP
    document.getElementById('lpMod__P1').addEventListener('click', () => abrirCalculadoraLP(1));
    document.getElementById('lpMod__P2').addEventListener('click', () => abrirCalculadoraLP(2));
    
    // Event listeners para dados
    document.getElementById('dado__P1').addEventListener('click', () => tirarDado(1));
    document.getElementById('dado__P2').addEventListener('click', () => tirarDado(2));
    
    // Event listeners para monedas
    document.getElementById('moneda__P1').addEventListener('click', () => tirarMoneda(1));
    document.getElementById('moneda__P2').addEventListener('click', () => tirarMoneda(2));
    
    // Event listeners para calculadora
    document.getElementById('cal__P1').addEventListener('click', abrirCalculadora);
    document.getElementById('cal__P2').addEventListener('click', abrirCalculadora);
    
    // Event listeners para configuraciones
    const configButtons = document.querySelectorAll('#configuraciones button');
    configButtons[0].addEventListener('click', reiniciarJuego); // Reinicio
    configButtons[1].addEventListener('click', abrirOpciones); // Opciones
    configButtons[2].addEventListener('click', deshacer); // Deshacer
});

// Actualizar life points en pantalla
function actualizarLifePoints() {
    document.getElementById('lifePoints__P1').textContent = player1Life;
    document.getElementById('lifePoints__P2').textContent = player2Life;
    
    // Animación de cambio
    const p1Element = document.getElementById('lifePoints__P1');
    const p2Element = document.getElementById('lifePoints__P2');
    
    p1Element.style.transform = 'scale(1.1)';
    p2Element.style.transform = 'scale(1.1)';
    
    setTimeout(() => {
        p1Element.style.transform = 'scale(1)';
        p2Element.style.transform = 'scale(1)';
    }, 200);
    
    // Verificar ganador
    verificarGanador();
}

// Abrir calculadora para modificar LP
function abrirCalculadoraLP(jugador) {
    if (calculadoraAbierta) return;
    
    calculadoraAbierta = true;
    const vidaActual = jugador === 1 ? player1Life : player2Life;
    
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.id = 'calculadora-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    // Crear calculadora
    const calc = document.createElement('div');
    calc.style.cssText = `
        background: linear-gradient(135deg, #2c3e50, #34495e);
        padding: 30px;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        color: white;
        text-align: center;
        min-width: 300px;
        border: 2px solid #ffd700;
    `;
    
    calc.innerHTML = `
        <h3 style="margin-bottom: 20px; color: #ffd700;">Jugador ${jugador} - LP: ${vidaActual}</h3>
        <div style="display: grid; grid-template-colu: 20px;">
            <button onclick="cambiarLP(${jugador}, -100)" class="calc-btn subtract">-100</button>
            <button onclick="cambiarLP(${jugador}, -500)" class="calc-btn subtract">-500</button>
            <button onclick="cambiarLP(${jugador}, -1000)" class="mns: repeat(3, 1fr); gap: 10px; margin-bottomcalc-btn subtract">-1000</button>
            <button onclick="cambiarLP(${jugador}, 100)" class="calc-btn add">+100</button>
            <button onclick="cambiarLP(${jugador}, 500)" class="calc-btn add">+500</button>
            <button onclick="cambiarLP(${jugador}, 1000)" class="calc-btn add">+1000</button>
        </div>
        <div style="margin-bottom: 20px;">
            <input type="number" id="custom-amount" placeholder="Cantidad personalizada" 
                   style="padding: 10px; border-radius: 10px; border: none; text-align: center; width: 200px;">
        </div>
        <div style="display: flex; gap: 10px; justify-content: center;">
            <button onclick="cambiarLPCustom(${jugador}, false)" class="calc-btn subtract">Restar</button>
            <button onclick="cambiarLPCustom(${jugador}, true)" class="calc-btn add">Sumar</button>
        </div>
        <button onclick="cerrarCalculadoraLP()" style="margin-top: 20px; padding: 10px 20px; background: #e74c3c; color: white; border: none; border-radius: 10px; cursor: pointer;">Cerrar</button>
    `;
    
    // Estilos para botones de calculadora
    const style = document.createElement('style');
    style.textContent = `
        .calc-btn {
            padding: 15px;
            border: none;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .calc-btn.add {
            background: linear-gradient(135deg, #27ae60, #2ecc71);
            color: white;
        }
        .calc-btn.subtract {
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white;
        }
        .calc-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
    `;
    document.head.appendChild(style);
    
    overlay.appendChild(calc);
    document.body.appendChild(overlay);
    
    // Cerrar al hacer click fuera
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            cerrarCalculadoraLP();
        }
    });
}

// Cambiar LP con botones predefinidos
function cambiarLP(jugador, cantidad) {
    // Guardar estado para deshacer
    historial.push({
        player1Life: player1Life,
        player2Life: player2Life,
        accion: `Jugador ${jugador}: ${cantidad > 0 ? '+' : ''}${cantidad} LP`
    });
    
    if (jugador === 1) {
        player1Life = Math.max(0, player1Life + cantidad);
    } else {
        player2Life = Math.max(0, player2Life + cantidad);
    }
    
    actualizarLifePoints();
    cerrarCalculadoraLP();
    
    // Mostrar cambio temporalmente
    mostrarCambio(jugador, cantidad);
}

// Cambiar LP con cantidad personalizada
function cambiarLPCustom(jugador, sumar) {
    const input = document.getElementById('custom-amount');
    const cantidad = parseInt(input.value);
    
    if (isNaN(cantidad) || cantidad <= 0) {
        alert('Por favor, introduce una cantidad válida');
        return;
    }
    
    const cambio = sumar ? cantidad : -cantidad;
    cambiarLP(jugador, cambio);
}

// Cerrar calculadora LP
function cerrarCalculadoraLP() {
    const overlay = document.getElementById('calculadora-overlay');
    if (overlay) {
        overlay.remove();
    }
    calculadoraAbierta = false;
}

// Mostrar cambio visual
function mostrarCambio(jugador, cantidad) {
    const elemento = document.getElementById(`lifePoints__P${jugador}`);
    const cambioDiv = document.createElement('div');
    
    cambioDiv.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 3rem;
        font-weight: bold;
        color: ${cantidad > 0 ? '#27ae60' : '#e74c3c'};
        z-index: 100;
        pointer-events: none;
        text-shadow: 0 0 10px rgba(0,0,0,0.8);
    `;
    
    cambioDiv.textContent = `${cantidad > 0 ? '+' : ''}${cantidad}`;
    elemento.parentElement.style.position = 'relative';
    elemento.parentElement.appendChild(cambioDiv);
    
    // Animación y eliminación
    setTimeout(() => {
        cambioDiv.style.transform = 'translate(-50%, -100px)';
        cambioDiv.style.opacity = '0';
        cambioDiv.style.transition = 'all 1s ease';
    }, 100);
    
    setTimeout(() => {
        cambioDiv.remove();
    }, 1100);
}

// Tirar dado
function tirarDado(jugador) {
    const resultado = Math.floor(Math.random() * 6) + 1;
    
    // Crear efecto visual
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    const dadoDiv = document.createElement('div');
    dadoDiv.style.cssText = `
        background: white;
        width: 150px;
        height: 150px;
        border-radius: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 6rem;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        animation: dadoSpin 1s ease-out forwards;
    `;
    
    // Animación del dado
    const keyframes = `
        @keyframes dadoSpin {
            0% { transform: rotateX(0deg) rotateY(0deg) scale(0.5); }
            50% { transform: rotateX(180deg) rotateY(180deg) scale(1.2); }
            100% { transform: rotateX(360deg) rotateY(360deg) scale(1); }
        }
    `;
    
    if (!document.getElementById('dado-keyframes')) {
        const style = document.createElement('style');
        style.id = 'dado-keyframes';
        style.textContent = keyframes;
        document.head.appendChild(style);
    }
    
    dadoDiv.textContent = '🎲';
    
    overlay.appendChild(dadoDiv);
    document.body.appendChild(overlay);
    
    // Mostrar resultado después de la animación
    setTimeout(() => {
        dadoDiv.textContent = resultado;
        dadoDiv.style.background = '#ffd700';
        dadoDiv.style.color = '#333';
    }, 1000);
    
    // Cerrar después de mostrar resultado
    setTimeout(() => {
        overlay.remove();
    }, 3000);
    
    // Cerrar al hacer click
    overlay.addEventListener('click', () => overlay.remove());
}

// Tirar moneda
function tirarMoneda(jugador) {
    const resultado = Math.random() < 0.5 ? 'CARA' : 'CRUZ';
    
    // Crear efecto visual
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    const monedaDiv = document.createElement('div');
    monedaDiv.style.cssText = `
        background: #ffd700;
        width: 150px;
        height: 150px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 4rem;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        animation: monedaSpin 1.5s ease-out forwards;
        color: #333;
        font-weight: bold;
    `;
    
    // Animación de la moneda
    const keyframes = `
        @keyframes monedaSpin {
            0% { transform: rotateY(0deg) scale(0.5); }
            50% { transform: rotateY(900deg) scale(1.2); }
            100% { transform: rotateY(1800deg) scale(1); }
        }
    `;
    
    if (!document.getElementById('moneda-keyframes')) {
        const style = document.createElement('style');
        style.id = 'moneda-keyframes';
        style.textContent = keyframes;
        document.head.appendChild(style);
    }
    
    monedaDiv.textContent = '🪙';
    
    overlay.appendChild(monedaDiv);
    document.body.appendChild(overlay);
    
    // Mostrar resultado después de la animación
    setTimeout(() => {
        monedaDiv.textContent = resultado;
        monedaDiv.style.fontSize = '2rem';
    }, 1500);
    
    // Cerrar después de mostrar resultado
    setTimeout(() => {
        overlay.remove();
    }, 4000);
    
    // Cerrar al hacer click
    overlay.addEventListener('click', () => overlay.remove());
}

// Abrir calculadora general
function abrirCalculadora() {
    if (calculadoraAbierta) return;
    
    calculadoraAbierta = true;
    
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.id = 'calc-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    // Crear calculadora
    const calc = document.createElement('div');
    calc.style.cssText = `
        background: linear-gradient(135deg, #2c3e50, #34495e);
        padding: 20px;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        color: white;
        text-align: center;
        border: 2px solid #ffd700;
    `;
    
    calc.innerHTML = `
        <h3 style="margin-bottom: 20px; color: #ffd700;">Calculadora</h3>
        <input type="text" id="calc-display" readonly 
               style="width: 250px; padding: 15px; font-size: 1.5rem; text-align: right; 
                      border: none; border-radius: 10px; margin-bottom: 20px; background: #ecf0f1;">
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; max-width: 280px;">
            <button onclick="calcClear()" class="calc-key clear">C</button>
            <button onclick="calcBackspace()" class="calc-key">⌫</button>
            <button onclick="calcInput('/')" class="calc-key operator">÷</button>
            <button onclick="calcInput('*')" class="calc-key operator">×</button>
            
            <button onclick="calcInput('7')" class="calc-key">7</button>
            <button onclick="calcInput('8')" class="calc-key">8</button>
            <button onclick="calcInput('9')" class="calc-key">9</button>
            <button onclick="calcInput('-')" class="calc-key operator">-</button>
            
            <button onclick="calcInput('4')" class="calc-key">4</button>
            <button onclick="calcInput('5')" class="calc-key">5</button>
            <button onclick="calcInput('6')" class="calc-key">6</button>
            <button onclick="calcInput('+')" class="calc-key operator">+</button>
            
            <button onclick="calcInput('1')" class="calc-key">1</button>
            <button onclick="calcInput('2')" class="calc-key">2</button>
            <button onclick="calcInput('3')" class="calc-key">3</button>
            <button onclick="calcEquals()" class="calc-key equals" style="grid-row: span 2;">=</button>
            
            <button onclick="calcInput('0')" class="calc-key" style="grid-column: span 2;">0</button>
            <button onclick="calcInput('.')" class="calc-key">.</button>
        </div>
        <button onclick="cerrarCalculadora()" style="margin-top: 20px; padding: 10px 20px; background: #e74c3c; color: white; border: none; border-radius: 10px; cursor: pointer;">Cerrar</button>
    `;
    
    // Estilos para calculadora
    const style = document.createElement('style');
    style.textContent = `
        .calc-key {
            padding: 15px;
            border: none;
            border-radius: 10px;
            font-size: 1.2rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s ease;
            background: #ecf0f1;
            color: #2c3e50;
        }
        .calc-key:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        .calc-key.operator {
            background: #3498db;
            color: white;
        }
        .calc-key.equals {
            background: #27ae60;
            color: white;
        }
        .calc-key.clear {
            background: #e74c3c;
            color: white;
        }
    `;
    document.head.appendChild(style);
    
    overlay.appendChild(calc);
    document.body.appendChild(overlay);
    
    // Cerrar al hacer click fuera
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            cerrarCalculadora();
        }
    });
}

// Funciones de calculadora
function calcInput(value) {
    const display = document.getElementById('calc-display');
    display.value += value;
}

function calcClear() {
    document.getElementById('calc-display').value = '';
}

function calcBackspace() {
    const display = document.getElementById('calc-display');
    display.value = display.value.slice(0, -1);
}

function calcEquals() {
    const display = document.getElementById('calc-display');
    try {
        const result = eval(display.value.replace('×', '*').replace('÷', '/'));
        display.value = result;
    } catch (error) {
        display.value = 'Error';
        setTimeout(() => calcClear(), 1500);
    }
}

function cerrarCalculadora() {
    const overlay = document.getElementById('calc-overlay');
    if (overlay) {
        overlay.remove();
    }
    calculadoraAbierta = false;
}

// Verificar ganador
function verificarGanador() {
    if (player1Life <= 0 && player2Life <= 0) {
        setTimeout(() => {
            mostrarGanador('¡EMPATE!', 'Ambos jugadores han perdido');
        }, 500);
    } else if (player1Life <= 0) {
        setTimeout(() => {
            mostrarGanador('¡JUGADOR 2 GANA!', '🎉 Victoria 🎉');
        }, 500);
    } else if (player2Life <= 0) {
        setTimeout(() => {
            mostrarGanador('¡JUGADOR 1 GANA!', '🎉 Victoria 🎉');
        }, 500);
    }
}

// Mostrar ganador con estilo
function mostrarGanador(titulo, subtitulo) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        z-index: 2000;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    const winnerDiv = document.createElement('div');
    winnerDiv.style.cssText = `
        background: linear-gradient(135deg, #ffd700, #ffed4e);
        padding: 50px;
        border-radius: 30px;
        text-align: center;
        color: #333;
        box-shadow: 0 30px 80px rgba(0,0,0,0.5);
        animation: winnerAnimation 1s ease-out forwards;
    `;
    
    winnerDiv.innerHTML = `
        <h1 style="font-size: 3rem; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">${titulo}</h1>
        <p style="font-size: 1.5rem; margin-bottom: 30px;">${subtitulo}</p>
        <button onclick="reiniciarJuego(); this.parentElement.parentElement.remove();" 
                style="padding: 15px 30px; font-size: 1.2rem; background: #27ae60; color: white; 
                       border: none; border-radius: 15px; cursor: pointer; font-weight: bold;">
            Jugar de Nuevo
        </button>
    `;
    
    // Animación de ganador
    const keyframes = `
        @keyframes winnerAnimation {
            0% { transform: scale(0.3) rotate(-180deg); opacity: 0; }
            50% { transform: scale(1.1) rotate(0deg); opacity: 1; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
    `;
    
    if (!document.getElementById('winner-keyframes')) {
        const style = document.createElement('style');
        style.id = 'winner-keyframes';
        style.textContent = keyframes;
        document.head.appendChild(style);
    }
    
    overlay.appendChild(winnerDiv);
    document.body.appendChild(overlay);
}

// Reiniciar juego
function reiniciarJuego() {
    if (confirm('¿Estás seguro de que quieres reiniciar el juego?')) {
        player1Life = 8000;
        player2Life = 8000;
        historial = [];
        actualizarLifePoints();
        
        // Efecto visual de reinicio
        const jugadores = document.querySelectorAll('#jugador1, #jugador2');
        jugadores.forEach(jugador => {
            jugador.style.animation = 'resetAnimation 0.5s ease-out';
        });
        
        // Limpiar animación
        setTimeout(() => {
            jugadores.forEach(jugador => {
                jugador.style.animation = '';
            });
        }, 500);
    }
}

// Deshacer último cambio
function deshacer() {
    if (historial.length > 0) {
        const ultimoEstado = historial.pop();
        player1Life = ultimoEstado.player1Life;
        player2Life = ultimoEstado.player2Life;
        actualizarLifePoints();
        
        // Mostrar qué se deshizo
        const mensaje = document.createElement('div');
        mensaje.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 1500;
            font-size: 1.2rem;
            text-align: center;
        `;
        mensaje.textContent = `Deshecho: ${ultimoEstado.accion}`;
        document.body.appendChild(mensaje);
        
        setTimeout(() => mensaje.remove(), 2000);
    } else {
        alert('No hay acciones para deshacer');
    }
}

// Abrir opciones (placeholder)
function abrirOpciones() {
    alert('Próximamente: Configuración de sonidos, temas, etc.');
}

// Animación de reinicio
const resetKeyframes = `
    @keyframes resetAnimation {
        0% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(0.95); }
        100% { opacity: 1; transform: scale(1); }
    }
`;

if (!document.getElementById('reset-keyframes')) {
    const style = document.createElement('style');
    style.id = 'reset-keyframes';
    style.textContent = resetKeyframes;
    document.head.appendChild(style);
}