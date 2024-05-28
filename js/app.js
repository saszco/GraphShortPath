class GraphShortestPath {
  constructor() {
    //Ініціалізуємо обʼєкти
    this.minWeightInput = document.getElementById('minWeight'); //Мінімальна вага
    this.maxWeightInput = document.getElementById('maxWeight'); //Максимальна вага

    this.generateMatrixBtn = document.getElementById('generateMatrixBtn'); //Привʼязка кнопки генерації
    this.submitBtn = document.getElementById('submitBtn'); //Привʼязка кнопки утвердження к-сті вершин та ребер
    this.buildGraphBtn = document.getElementById('buildGraphBtn'); //Привʼязка кнопки побудови графа
    this.findPathBtn = document.getElementById('findPathBtn'); //Привʼязка кнопки пошуку найкоротшого шляху
    this.saveToFileBtn = document.getElementById('saveToFileBtn');

    this.errorMessage = document.getElementById('errorMessage'); //Повідомлення помилки

    this.verticesInput = document.getElementById('vertices'); //Вершини
    this.edgesInput = document.getElementById('edges'); //Ребра

    this.startVertexInput = document.getElementById('startVertex'); //Початкова вершина
    this.endVertexInput = document.getElementById('endVertex'); //Кінцева вершина

    this.matrixContainer = document.getElementById('matrixContainer'); //Контейнер для вагової матриці інцидентності

    this.selectedAlgorithm = 'dijkstra'; //Обраний алгоритм. За замовчуванням Дейкстри

    this.pathEdges = [];

    //Привʼязування подій
    this.addInputValidation();
    this.bindEventsGenerate();
    this.bindEventsInputMatrix();
    this.bindEventsAlgorithmSelection();
  }

  bindEventsGenerate() {
    this.generateMatrixBtn.addEventListener('click', () => {
      this.generateMatrix(); //Виклик методу генерації
    });
  }

  bindEventsInputMatrix() {
    this.submitBtn.addEventListener('click', () => {
      this.CreateMatrix(); //Виклик методу створення матриці
    })
    this.buildGraphBtn.addEventListener('click', () => this.buildGraph()); //Виклик методу побудови графу
    this.findPathBtn.addEventListener('click', () => this.findShortestPath()); //Виклик методу пошук найкоротшого шляху
    this.saveToFileBtn.addEventListener('click', () => this.saveToFile(this.pathEdges, this.selectedAlgorithm));
  }

  bindEventsAlgorithmSelection() {
    document.getElementById('selectBtn').addEventListener('click', () => {
      this.selectedAlgorithm = document.getElementById('selectAlgorithm').value; //Обробка вибору користувача щодо алгоритму
    });
  }


  addInputValidation() {
    this.verticesInput.addEventListener('input', () => this.validateIntegerInput(this.verticesInput, 2, 9));
    this.edgesInput.addEventListener('input', () => this.validateIntegerInput(this.edgesInput, 1, 10));
    this.minWeightInput.addEventListener('input', () => this.validateWeightInput(this.minWeightInput, -10, 10));
    this.maxWeightInput.addEventListener('input', () => this.validateWeightInput(this.maxWeightInput, -10, 10));
    this.startVertexInput.addEventListener('input', () => this.validateVertexInputs());
    this.endVertexInput.addEventListener('input', () => this.validateVertexInputs());
  }

  validateIntegerInput(input, minValue, maxValue) {
    const value = input.value.trim();
    const intValue = parseInt(value, 10);
    const regex = /^-?\d+$/;
    if (value === '-' || value === '') {
      return;
    }
    if (value < minValue || value > maxValue || !regex.test(value)){
      input.value = '';
      this.errorMessage.textContent = `Please, enter the integer value from ${minValue} to ${maxValue}`;
    } else {
      this.errorMessage.textContent = '';
    }
  }

  validateVertexInputs() {
    const vertices = parseInt(this.verticesInput.value, 10);
    const startVertex = parseInt(this.startVertexInput.value, 10);
    const endVertex = parseInt(this.endVertexInput.value, 10);

    if (isNaN(vertices) || vertices < 2 || vertices > 9) {
      this.errorMessage.textContent = "Please, enter the number of vertices first (between 2 and 9)";
      this.startVertexInput.value = ''; // Clear the input field
      this.endVertexInput.value = ''; // Clear the input field
      return;
    }

    this.validateVerticesRange(startVertex, endVertex, vertices);
  }

  validateWeightInput(input, minValue, maxValue) {
    let value = input.value.trim();

    if (value === '-' || value === '') {
      return;
    }

    const intValue = parseInt(value, 10);
    const regex = /^-?\d+$/;

    // Check if the selected algorithm is Dijkstra
    if (this.selectedAlgorithm === 'dijkstra' && intValue < 0) {
      input.value = '';
      this.errorMessage.textContent = `For Dijkstra's algorithm, weights cannot be negative. Please enter a value from 0 to ${maxValue}`;
      return;
    }

    if (!regex.test(value) || intValue < minValue || intValue > maxValue) {
      input.value = '';
      this.errorMessage.textContent = `Please, enter an integer value from ${minValue} to ${maxValue}`;
    } else {
      this.errorMessage.textContent = '';
    }
  }

  validateVerticesRange(startVertex, endVertex, vertices) {
    if (startVertex < 0 || startVertex > vertices || endVertex < 0 || endVertex > vertices) {
      this.errorMessage.textContent = `Start vertex and end vertex should be in range from 1 to ${vertices}`;
      this.startVertexInput.value = '';
      this.endVertexInput.value = '';
      return false;
    }
    this.errorMessage.textContent = '';
    return true;
  }


  CreateMatrix() {
    const vertices = parseInt(this.verticesInput.value); //Ініціалізація вершин
    const edges = parseInt(this.edgesInput.value); //Ініціалізація ребер

    //Валідування дій користувача
    if (!vertices || !edges) {
      this.errorMessage.textContent = "Please, enter the number of vertices and edges"
    } else {
      const graphForm = new GraphForm(vertices, edges); //Звернення до класу GraphFrom
      graphForm.createMatrixTable();
    }
  }

  generateMatrix() {
    //Ініціалізація змінних
    const minWeight = parseInt(this.minWeightInput.value);
    const maxWeight = parseInt(this.maxWeightInput.value);
    const vertices = parseInt(this.verticesInput.value);
    const edges = parseInt(this.edgesInput.value);

    //Валідація введених користувачем даних
    if (!minWeight || !maxWeight) {
      this.errorMessage.textContent = "Please enter values for both minimum and maximum weights";
      this.minWeightInput.value = '';
      this.maxWeightInput.value = '';
    } else if (minWeight > maxWeight) {
      this.errorMessage.textContent = "Please, enter again. The min weight cannot be greater than max weight";
      this.minWeightInput.value = '';
      this.maxWeightInput.value = '';
    } else {
      this.errorMessage.textContent = 'Matrix generated successfully';
      const matrix = this.createIncidenceMatrix(vertices, edges); //Виклик методу генерування матриці інцидентності
      const weights = this.createWeightsArray(edges, minWeight, maxWeight); //Виклик методу генерування ваг ребер
      console.log("Generated Incidence Matrix: ", matrix); //Виведення матриці у консоль
      console.log("Generated Edge Weights: ", weights); //Виведення ваг ребер у консоль
      this.displayMatrix(matrix, weights); //Відображення вагової матриці інцидентності користувачеві у таблиці
    }
  }

  createIncidenceMatrix(vertices, edges) {
    const matrix = Array.from({ length: vertices }, () => Array(edges).fill(0)); //Ініціалізація двовимірного масиву (матриці)
    for (let j = 0; j < edges; j++){ //Проходимося по всім ребрам
      const from = Math.floor(Math.random() * vertices); //Визначаємо випадкову "відправну" вершина
      let to; //Вершина "призначення" (кінцева)
      do{
        to = Math.floor(Math.random() * vertices); //Вибираємо випадкову кінцеву вершину
      }while(to === from); //Перевіряємо, щоб вершина призначення не співпадала з відправною вершиною
      matrix[from][j] = -1; //Ребро з цієї вершини виходить
      matrix[to][j] = 1; //Ребро в цю вершину входить
    }
    return matrix;
  }

  createWeightsArray(edges, minWeight, maxWeight) {
    return Array.from({ length: edges }, () => Math.floor(Math.random() * (maxWeight - minWeight + 1)) + minWeight);
    console.log(edges);
  }

  displayMatrix(matrix, weights) {
    const rows = this.matrixContainer.querySelectorAll('tr');

    for (let i = 2; i < rows.length; i++) {
      const row = rows[i].querySelectorAll('input');
      for (let j = 0; j < row.length; j++) {
        row[j].value = matrix[i - 2][j];
      }
    }

    const weightsRow = rows[1].querySelectorAll('input');
    for (let i = 0; i < weightsRow.length; i++) {
      weightsRow[i].value = weights[i];
    }
  }


  buildGraph() {
    const graphForm = new GraphForm(parseInt(this.verticesInput.value), parseInt(this.edgesInput.value));
    const matrix = graphForm.getMatrix();
    const weights = graphForm.getWeights();
    const invalidWeights = weights.some(weight => isNaN(weight));
    if(!matrix || !weights){
      this.errorMessage.textContent = 'Please ensure the incidence matrix and edge weights are correctly filled.';
      return;
    }else if(invalidWeights){
      this.errorMessage.textContent = 'Please ensure all edge weights are valid numbers.';
      return;
    }else {
      console.log("Incidence Matrix: ", matrix);
      console.log("Edge weights: ", weights);
      this.drawGraph(matrix, weights);
    }
  }


  drawGraph(matrix, weights, pathEdges = [], startVertex = null, endVertex = null, pathColor) {
    const nodes = [];
    for (let i = 0; i < this.verticesInput.value; i++) {
      nodes.push({
        id: i + 1,
        label: `V${i + 1}`,
        color: {background: i + 1 === startVertex || i + 1 === endVertex ? '#6199ff' : '#b3c6ff', border: '#b3c6ff' }
      });
    }

    const edges = [];
    for (let j = 0; j < matrix[0].length; j++) {
      let from, to;
      for (let i = 0; i < matrix.length; i++) {
        if (matrix[i][j] === 1) {
          to = i + 1;
        } else if (matrix[i][j] === -1) {
          from = i + 1;
        } else if (matrix[i][j] === 2) {
          from = i + 1;
          to = i + 1;
        }
      }
      if (from && to) {
        const color = pathEdges.includes(j) ? pathColor : '#b3c6ff';
        edges.push({
          from: from,
          to: to,
          label: weights[j].toString(),
          color: { color: color }
        });
        console.log(`Edge from ${from} to ${to} with weight ${weights[j]} colored ${color}`);
      }
    }

    console.log("Weights: ", weights)
    console.log("Edges array: ", edges);
    console.log("Path edges array: ", pathEdges);

    const container = document.getElementById('graphContainer');
    const data = {
      nodes: new vis.DataSet(nodes),
      edges: new vis.DataSet(edges)
    };

    const options = {
      edges: {
        arrows: {
          to: {
            enabled: true,
            type: 'arrow'
          }
        }
      },
      physics: {
        enabled: true,
        stabilization: {
          iterations: 1000
        },
        barnesHut: {
          gravitationalConstant: -1000,
          centralGravity: 0.9,
          springLength: 15,
          springConstant: 0.008,
          damping: 0.09,
          avoidOverlap: 1
        },
      },
      interaction: {
        dragNodes: true,
        dragView: true,
        hideEdgesOnDrag: false,
        hideNodesOnDrag: false,
        zoomView: true,
      },
      layout: {
        improvedLayout: true
      }
    };
    new vis.Network(container, data, options);
  }


  findShortestPath(){
    const graphForm = new GraphForm(parseInt(this.verticesInput.value), parseInt(this.edgesInput.value));
    const matrix = graphForm.getMatrix();
    const weights = graphForm.getWeights();
    const startVertex = parseInt(this.startVertexInput.value);
    const endVertex = parseInt(this.endVertexInput.value);

    if (matrix && weights && startVertex && endVertex) {
      let pathEdges;
      let color = '#cc66ff';
      if(this.selectedAlgorithm === 'dijkstra'){
        if (this.hasCycle()) {
          this.errorMessage.textContent = "Graph contains a cycle. Please regenerate the incidence matrix.";
          return;
        }
        pathEdges = this.dijkstra(matrix, weights, startVertex, endVertex);
      } else if (this.selectedAlgorithm === 'bellmanFord'){
        if (this.hasCycle()) {
          this.errorMessage.textContent = "Graph contains a cycle. Please regenerate the incidence matrix.";
          return;
        }
        pathEdges = this.bellmanFord(matrix, weights, startVertex, endVertex);
        color = '#b2ff00';
      }else if(this.selectedAlgorithm === 'floydWarshall'){
        if (this.hasCycle()) {
          this.errorMessage.textContent = "Graph contains a cycle. Please regenerate the incidence matrix.";
          return;
        }
        pathEdges = this.floydWarshall(matrix, weights, startVertex, endVertex);
        color = '#ff6699';
      }

      if (pathEdges.length !== 0){
        this.pathEdges = pathEdges;
        this.drawGraph(matrix, weights, pathEdges, startVertex, endVertex, color);
        return;
      } else {
        this.errorMessage.textContent = "No path found between the specified vertices";
        this.startVertexInput.value = '';
        this.endVertexInput.value = '';
      }
    }
  }

  saveToFile(pathEdges, algorithm) {
    if (!pathEdges || pathEdges.length === 0) {
      this.errorMessage.textContent = 'Please, find the shortest path first';
      console.log("Save to file path edges: ", pathEdges);
    } else {
      const vertices = parseInt(this.verticesInput.value);
      const edges = parseInt(this.edgesInput.value);
      const graphForm = new GraphForm(vertices, edges);
      const matrix = graphForm.getMatrix();
      const weights = graphForm.getWeights();
      const edgeDetails = pathEdges.map(edgeIndex => {
        let from, to;
        for (let i = 0; i < vertices; i++) {
          if (matrix[i][edgeIndex] === -1) {
            from = i + 1;
          } else if (matrix[i][edgeIndex] === 1) {
            to = i + 1;
          }
        }
        return { from, to, weight: weights[edgeIndex] };
      });

      const edgeText = edgeDetails.map(edge => `${edge.from} -> ${edge.to} (weight: ${edge.weight})`).join('\n');
      const algorithmText = `Algorithm: ${algorithm}`;
      const fileContent = `${algorithmText}\n\n${edgeText}`;

      const fileBlob = new Blob([fileContent], { type: 'text/plain' });
      const fileUrl = URL.createObjectURL(fileBlob);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = 'shortest_path.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      this.errorMessage.textContent = 'The result has been saved to a file';
      console.log("Save to file path edges: ", pathEdges);
    }
  }


  dijkstra(matrix, weights, startVertex, endVertex){
    const vertices = matrix.length;
    const distances = Array(vertices).fill(Infinity);
    const previousVertices = Array(vertices).fill(null);
    const visited = new Set();
    const edgeMapping = {};

    console.log("weights in dijkstra: ", weights);

    for (let i = 0; i < weights.length; i++){
      if (weights[i] < 0){
        this.errorMessage.textContent = 'Edges contain a negative weights. It is not possible to use Dijkstra algorithm. Check your weights'
        return ;
      }
    }

    for (let j = 0; j < matrix[0].length; j++) {
      let from, to;
      for (let i = 0; i < matrix.length; i++){
        if (matrix[i][j] === 1) {
          to = i + 1 ;
        }else if (matrix[i][j] === -1){
          from = i + 1;
        }
      }
      if(from !== undefined && to !== undefined){
        if (!edgeMapping[from]){
          edgeMapping[from] = [];
        }
        edgeMapping[from].push({ to, weight: weights[j], edge: j });
      }
    }

    distances[startVertex - 1] = 0;
    const priorityQueue = new PriorityQueue((a, b) => distances[a] < distances[b]);
    priorityQueue.enqueue(startVertex - 1);

    while (!priorityQueue.isEmpty()){
      const currentVertex = priorityQueue.dequeue();
      if (visited.has(currentVertex)){
        continue;
      }
      visited.add(currentVertex);
      const neighbors = edgeMapping[currentVertex + 1] || [];
      for (const {to, weight, edge } of neighbors){
        const newDistance = distances[currentVertex] + weight;
        if (newDistance < distances[to - 1]){
          distances[to - 1] = newDistance;
          previousVertices[to - 1] = { vertex: currentVertex, edge};
          priorityQueue.enqueue(to - 1);
        }
      }
    }

    const pathEdges = [];
    let currentVertex = endVertex -1;
    while (previousVertices[currentVertex]){
      pathEdges.unshift(previousVertices[currentVertex].edge);
      currentVertex = previousVertices[currentVertex].vertex;
    }
    console.log("Path Edges Array Dijkstra:", pathEdges); // Перевірка шляху в консолі

    return pathEdges;
  }

  bellmanFord(matrix, weights, startVertex, endVertex){
    const vertices = matrix.length;
    const edgesCount = weights.length;
    const distances = Array(vertices).fill(Infinity);
    const previousVertices = Array(vertices).fill(null);
    distances[startVertex - 1] = 0;

    //Перетворення матриці інцидентності у список ребер
    const edges = [];
    for (let j = 0; j < edgesCount; j++){
      let from, to;
      for (let i = 0; i < vertices; i++){
        if (matrix[i][j] === 1){
          to = i;
        }else if(matrix[i][j] === -1){
          from = i;
        }
      }
      if(from !== undefined && to !== undefined){
        edges.push({ from, to, weight: weights[j], edgeIndex: j });
      }
    }

    //Основний цикл Беллмана-Форда
    for (let i = 0; i < vertices - 1; i++){
      for (const { from, to, weight, edgeIndex } of edges){
        if(distances[from] + weight < distances[to]){
          distances[to] = distances[from] + weight;
          previousVertices[to] = { vertex: from, edge: edgeIndex };
        }
      }
    }

    //Перевірка на наявність циклів негативної ваги
    for (const { from, to, weight } of edges){
      if (distances[from] + weight < distances[to]){
        this.errorMessage.textContent = "Graph contains a negative weight cycle. Please, regenerate matrix";
        return null;
      }
    }

    //Визначення шляху
    const pathEdges = [];
    let currentVertex = endVertex - 1;
    while (previousVertices[currentVertex]){
      pathEdges.unshift(previousVertices[currentVertex].edge);
      currentVertex = previousVertices[currentVertex].vertex;
    }
    console.log("Path Edges Bellman-Ford", pathEdges);
    return pathEdges;
  }

  floydWarshall(matrix, weights, startVertex, endVertex) {
    const vertices = parseInt(this.verticesInput.value);
    const adjacencyMatrix = Array.from({ length: vertices }, () => Array(vertices).fill([Infinity, null]));

    // Заповнення матриці суміжності на основі початкової матриці
    for (let j = 0; j < weights.length; j++) {
      let from = null, to = null;
      for (let i = 0; i < vertices; i++) {
        if (matrix[i][j] === 1) {
          to = i;
        } else if (matrix[i][j] === -1) {
          from = i;
        }
      }
      if (from !== null && to !== null && from < vertices && to < vertices) {
        const weight = weights[j];
        if (adjacencyMatrix[from][to][0] === Infinity || weight < adjacencyMatrix[from][to][0]) {
          adjacencyMatrix[from][to] = [weight, j];
        }
      } else {
        console.error(`Invalid 'from' (${from}) or 'to' (${to}) index for edge with weight ${weights[j]} at index ${j}`);
      }
    }

    // Ініціалізація матриці відстаней і наступних вершин
    const dist = Array.from({ length: vertices }, () => Array(vertices).fill(Infinity));
    const next = Array.from({ length: vertices }, () => Array(vertices).fill(null));

    // Ініціалізація початкових відстаней та наступних вершин
    for (let i = 0; i < vertices; i++) {
      for (let j = 0; j < vertices; j++) {
        if (i === j) {
          dist[i][j] = 0; // Відстань від вершини до себе
        } else if (adjacencyMatrix[i][j][0] !== Infinity) {
          dist[i][j] = adjacencyMatrix[i][j][0]; // Вага ребра
          next[i][j] = j;
        }
      }
    }

    // Алгоритм Флойда-Воршелла
    for (let k = 0; k < vertices; k++) {
      for (let i = 0; i < vertices; i++) {
        for (let j = 0; j < vertices; j++) {
          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
            next[i][j] = next[i][k];
          }
        }
      }
    }

    const pathEdges = this.extractPathEdgesFromDistMatrix(adjacencyMatrix, next, startVertex - 1, endVertex - 1);
    console.log("Path Edges Floyd-Warshall: ", pathEdges);

    return pathEdges;
  }

  extractPathEdgesFromDistMatrix(adjacencyMatrix, next, startVertex, endVertex) {
    const pathEdges = [];
    let u = startVertex;

    // Якщо шлях відсутній (next[u][endVertex] === null), повертаємо порожній масив
    if (next[u][endVertex] === null) {
      console.error(`No path found between vertices ${startVertex + 1} and ${endVertex + 1}.`);
      return pathEdges;
    }

    while (u !== endVertex) {
      const v = next[u][endVertex];
      if (v === null) {
        console.error(`Edge between vertices ${u + 1} and ${endVertex + 1} not found in the shortest path.`);
        return pathEdges;
      }

      // Додаємо індекс ребра, яке входить до найкоротшого шляху
      pathEdges.push(adjacencyMatrix[u][v][1]); // Додаємо індекс ребра (j)
      u = v;
    }
    return pathEdges;
  }



  hasCycle(){
    const vertices = parseInt(this.verticesInput.value);
    const visited = Array(vertices).fill(false);
    const recStack = Array(vertices).fill(false);

    const matrix = new GraphForm(vertices, parseInt(this.edgesInput.value)).getMatrix();
    const adjList = Array.from({ length: vertices }, () => []);

    for(let j = 0; j < matrix[0].length; j++){
      let from, to;
      for (let i = 0; i < vertices; i++){
        if(matrix[i][j] === 1){
          to = i;
        }else if(matrix[i][j] === -1){
          from = i;
        }
      }
      adjList[from].push(to);
    }

    const dfs = (v) => {
      if (!visited[v]){
        visited[v] = true;
        recStack[v] = true;

        for (let neighbor of adjList[v]) {
          if (!visited[neighbor] && dfs(neighbor)) {
            return true;
          } else if (recStack[neighbor]) {
            return true;
          }
        }
      }
      recStack[v] = false;
      return false;
    };
    for (let i = 0; i < vertices; i++) {
      if (dfs(i)) {
        return true;
      }
    }
    return false;
  }
}

