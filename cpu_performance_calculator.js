
function generateTable() {
    var numProcessors = parseInt(document.getElementById("numProcessors").value);
    var numBenchmarks = parseInt(document.getElementById("numBenchmarks").value);
    var table = "<h3>Enter execution times for each processor and benchmark:</h3><table border='1'><tr><th>Benchmark</th>";

    // Create the table header for processor names
    for (let i = 0; i < numProcessors; i++) {
        table += "<th><input type='text' id='processor" + i + "' placeholder='Processor " + (i + 1) + "'></th>";
    }
    table += "</tr>";

    // Create rows for benchmark names and execution times
    for (let j = 0; j < numBenchmarks; j++) {
        table += "<tr><td><input type='text' id='benchmark" + j + "' placeholder='Benchmark " + (j + 1) + "'></td>";
        for (let i = 0; i < numProcessors; i++) {
            table += "<td><input type='number' id='time" + i + "_" + j + "' placeholder='Time (sec)'></td>";
        }
        table += "</tr>";
    }

    table += "</table><br><label for='referenceProcessor'>Reference Processor:</label> <select id='referenceProcessor'>";
    for (let i = 0; i < numProcessors; i++) {
        table += "<option value='" + i + "'>Processor " + (i + 1) + "</option>";
    }
    table += "</select><br><br><button onclick='calculateMeans()'>Calculate</button>";

    document.getElementById("inputTable").innerHTML = table;
}

function calculateMeans() {
    var numProcessors = parseInt(document.getElementById("numProcessors").value);
    var numBenchmarks = parseInt(document.getElementById("numBenchmarks").value);
    var processors = [];
    var benchmarks = [];
    var times = [];
    var speedMetrics = [];
    var referenceProcessor = parseInt(document.getElementById("referenceProcessor").value);

    // Getting processor names
    for (let i = 0; i < numProcessors; i++) {
        let processorName = document.getElementById("processor" + i).value;
        processors.push(processorName);
    }

    // Getting benchmark names
    for (let j = 0; j < numBenchmarks; j++) {
        let benchmarkName = document.getElementById("benchmark" + j).value;
        benchmarks.push(benchmarkName);
    }

    // Getting execution times for each benchmark on each processor
    for (let i = 0; i < numProcessors; i++) {
        times[i] = [];
        for (let j = 0; j < numBenchmarks; j++) {
            let time = parseFloat(document.getElementById("time" + i + "_" + j).value);
            times[i].push(time);
        }
    }

    // Calculating speed metrics for each benchmark
    for (let j = 0; j < numBenchmarks; j++) {
        speedMetrics[j] = [];
        for (let i = 0; i < numProcessors; i++) {
            let speed = times[referenceProcessor][j] / times[i][j];
            speedMetrics[j].push(speed);
        }
    }

    // Calculating arithmetic and geometric means
    var arithmeticMeans = [];
    var geometricMeans = [];

    for (let i = 0; i < numProcessors; i++) {
        let arithmeticSum = 0;
        let geometricProduct = 1;

        for (let j = 0; j < numBenchmarks; j++) {
            arithmeticSum += speedMetrics[j][i];
            geometricProduct *= speedMetrics[j][i];
        }

        arithmeticMeans.push(arithmeticSum / numBenchmarks);
        geometricMeans.push(Math.pow(geometricProduct, 1 / numBenchmarks));
    }

    // Displaying the results
    var result = "<h3>Speed Metrics:</h3><table border='1'><tr><th>Benchmark</th>";

    for (let i = 0; i < numProcessors; i++) {
        result += "<th>" + processors[i] + "</th>";
    }
    result += "</tr>";

    for (let j = 0; j < numBenchmarks; j++) {
        result += "<tr><td>" + benchmarks[j] + "</td>";
        for (let i = 0; i < numProcessors; i++) {
            result += "<td>" + speedMetrics[j][i].toFixed(3) + "</td>";
        }
        result += "</tr>";
    }

    result += "</table><br><h3>Arithmetic Mean</h3><table border='1'><tr><th>Processor</th><th>Arithmetic Mean</th></tr>";

    for (let i = 0; i < numProcessors; i++) {
        result += "<tr><td>" + processors[i] + "</td><td>" + arithmeticMeans[i].toFixed(3) + "</td></tr>";
    }

    result += "</table><br><h3>Geometric Mean</h3><table border='1'><tr><th>Processor</th><th>Geometric Mean</th></tr>";

    for (let i = 0; i < numProcessors; i++) {
        result += "<tr><td>" + processors[i] + "</td><td>" + geometricMeans[i].toFixed(3) + "</td></tr>";
    }

    result += "</table><br><h3>Ranking (Arithmetic Mean)</h3><ol>";
    var arithmeticRanking = [...processors].sort((a, b) => arithmeticMeans[processors.indexOf(b)] - arithmeticMeans[processors.indexOf(a)]);
    for (let i = 0; i < numProcessors; i++) {
        result += "<li>" + arithmeticRanking[i] + "</li>";
    }
    result += "</ol><br><h3>Ranking (Geometric Mean)</h3><ol>";
    var geometricRanking = [...processors].sort((a, b) => geometricMeans[processors.indexOf(b)] - geometricMeans[processors.indexOf(a)]);
    for (let i = 0; i < numProcessors; i++) {
        result += "<li>" + geometricRanking[i] + "</li>";
    }
    result += "</ol>";

    document.getElementById("output").innerHTML = result;
}
