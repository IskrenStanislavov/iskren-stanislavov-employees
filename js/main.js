"use strict";

Zepto(($) => {
    const DEBUG = "DEBUG: ";
    const DEMO_CSV_URL = "https://raw.githubusercontent.com/IskrenStanislavov/iskren-stanislavov-employees/master/data/employee_projects_with_header.csv";
    const INITIAL = [
        ["heading1", "heading2", "heading3", "heading4", "heading5"],
        ["value1_1", "value2_1", "value3_1", "value4_1", "value5_1"],
        ["value1_2", "value2_2", "value3_2", "value4_2", "value5_2"],
        ["value1_3", "value2_3", "value3_3", "value4_3", "value5_3"],
    ];

    let settings = { licenseKey: 'non-commercial-and-evaluation' };
    let parser;
    
    let findValidDate = (dateStr) => {
        let date = moment(dateStr, moment.ISO_8601);
        if(!date._isValid) {
            date = moment(dateStr, FORMATS, true);
            console.log("in 3");
        }
        return date;

    };
    assert(findValidDate("2014/01/05")._isValid);

    console.log(`${DEBUG}document loaded.`);
    class Parser {
        url = DEMO_CSV_URL;
        initialFileName = 'no file selected';
        gridElement = $("#demo");
        fileNameElement = $("#file-selected-name");
        resultElement = $("#results-demo").hide();
        resultInfoElement = $("#results-info");
        constructor(url) {
            if (!!url) {
                this.url = url;
            }
            this.currentData = null;
            this.fileNameElement.html(this.initialFileName);
            this.resultInfoElement.html(this.initialFileName);
            this.datagridOfFile = new Handsontable($("<div></div>").appendTo(this.gridElement)[0], settings);
            this.datagridOfResult = new Handsontable($("<div></div>").appendTo(this.resultElement)[0], settings);
            console.log(`${DEBUG}url to be loaded for demo:`, this.url);
            this.presentDataToHTML();
        };
        loadDemoDataURL() {
            window.fetch(this.url).then((response) => response.blob()).then((data) => {
                console.log(`${DEBUG}blob to be parsed:`, data);
                this.fileNameElement.html("Demo file loaded");
                this.parseCSV(data);
            });
        };
        handleUpload() {
            let that = this;
            $('input#file-input').on("change", function () {
                var files = this.files;
                for (var i = 0; i < files.length; i++) {
                    if (this.files[i].presented) continue;
                    this.files[i].presented = true;
                    that.parseCSV(this.files[i]);
                }
            }).click();
        };
        parseCSV(parsableObject){
            Papa.parse(parsableObject, {
                skipEmptyLines: true,
                complete: this.presentDataToHTML
            });
        };
        presentDataToHTML = (results) => {
            this.currentData = results && results.data;
            this.datagridOfFile.loadData(this.currentData || INITIAL);
            this.resolveResults();
            console.log(`${DEBUG}results:`, results);
            console.log(`${DEBUG}present works:`);
        };
        getHeader(){
            if (!this.currentData){
                return;
            }
            let row = this.currentData[0];
            for(let i=0; i < row.length; i++){
                if (isNaN(parseInt(row[i]))) {
                    // means it is a title cell
                    // by same check can be removed any header rows
                    // in the csv file between the first and the last row
                    return this.currentData.splice(0,1)[0];
                }
            }
            return ['EmpID', 'ProjectID', 'DateFrom', 'DateTo'];
        }
        resolveResults() {
            if (!this.currentData){
                return;
            }
            let header = this.getHeader();
            header.splice(2,0,"InProj");
            let result = [header,];
            this.currentData.forEach((row, row_index)=>{
                let dateFrom = findValidDate(row[2].trim());
                let dateTo;
                if (row[3].trim().toUpperCase() == "NULL") {
                    dateTo = moment();
                    row[3] = "Now";
                } else {
                    dateTo = findValidDate(row[3].trim());
                }
                let newRow = row.slice(0);
                newRow.splice(2,0,dateTo.diff(dateFrom,'days'))
                result.push(newRow);
//                 row.splice(2,2, dateFrom, dateTo);
            });
            this.resultInfoElement.html("Days worked on project:");
            this.resultElement.show();
            this.datagridOfResult.loadData(result);
            console.log(this.currentData);
        }
        clearGrid() {
            $(this.gridElement).empty();
        };
    };

    parser = new Parser();
    $("#load-demo").on("click", () => {
        parser.loadDemoDataURL();
    });
    $("#clear").on("click", () => {
        parser.clearGrid();
    });
    $("#select").on("click", () => {
        parser.handleUpload();
    });
});