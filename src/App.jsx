import React, { useState } from 'react';
import './App.css';

function App() {
  const [gradoPolinomio, setGradoPolinomio] = useState('');
  const [coeficientes, setCoeficientes] = useState([]);
  const [divisores, setDivisores] = useState([]);
  const [raices, setRaices] = useState([]);
  const [log, setLog] = useState([]);

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
    let gradoActual = coeficientes.length - 1;
    let log = [];

    function encontrarRaices(divisores, coeficientes, raices) {
      for (let divisor of divisores) {
        let resultadoDivision = [coeficientes[0]];

        for (let i = 1; i < coeficientes.length; i++) {
          let nuevoValor = coeficientes[i] + divisor * resultadoDivision[i - 1];
          resultadoDivision.push(nuevoValor);
        }

        log.push(`Resultado de la división sintética con divisor ${divisor} : [${resultadoDivision.join(', ')}]`);

        if (Math.abs(resultadoDivision[resultadoDivision.length - 1]) < 1e-6) {
          raices.add(divisor);
          coeficientes = resultadoDivision.slice(0, resultadoDivision.length - 1);
          gradoActual = coeficientes.length - 1;

          log.push(`Raiz encontrada: ${divisor}`);
          log.push(`Grado actual: ${gradoActual}`);
          log.push(`Nuevo polinomio: [${coeficientes.join(', ')}]`);

          if (gradoActual === 0) return;

          let nuevosDivisores = calcularDivisoresRacionales(coeficientes);
          log.push(`Divisores racionales: [${nuevosDivisores.join(', ')}]`);
          encontrarRaices(nuevosDivisores, coeficientes, raices);
          return;
        }
      }
    }

    encontrarRaices(divisoresRacionales, coeficientes, raices);
    setLog(log);
    return Array.from(raices);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const divisores = calcularDivisoresRacionales(coeficientes);
    setDivisores(divisores);
    const raices = divisionSintetica(divisores, coeficientes);
    setRaices(raices);
    if (raices.length !== parseInt(gradoPolinomio)) {
      setLog(prevLog => [...prevLog, "No se encontraron todas las raíces racionales."]);
    }
  };

  return (
    <div className="App">
      <h1>División Sintética</h1>
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
        <button type="submit">Calcular</button>
      </form>
      <div>
        <h2>Coeficientes:</h2>
        <p>{coeficientes.join(', ')}</p>
        <h2>Divisores Racionales:</h2>
        <p>{divisores.join(', ')}</p>
        <h2>Raíces Encontradas:</h2>
        <p>{raices.join(', ')}</p>
        {raices.length !== parseInt(gradoPolinomio) && <p>No se encontraron todas las raíces racionales.</p>}
        <h2>Proceso:</h2>
        <pre>{log.join('\n')}</pre>
      </div>
    </div>
  );
}

export default App;