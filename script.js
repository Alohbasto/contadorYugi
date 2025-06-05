window.addEventListener("load", function () {
  inicioJugador(); /*Con esto ya lo llamas */
});
// Espera a que toda la página cargue antes de mostrar quién inicia. Antes se ejecutaba inmediatamente.
let lp_p1 = 8000;
let lp_p2 = 8000;
let jugadorActual = 1; //comprobar quien inicia la calc
let calcAbierta = false; // calc esta cerrada
let historial = [];
let calculadoraValor = "0";
let calculadoraRotacion = 0;
let previoValor = "";
let operacion = null;
let resetPantalla = false;

function inicioJugador() {
  let resultadoMoneda = Math.round(Math.random() * 1);
  if (resultadoMoneda === 1) {
    alert("Inicia el jugador 1");
  } else {
    alert("Inicia el jugador 2");
  }
}
// botones jugadores
function tirarDado() {
  let resultadoDado = Math.floor(Math.random() * 6) + 1;
  alert(resultadoDado);
}

function tirarMoneda() {
  let resultadoMoneda = Math.round(Math.random() * 1);
  if (resultadoMoneda === 1) {
    alert("Cara");
  } else {
    alert("Cruz");
  }
}

//Seccion Lp

function lpModCalculadora(jugador) {
  jugadorActual = jugador;
  // // Rotación basada en el jugador
  // calculadoraRotacion = jugador === 1 ? 90 : 270;
  // aplicarRotacionCalculadora();
  // //
  document.getElementById("lpModal").showModal();
  const modal = document.getElementById("lpModal");
  const vidaActual = jugador === 1 ? lp_p1 : lp_p2;
}
function modificarLifePoints(cantidad) {
  //guardar valor en historial.
  historial.push({
    p1: lp_p1,
    p2: lp_p2,
    accion: `Jugador ${jugadorActual}: ${cantidad > 0 ? "+" : ""}${cantidad}`,
    timestamp: new Date().toLocaleTimeString(), //saber cuando ocurrio
  });
  if (jugadorActual === 1) {
    lp_p1 = Math.max(0, lp_p1 + cantidad); // No puede bajar de 0
    document.getElementById("lifePoints__P1").textContent = lp_p1;
  } else {
    lp_p2 = Math.max(0, lp_p2 + cantidad);
    document.getElementById("lifePoints__P2").textContent = lp_p2;
  }

  if (lp_p1 <= 0 || lp_p2 <= 0) {
    cerrarModal("lpModal");
    setTimeout(victoria, 300);
    // setTimeout da tiempo a que se cierre el modal antes de mostrar victoria
  }
}
function cerrarModal(id) {
  document.getElementById(id).close();
  // Resetear rotación al cerrar
  document.getElementById(id).style.setProperty("--rotacion", "0deg");
}

//boton calculadora
function abrirCalculadora() {
  if (calcAbierta) return;
  calcAbierta = true;
  // // Rotación basada en el jugador
  // calculadoraRotacion = jugador === 1 ? 90 : 270;
  // aplicarRotacionCalculadora();
  // limpiarCalculadora();
  // //
  document.getElementById("CalculadoraModal").showModal();
}
function aplicarRotacionCalculadora() {
  const calculadoras = document.querySelectorAll(".modal");
  calculadoras.forEach((modal) => {
    modal.style.transform = `rotate(${calculadoraRotacion}deg)`;
  });
}
function cerrarCalculadora() {
  calcAbierta = false;
  document.getElementById("CalculadoraModal").close();
}
// Actualizar pantalla
function actualizarPantallaCalculadora() {
  const pantalla = document.getElementById("pantallaCalculadora");
  pantalla.value = calculadoraValor;
}

// Manejar entrada de números
function entradaCalculadora(numero) {
  if (calculadoraValor === "0" || resetPantalla) {
    calculadoraValor = numero;
    resetPantalla = false;
  } else {
    calculadoraValor += numero;
  }
  actualizarPantallaCalculadora();
}

// Manejar operaciones
function operacionCalculadora(op) {
  if (operacion !== null) calcularResultado();
  previoValor = calculadoraValor;
  operacion = op;
  resetPantalla = true;
}

// Calcular resultado
function calcularResultado() {
  let resultado;
  const previo = parseFloat(previoValor);
  const actual = parseFloat(calculadoraValor);

  if (isNaN(previo) || isNaN(actual)) return;

  switch (operacion) {
    case "+":
      resultado = previo + actual;
      break;
    case "-":
      resultado = previo - actual;
      break;
    case "*":
      resultado = previo * actual;
      break;
    case "/":
      if (actual === 0) {
        alert("No se puede dividir por cero");
        return;
      }
      resultado = previo / actual;
      break;
    default:
      return;
  }

  calculadoraValor = resultado.toString();
  operacion = null;
  resetPantalla = true;
  actualizarPantallaCalculadora();
}

