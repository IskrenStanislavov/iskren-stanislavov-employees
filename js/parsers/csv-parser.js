"use strict";

if (false) {
    let header = ["heading1", "heading2", "heading3", "heading4", "heading5"],
    row1 = ["value1_1", "value2_1", "value3_1", "value4_1", "value5_1"],
    row2 = ["value1_2", "value2_2", "value3_2", "value4_2", "value5_2"],
    row3 = ["value1_3", "value2_3", "value3_3", "value4_3", "value5_3"],
    csv_file_data = [
        header.join(CSV_SEPARATOR),
        row1.join(CSV_SEPARATOR),
        row2.join(CSV_SEPARATOR),
        row3.join(CSV_SEPARATOR),
    ].join("\n")
}
