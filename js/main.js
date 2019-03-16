"use strict";

Zepto(($) => {
    const DEBUG = "DEBUG: ";
    const DEMO_CSV_URL = "https://raw.githubusercontent.com/IskrenStanislavov/iskren-stanislavov-employees/master/data/employee_projects_with_header.csv";
    const HEADER = ['EmpID', 'ProjectID', 'DateFrom', 'DateTo']
    const RESULT_HEADER = ['EmpID', 'ProjectID', 'InProj', 'DateFrom', 'DateTo']

    let settings = {
        rowHeaders: true,
        colHeaders: true,
        filters: true,
        dropdownMenu: true,
        licenseKey: 'non-commercial-and-evaluation',
    };
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
            this.clearGrid()
            console.log(`${DEBUG}url to be loaded for demo:`, this.url);
        };
        loadDemoDataURL() {
            window.fetch(this.url).then((response) => response.blob()).then((data) => {
                console.log(`${DEBUG}blob to be parsed:`, data);
                this.fileNameElement.html("Demo file loaded");
                this.launchParseProcess(data);
            });
        };
        handleUpload() {
            let that = this;
            $('input#file-input').on("change", function () {
                var files = this.files;
                for (var i = 0; i < files.length; i++) {
                    if (this.files[i].presented) continue;
                    this.files[i].presented = true;
                    that.launchParseProcess(this.files[i]);
                }
            }).click();
        };
        launchParseProcess=(parsableObject)=>{
           console.log(`${DEBUG} handle csv works:`);
            Papa.parse(parsableObject, {
                skipEmptyLines: true,
                complete: (results)=>{
                    return this.handleParsedCSV(results.data);
                }
            });
        };
        handleParsedCSV = (data)=>{
            console.log(`${DEBUG} handle csv works:`);
            this.currentData = data;
            let shown = this.currentData;
            this.header = this._header(shown);
            this.table = shown;
            if (!this.header || this.header[0].trim()=="EmpID"){
                this.prepareResults();
                this.presentDataToHTML();
            } else {
                this.clearGrid()
            }
        };
        prepareResults() {
            this.result = [];
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
                this.result.push(newRow);
            });
            console.log(`${DEBUG}results:`, this.result);
        }
        presentDataToHTML() {
            this.datagridOfFile = new Handsontable(this.gridElement.empty()[0], {
                ...settings,
                colHeaders:this.header,
                data:this.table,
            });
            if (!this.result.length) {
                return;
            }
            this.resultInfoElement.html("Days worked on project:");
            this.resultElement.show();
            this.datagridOfResult = new Handsontable(this.resultElement.empty()[0], {
                ...settings,
                data:this.result,
                colHeaders:RESULT_HEADER
            });

            console.log(`${DEBUG}present works:`);
        };
        _header(data){
            let row = data[0];
            for(let i=0; i < row.length; i++){
                if (isNaN(parseInt(row[i]))) {
                    // means it is a title cell
                    // by same check can be removed any header rows
                    // in the csv file between the first and the last row
                    return data.splice(0,1)[0];
                }
            }
            return HEADER;
        };

        clearGrid() {
            this.currentData = null;
            this.fileNameElement.html(this.initialFileName);
            this.resultInfoElement.html(this.initialFileName);
            $(this.gridElement).empty();
            $(this.resultElement).empty();
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