"use strict";
Zepto(($) => {
    let DEBUG = "DEBUG: ";
    let DEMO_CSV_URL = "https://raw.githubusercontent.com/IskrenStanislavov/iskren-stanislavov-employees/master/data/employee_projects_with_header.csv";
    let parser;
    console.log(`${DEBUG}document loaded.`);
    class Parser {
        url = DEMO_CSV_URL
        constructor(url) {
            if (!!url){
                this.url = url;
            }
            console.log(`${DEBUG}url to be loaded for demo:`, this.url);
        };
        loadDemoDataURL() {
            window.fetch(this.url).then((response) => response.blob()).then((data) => {
                console.log(`${DEBUG}blob to be parsed:`,data);
                Papa.parse(data, {
        //             header:true,
                    complete: this.presentDataToHTML
                });
            });
        };
        presentDataToHTML = (results)=>{
            console.log(`data:`, results.data);
            console.log(`${DEBUG}meta:`, results.meta);
            console.log(`${DEBUG}present works:`);
        };
    };
    
    // this is the Zepto way for handling document.onload
    var outputField = document.getElementById("demo");
    outputField.innerHTML = "The output will appear here";



    $("#load-demo").on("click", ()=>{
        parser = new Parser()
        parser.loadDemoDataURL();
    })
    $("button#select").on("click", () => {
        $('input#file-input').on("change", function () {
            //code hint used: https://www.webcodegeeks.com/html5/html5-file-upload-example/
            var files = this.files;
            for (var i = 0; i < files.length; i++) {
                Papa.parse(this.files[0], {
                    complete: function(results) {
                        console.log("data:", results);
                        console.log("meta:", results.meta);
                    }
                });
            }
        }).click();
    });
});