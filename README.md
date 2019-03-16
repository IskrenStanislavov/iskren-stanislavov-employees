Instructions:
----------------

Clone or download and run from the file system. You don't need a server on localhost. You will need internet for some of the libraries, however.


Libraries used
----------------

Thanks to [Zepto](https://zeptojs.com/) for the lightweight replacement of `jQuery`.
Thanks to [Papa.Parse](https://www.papaparse.com/demo) for the CSV file parsing.
Thanks to [moment.js](https://momentjs.com/) for all the date-time handling.

Notes:
==========

If you want you can filter the debug logs with: "DEBUG:"

Please note, that I could have easily selected a single record out of many when looking for the longest overlapping period, but I decided to visualise all of the overlapping periods of all possibilities.

Also: shuffling the columns won't work.
Also: If you choose a file without header row the file can be treated.
Also: won't work on old browsers as I wrote the project with a lot of ES6 functionality.
Also: I didn't have time to implement testing env.

Started on March 16th 2019 at 8 am.
Completed on March 16th 2019 at 22:30.