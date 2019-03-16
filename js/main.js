"use strict";
Zepto(($) => {
    let DEBUG = "DEBUG: ";
    let DEMO_CSV_URL = "https://raw.githubusercontent.com/IskrenStanislavov/iskren-stanislavov-employees/master/data/employee_projects_with_header.csv";
    let INITIAL = [
        ["heading1", "heading2", "heading3", "heading4", "heading5"],
        ["value1_1", "value2_1", "value3_1", "value4_1", "value5_1"],
        ["value1_2", "value2_2", "value3_2", "value4_2", "value5_2"],
        ["value1_3", "value2_3", "value3_3", "value4_3", "value5_3"],
    ];
    let settings = { licenseKey: 'non-commercial-and-evaluation' };
    let parser;

    console.log(`${DEBUG}document loaded.`);
    class Parser {
        url = DEMO_CSV_URL;
        initialFileName = 'no file selected';
        gridElement = $("#demo");
        fileNameElement = $("#file-selected-name")
        resultsInfoElement = $("#results-info")
        constructor(url) {
            if (!!url) {
                this.url = url;
            }
            this.currentData = null;
            this.fileNameElement.html(this.initialFileName)
            this.resultsInfoElement.html(this.initialFileName)
            this.datagrid = new Handsontable($("<div></div>").appendTo(this.gridElement)[0], settings);
            console.log(`${DEBUG}url to be loaded for demo:`, this.url);
            this.presentDataToHTML(INITIAL);
        };
        loadDemoDataURL() {
            window.fetch(this.url).then((response) => response.blob()).then((data) => {
                console.log(`${DEBUG}blob to be parsed:`, data);
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
                        complete: that.presentDataToHTML
                    });
                }
            }).click();
        };
        presentDataToHTML = (results) => {
            this.currentData = results.data || INITIAL;
            this.datagrid.loadData(this.currentData);
            console.log(`${DEBUG}results:`, results);
            console.log(`${DEBUG}present works:`);
        };
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