// Limpiar calculadora
function limpiarCalculadora() {
  calculadoraValor = "0";
  previoValor = "";
  operacion = null;
  actualizarPantallaCalculadora();
}

// Borrar último dígito
function retrocesoCalculadora() {
  calculadoraValor = calculadoraValor.slice(0, -1);
  if (calculadoraValor === "") calculadoraValor = "0";
  actualizarPantallaCalculadora();
}

// Modificar abrirCalculadora para usar nombres consistentes
function abrirCalculadora() {
  if (calcAbierta) return;
  calcAbierta = true;
  limpiarCalculadora();
  document.getElementById("CalculadoraModal").showModal();
}
// botones globales
function reiniciarJuego() {
  if (confirm("¿Quieres reiniciar la partida?")) {
    lp_p1 = 8000;
    lp_p2 = 8000;
    historial = [];
    document.getElementById("lifePoints__P1").textContent = lp_p1;
    document.getElementById("lifePoints__P2").textContent = lp_p2;
    inicioJugador();
  }
}
function deshacer() {
  if (historial.length === 0) return alert("No hay acciones para deshacer.");
  const ultimaAccion = historial.pop();
  lp_p1 = ultimaAccion.p1;
  lp_p2 = ultimaAccion.p2;

  document.getElementById("lifePoints__P1").textContent = lp_p1;
  document.getElementById("lifePoints__P2").textContent = lp_p2;

  console.log(`Acción deshecha: ${ultimaAccion.accion}`);
  //  Para que puedas ver en las herramientas de desarrollador qué acción se deshizo.
}

//Victoria
function victoria() {
  if (lp_p2 <= 0) {
    alert("Jugador 1 gana");
  } else if (lp_p1 <= 0) {
    alert("Jugador 2 gana");
  } else if (lp_p1 <= 0 && lp_p2 <= 0) {
    alert("¡Empate! Ambos jugadores han perdido.");
  }
}
//opciones kobalsky
function opciones() {
  alert("En desarrollo");
}

// modificar imagen fondo
// Lista de fondos disponibles
const fondosDisponibles = [
  { nombre: "Albaz", archivo: "albaz.webp" },
  { nombre: "Aqua", archivo: "aqua.webp" },
  { nombre: "Cyber Dragon", archivo: "cyberDragon.webp" },
  { nombre: "Derrota Almas", archivo: "derrota_almas.webp" },
  { nombre: "Destiny Hero", archivo: "destinyHero.webp" },
  { nombre: "Dino", archivo: "dino.webp" },
  {
    nombre: "Doncella de Ojos Azules",
    archivo: "doncella_de_azules_ojos.webp",
  },
  {
    nombre: "Dragón Blanco de Ojos Azules",
    archivo: "dragon_blanco_de_ojos_azules.webp",
  },
  { nombre: "Dreaming Nemleria", archivo: "Dreaming_Nemleria.webp" },
  { nombre: "Espadachín Llama", archivo: "espadachinLlama.webp" },
  { nombre: "Evil Hero", archivo: "evilhero.webp" },
  { nombre: "Invasion", archivo: "invasion.webp" },
  { nombre: "Jinzo", archivo: "jinzo.webp" },
  { nombre: "Machine", archivo: "machine.webp" },
  { nombre: "Mikanko", archivo: "Mikanko.webp" },
  { nombre: "Neos", archivo: "neos.webp" },
  { nombre: "Punk", archivo: "punk.webp" },
  { nombre: "Red Dragon Archfiend", archivo: "RedDragonArchfiend.webp" },
  { nombre: "Stardust", archivo: "stardust.webp" },
  { nombre: "Traptrix Archetype", archivo: "TraptrixArchetype.webp" },
  { nombre: "Trololo", archivo: "trololo.webp" },
  { nombre: "Vampire", archivo: "vampire.webp" },
  { nombre: "Zombie", archivo: "zombie.webp" },
];
// Fondos actuales
let fondoP1 = "jinzo.webp";
let fondoP2 = "albaz.webp";

function opciones() {
  document.getElementById("opcionesModal").showModal();
}

function cambiarFondo(jugador) {
  const selectId = jugador === 1 ? "fondoP1Select" : "fondoP2Select";
  const nuevoFondo = document.getElementById(selectId).value;
  
  if (jugador === 1) {
    fondoP1 = nuevoFondo;
    document.getElementById("jugador1").style.backgroundImage = `url(../fondos/${nuevoFondo})`;
  } else {
    fondoP2 = nuevoFondo;
    document.getElementById("jugador2").style.backgroundImage = `url(../fondos/${nuevoFondo})`;
  }
}
