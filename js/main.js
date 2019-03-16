"use strict";

Zepto(($) => {
    const DEBUG = "DEBUG: ";
    const DEMO_CSV_URL = "https://raw.githubusercontent.com/IskrenStanislavov/iskren-stanislavov-employees/master/data/employee_projects_with_header.csv";
    const HEADER = ['EmpID', 'ProjectID', 'DateFrom', 'DateTo'];
    const RESULT_HEADER = ['EmpID', 'ProjectID', 'DaysInProj', 'DateFrom', 'DateTo'];
    const TOGGETHER_HEADER = ['Emp1ID', 'Emp2ID', 'ProjectID', 'DaysTogg'];

    const DATE_FROM_INDEX = HEADER.indexOf('DateFrom');
    const DATE_TO_INDEX = HEADER.indexOf('DateTo');

    const DATE_FROM_IN_RESULT_INDEX = RESULT_HEADER.indexOf('DateFrom');
    const DATE_TO_IN_RESULT_INDEX = RESULT_HEADER.indexOf('DateTo');

    let settings = {
        rowHeaders: true,
        colHeaders: true,
        filters: true,
        dropdownMenu: true,
        licenseKey: 'non-commercial-and-evaluation',
    };
    let solver;
    
    let findValidDate = (dateStr) => {
        let date = moment(dateStr, moment.ISO_8601);
        if(!date._isValid) {
            date = moment(dateStr, FORMATS, true);
        }
        return date;

    };
    assert(findValidDate("2014/01/05")._isValid);
    
    let getOverlapDays = (m1, m2, m3, m4)=>{
        if ( m1.diff(m4, 'days') <= 0 && m3.diff(m2, 'days') <= 0){
            let earlyEdge, laterEdge;
            if (m1.diff(m3, 'days') >= 0) {
                earlyEdge = m1;
            } else {
                earlyEdge = m3;
            }
            if (m4.diff(m2, 'days') >= 0) {
                laterEdge = m2;
            } else {
                laterEdge = m4;
            }

            return laterEdge.diff(earlyEdge, 'days');
        }
        return 0;
    };
    console.log(`${DEBUG}document loaded.`);
    class ProblemSolver {
        url = DEMO_CSV_URL;
        initialFileName = 'no file selected';
        gridElement = $("#demo");
        fileNameElement = $("#file-selected-name");
        resultElement = $("#results-demo").hide();
        resultInfoElement = $("#results-info");
        toggetherElement = $("#toggether-demo").hide();
        toggetherInfoElement = $("#toggether-info");
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
                transform:function(value, column){
                    value = value.trim();
                    if (HEADER.indexOf(value)>=0 || column >= DATE_FROM_INDEX){
                        //don't parse header values
                        //don't parse date fields
                        return value;
                    }
                    return parseInt(value, 10);
                },
                complete: (results)=>{
                    return this.handleParsedCSV(results.data);
                }
            });
        };
        handleParsedCSV = (data)=>{
            console.log(`${DEBUG} handle csv works:`);
            this.table = data;
            this.header = this._header(data);
            if (!this.header || this.header[0]=="EmpID"){
                this.prepareResults();
                this.presentDataToHTML();
            } else {
                this.clearGrid();
            }
        };
        prepareResults() {
            this.result = [];
            this.workedTogether = [];
            this.table.forEach((row, row_index)=>{
                // for workedTogether
                // we need the state before we add the new record
                let otherRows = this.result.slice(0);
                // do find the result row for worked on ProjectID
                let dateFrom = findValidDate(row[DATE_FROM_INDEX]);
                let dateTo;
                if (row[DATE_TO_INDEX].toUpperCase() == "NULL") {
                    dateTo = moment();
                    row[DATE_TO_INDEX] = "Now";
                } else {
                    dateTo = findValidDate(row[DATE_TO_INDEX]);
                }
                let resultRow = row.slice(0);
                resultRow.splice(DATE_FROM_INDEX,2,dateTo.diff(dateFrom,'days'), dateFrom, dateTo);
                this.result.push(resultRow);
                // workedTogether
                otherRows.forEach((otherResultRow)=>{
                    //filter other projects
                    if (otherResultRow[1] != resultRow[1] ||  // in diffrent project
                        otherResultRow[0] == resultRow[0]     // same employee
                    ) { return; }
                    let d3 = otherResultRow[DATE_FROM_IN_RESULT_INDEX];
                    let d4 = otherResultRow[DATE_TO_IN_RESULT_INDEX];
                    let overlapDays = getOverlapDays(dateFrom, dateTo, d3, d4);
                    if (overlapDays > 0) {
                        this.workedTogether.push([resultRow[0], otherResultRow[0], resultRow[1], overlapDays])
                    }
                });
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
            console.log("RESULT days worked toggether:", this.workedTogether);
            this.toggetherInfoElement.html("Days worked toggether:");
            this.toggetherElement.show();
            this.datagridOfToggetheResult = new Handsontable(this.toggetherElement.empty()[0], {
                ...settings,
                data:this.workedTogether,
                colHeaders:TOGGETHER_HEADER
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
            this.table = null;
            this.fileNameElement.html(this.initialFileName);
            this.resultInfoElement.html(this.initialFileName);
            $(this.gridElement).empty();
            $(this.resultElement).empty();
            $(this.toggetherElement).empty();
        };
    };

    solver = new ProblemSolver();
    $("#load-demo").on("click", () => {
        solver.loadDemoDataURL();
    });
    $("#clear").on("click", () => {
        solver.clearGrid();
    });
    $("#select").on("click", () => {
        solver.handleUpload();
    });
});