class GraphForm {
  constructor(vertices, edges) {
    this.vertices = vertices;
    this.edges = edges;
    this.matrixContainer = document.getElementById('matrixContainer');
    this.errorMessage = document.getElementById('errorMessage'); //Повідомлення помилки
    this.incidenceMatrix = Array.from({ length: vertices }, () => Array(edges).fill(0));
  }

  createMatrixTable() {
    this.matrixContainer.innerHTML = '';

    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    const emptyHeader = document.createElement('th');


    headerRow.appendChild(emptyHeader);
    for (let i = 0; i < this.edges; i++) {
      const th = document.createElement('th');
      th.textContent = `Edge ${i + 1}`;
      headerRow.appendChild(th);
    }

    table.appendChild(headerRow);

    const weightRow = document.createElement('tr');
    weightRow.textContent = 'Weights';

    for (let i = 0; i < this.edges; i++) {
      const weightCell = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'number';
      input.name = `weights[${i}]`;
      weightCell.appendChild(input);
      weightRow.appendChild(weightCell);
    }
    table.appendChild(weightRow);

    for (let i = 0; i < this.vertices; i++) {
      const row = document.createElement('tr');
      const th = document.createElement('th');
      th.textContent = `V${i + 1}`;
      row.appendChild(th);
      for (let j = 0; j < this.edges; j++) {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'number';
        input.name = `matrix[${i}][${j}]`;
        input.value = this.incidenceMatrix[i][j];
        td.appendChild(input);
        row.appendChild(td);
      }
      table.appendChild(row);
    }
    this.matrixContainer.appendChild(table);
  }

  getMatrix() {
    const matrix = [];
    const rows = this.matrixContainer.querySelectorAll('tr');
    for (let i = 2; i < rows.length; i++) {
      const row = rows[i].querySelectorAll('input');
      const rowValues = [];
      for (let input of row) {
        const value = parseInt(input.value);
        if (![-1, 0, 1, 2].includes(value)) {
          this.errorMessage.textContent = `Invalid value at row ${i - 1}, column ${parseInt(input.name.split('[')[2].charAt(0)) + 1}. Allowed values are -1, 0, 1, 2.`;
          input.value = '';
          return null;
        }
        rowValues.push(value);
      }
      matrix.push(rowValues);
    }
    this.errorMessage.textContent = '';
    return this.validateMatrix(matrix) ? matrix : null;
  }

  getWeights() {
    const weightsRow = this.matrixContainer.querySelectorAll('tr')[1].querySelectorAll('input');
    const weights = [];

    for (let input of weightsRow) {
      const value = input.value.trim();

      // Перевірка, чи значення є цілим числом
      if (!/^-?\d+$/.test(value)) {
        this.errorMessage.textContent = 'The value of weight should be only integer';
        input.value = '';
        return null;
      }

      const intValue = parseInt(value);

      // Перевірка діапазону значення
      if (intValue < -100 || intValue > 100) {
        this.errorMessage.textContent = 'The allowed range of weights is from -100 to 100';
        input.value = '';
        return null;
      }

      weights.push(intValue);
    }
    return weights;
  }

  validateMatrix(matrix) {
    for (let j = 0; j < this.edges; j++) {
      let posCount = 0, negCount = 0, twoCount = 0;
      for (let i = 0; i < this.vertices; i++) {
        if (matrix[i][j] === 1) posCount++;
        if (matrix[i][j] === -1) negCount++;
        if (matrix[i][j] === 2) twoCount++;
      }
      if (twoCount > 1 || (twoCount === 1 && (posCount > 0 || negCount > 0)) || (posCount !== 1 || negCount !== 1)) {
        this.errorMessage.textContent = `Invalid matrix structure in column ${j + 1}. Please ensure correct incidence matrix format.`;
        return false;
      }
    }
    return true;
  }
}
