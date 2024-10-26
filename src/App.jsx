import React, { useState } from 'react';
import './App.css';
import Swal from 'sweetalert2';

function App() {
  const [gradoPolinomio, setGradoPolinomio] = useState('');
  const [coeficientes, setCoeficientes] = useState([]);
  const [divisores, setDivisores] = useState([]);
  const [raices, setRaices] = useState([]);
  const [logVisual, setLogVisual] = useState([]);
  

  const handleGradoChange = (e) => {
    setGradoPolinomio(e.target.value);
  };

  const handleCoeficienteChange = (index, value) => {
    const newCoeficientes = [...coeficientes];
    newCoeficientes[index] = parseFloat(value);
    setCoeficientes(newCoeficientes);
  };

  const calcularDivisoresRacionales = (coeficientes) => {
    let divisoresP = new Set();
    let divisoresQ = new Set();

    let primerTermino = Math.abs(coeficientes[0]);
    let ultimoTermino = Math.abs(coeficientes[coeficientes.length - 1]);

    for (let i = 1; i <= ultimoTermino; i++) {
      if (ultimoTermino % i === 0) {
        divisoresP.add(i);
        divisoresP.add(-i);
      }
    }

    for (let i = 1; i <= primerTermino; i++) {
      if (primerTermino % i === 0) {
        divisoresQ.add(i);
        divisoresQ.add(-i);
      }
    }

    let divisoresRacionales = new Set();
    divisoresP.forEach(p => {
      divisoresQ.forEach(q => {
        divisoresRacionales.add(p / q);
      });
    });

    return Array.from(divisoresRacionales);
  };

  const divisionSintetica = (divisoresRacionales, coeficientes) => {
    let raices = new Set();
    let logVisual = [];

    function encontrarRaices(divisores, coeficientes, raices) {
      for (let divisor of divisores) {
        let resultadoDivision = [coeficientes[0]];
        let multiplicaciones = [];
        let resultados = [coeficientes[0]];

        // Proceso de división sintética
        for (let i = 1; i < coeficientes.length; i++) {
          let multiplicacion = divisor * resultados[i - 1];
          multiplicaciones.push(multiplicacion);
          let suma = coeficientes[i] + multiplicacion;
          resultados.push(suma);
        }

        // Solo guardamos el log si el último valor en resultados es 0
        if (Math.abs(resultados[resultados.length - 1]) < 1e-6) {
          raices.add(divisor);
          logVisual.push({
            divisor,
            coeficientes: [...coeficientes],
            multiplicaciones: [...multiplicaciones],
            resultados: [...resultados]
          });

          // Actualizamos los coeficientes quitando el último término (residuo)
          coeficientes = resultados.slice(0, resultados.length - 1);

          // Recalculamos los divisores para el polinomio reducido
          let nuevosDivisores = calcularDivisoresRacionales(coeficientes);
          encontrarRaices(nuevosDivisores, coeficientes, raices);
          return;
        }
      }
    }

    encontrarRaices(divisoresRacionales, coeficientes, raices);
    setLogVisual(logVisual);
    return Array.from(raices);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const divisores = calcularDivisoresRacionales(coeficientes);
    setDivisores(divisores);
    const raices = divisionSintetica(divisores, coeficientes);
    setRaices(raices);
  
    // Verificar si se encontraron todas las raíces
    if (raices.length < coeficientes.length - 1) {
      Swal.fire({
        title: 'Advertencia',
        text: 'No se encontraron todas las raíces racionales.',
        icon: 'warning',
        timer: 1500,
        showConfirmButton: false
      });
    } else {
      // Si se encuentran todas las raíces
      Swal.fire({
        title: 'Éxito',
        text: 'Se encontraron todas las raíces racionales.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };
  
  

  const generarPolinomio = (coeficientes) => {
    return coeficientes
      .map((coef, idx) => {
        const grado = coeficientes.length - idx - 1;
        let signo = coef > 0 && idx !== 0 ? '+' : ''; // Si el coef es positivo y no es el primer término, agregar "+"
  
        if (grado === 0) return `${signo}${coef}`; // Término independiente
        if (grado === 1) return `${signo}${coef}x`; // Término de grado 1
        return `${signo}${coef}x^${grado}`; // Otros términos
      })
      .filter(term => !term.startsWith("0")) // Filtramos los términos con coeficiente 0
      .join(" "); // Unimos los términos con un espacio para separar los signos
  };
  
  const handleClear = () => {
    setGradoPolinomio('');
    setCoeficientes([]);
    setDivisores([]);
    setRaices([]);
    setLogVisual([]);
  };
  

  return (
    <div className="App">
      <h1>División Sintética</h1>
      <h4>
        Alumnos:        
      </h4>
      <h4>
        Uziel López Hernández
      </h4>
      <h4>
        Daniel Yosef Santiago García
      </h4>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Grado del Polinomio:</label>
          <input type="number" value={gradoPolinomio} onChange={handleGradoChange} />
        </div>
        {[...Array(parseInt(gradoPolinomio) + 1 || 0)].map((_, index) => (
          <div key={index}>
            <label>Coeficiente de x^{gradoPolinomio - index}:</label>
            <input type="number" onChange={(e) => handleCoeficienteChange(index, e.target.value)} />
          </div>
        ))}
        <br />
        <button type="submit" className="button-group">Calcular</button>
        <button type="button" className="button-group" onClick={handleClear}>Limpiar</button>


      </form>

      <div>
      <h2>Polinomio:</h2>
      <p>{generarPolinomio(coeficientes)}</p>
      <h2>Raíces Encontradas:</h2>
<p>
  {raices.map(raiz => 
    Number.isInteger(raiz) ? raiz : raiz.toFixed(4)
  ).join(', ')}
</p>


        <h2>Proceso:</h2>
        <div className="division-sintetica">
          {logVisual.map((logItem, index) => (
            <div key={index} className="division-step">
              <h3>Divisor: {Number.isInteger(logItem.divisor) 
                  ? logItem.divisor 
                  : logItem.divisor.toFixed(4)}</h3>
              <table>
              <thead>
                <tr>
                  <th>Polinomio</th>
                  {logItem.coeficientes.map((coef, idx) => (
                    <th key={idx}>{coef}</th>
                  ))}
                  <th>Divisor</th> {/* Columna adicional para el divisor */}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Multiplicaciones</td>
                  <td></td> {/* No hay multiplicación en la primera celda */}
                  {logItem.multiplicaciones.map((multiplicacion, idx) => (
                    <td key={idx} className={idx === logItem.multiplicaciones.length - 1 ? 'borde-derecho' : ''}>
                      {multiplicacion}
                    </td>
                  ))}
                  <td>{Number.isInteger(logItem.divisor) 
                  ? logItem.divisor 
                  : logItem.divisor.toFixed(4)}
                  </td> {/* Se muestra el divisor al final con 4 decimales */}
                </tr>
                <tr>
                  <td>Resultados</td>
                  {logItem.resultados.map((resultado, idx) => (
                    <td key={idx} className={idx === logItem.resultados.length - 1 ? 'borde-derecho' : ''}>
                      {resultado}
                    </td>
                  ))}
                  <td></td>
                </tr>
              </tbody>
            </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
