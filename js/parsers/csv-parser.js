// https://www.quora.com/What-is-the-best-way-to-read-a-CSV-file-using-JavaScript-not-JQuery
function Upload() {
    var fileUpload = document.getElementById("fileUpload");
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onload = function (e) {
                var table = document.createElement("table");
                var rows = e.target.result.split("\n");
                for (var i = 0; i < rows.length; i++) {
                    var row = table.insertRow(-1);
                    var cells = rows[i].split(",");
                    for (var j = 0; j < cells.length; j++) {
                        var cell = row.insertCell(-1);
                        cell.innerHTML = cells[j];
                    }
                }
                var dvCSV = document.getElementById("dvCSV");
                dvCSV.innerHTML = "";
                dvCSV.appendChild(table);
            }
            reader.readAsText(fileUpload.files[0]);
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid CSV file.");
    }
}
function myFunction() {
    var x = document.getElementById("demo");
    x.innerHTML = "Output here";
}
Zepto(($)=>{
    // this is the Zepto way for handling document.onload
    console.warn("document loaded works")
    var outputField = document.getElementById("demo");
    outputField.innerHTML = "The output will appear here";
    // $.ajax({
    //     type: "GET",
    //     url: "data.txt",
    //     dataType: "text",
    //     success: function (data) { processData(data); }
    // });

})
function processData(allText) {
    var record_num = 5; // or however many elements there are in each row
    var allTextLines = allText.split(/\r\n|\n/);
    var entries = allTextLines[0].split(',');
    var lines = [];
    var headings = entries.splice(0, record_num);
    while (entries.length > 0) {
        var tarr = [];
        for (var j = 0; j < record_num; j++) {
            tarr.push(headings[j] + ":" + entries.shift());
        }
        lines.push(tarr);
    }
    alert(lines);
    return lines;
}

CSV_SEPARATOR = ",";
if (true) {
    header = ["heading1", "heading2", "heading3", "heading4", "heading5"]
    row1 = ["value1_1", "value2_1", "value3_1", "value4_1", "value5_1"]
    row2 = ["value1_2", "value2_2", "value3_2", "value4_2", "value5_2"]
    row3 = ["value1_3", "value2_3", "value3_3", "value4_3", "value5_3"]

    csv_file_data = [
        header.join(CSV_SEPARATOR),
        row1.join(CSV_SEPARATOR),
        row2.join(CSV_SEPARATOR),
        row3.join(CSV_SEPARATOR),
    ].join("\n")
}