class PriorityQueue {
  constructor(comparator = (a, b) => a > b) {
    this._heap = [];
    this._comparator = comparator;
  }
  size(){
    return this._heap.length;
  }
  isEmpty(){
    return this.size() === 0;
  }
  peek(){
    return this._heap[0];
  }
  enqueue(value){
    this._heap.push(value);
    this._siftUp();
  }
  dequeue() {
    const poppedValue = this.peek();
    const bottom = this.size() - 1;
    if (bottom > 0) {
      this._swap(0, bottom);
    }
    this._heap.pop();
    this._siftDown();
    return poppedValue;
  }
  _greater(i, j) {
    return this._comparator(this._heap[i], this._heap[j]);
  }
  _swap(i, j) {
    [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
  }
  _siftUp() {
    let node = this.size() - 1;
    while (node > 0 && this._greater(node, Math.floor((node - 1) / 2))) {
      this._swap(node, Math.floor((node - 1) / 2));
      node = Math.floor((node - 1) / 2);
    }
  }
  _siftDown() {
    let node = 0;
    while (
      (node * 2 + 1 < this.size() && this._greater(node * 2 + 1, node)) ||
      (node * 2 + 2 < this.size() && this._greater(node * 2 + 2, node))
      ) {
      let maxChild = node * 2 + 1;
      if (node * 2 + 2 < this.size() && this._greater(node * 2 + 2, node * 2 + 1)) {
        maxChild = node * 2 + 2;
      }
      this._swap(node, maxChild);
      node = maxChild;
    }
  }
}



class AlgorithmSelector {
  constructor() {
    this.algorithmForm = document.getElementById('algorithmForm');
    this.selectAlgorithm = document.getElementById('selectAlgorithm');
  }
}

class GraphForm {
  constructor(vertices, edges) {
    this.vertices = vertices;
    this.edges = edges;
    this.matrixContainer = document.getElementById('matrixContainer');
    this.errorMessage = document.getElementById('errorMessage'); //Повідомлення помилки

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
      matrix.push(rowValues)
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

document.addEventListener('DOMContentLoaded', () => {
  const graph_shortest_path = new GraphShortestPath();
  const algorithmSelector = new AlgorithmSelector();
});
