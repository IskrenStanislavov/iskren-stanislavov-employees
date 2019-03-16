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
                Papa.parse(data, {
                    // header:true,
                    complete: this.presentDataToHTML
                });
            });
        };
        handleUpload() {
            let that = this;
            $('input#file-input').on("change", function () {
                var files = this.files;
                for (var i = 0; i < files.length; i++) {
                    if (this.files[i].presented) continue;
                    this.files[i].presented = true;
                    Papa.parse(this.files[i], {
                        skipEmptyLines: true,
                        complete: that.presentDataToHTML
                    });
                }
            }).click();
        };
        presentDataToHTML = (results) => {
            this.currentData = results && results.data;
            this.datagridOfFile.loadData(this.currentData || INITIAL);
            this.resolveResults();
            console.log(`${DEBUG}results:`, results);
            console.log(`${DEBUG}present works:`);
        };
        truncateHeader(){
            if (!this.currentData){
                return;
            }
            if (
                this.currentData.indexOf('EmpID') ||
                this.currentData.indexOf('ProjectID') ||
                this.currentData.indexOf('DateFrom') ||
                this.currentData.indexOf('DateFromTo')
            ){
                this.currentData.splice(0,1)
            }

        }
        resolveResults() {
            if (!this.currentData){
                return;
            }
            this.truncateHeader();
            let result = [];
            this.currentData.forEach((row, row_index)=>{
                let dateFrom = findValidDate(row[2].trim());
                let dateTo;
                if (row[3].trim().toUpperCase() == "NULL") {
                    dateTo = moment();
                } else {
                    dateTo = findValidDate(row[3].trim());
                }
                result.push(row.slice(0,2).concat([dateFrom, dateTo]));
//                 row.splice(2,2, dateFrom, dateTo);
            });
            this.resultInfoElement.html("Result:");
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