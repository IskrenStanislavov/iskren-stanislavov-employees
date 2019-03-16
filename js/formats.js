const SEPARATORS = "-/|\," // add all separators you need for the dates
    .split("").concat("");//this will add the empty separator as date can be added as '31012019'

const FORMATS_MORE = [
    "YYYY*MM*DD",
    "YYYY*MM*D",
    "YYYY*M*DD",
    "YYYY*M*D",
    "YY*MM*DD",
    "YY*MM*D",
    "YY*M*DD",
    "YY*M*D",
    "MM*DD",
    "MM*D",
    "M*DD",
    "M*D",
    "DD*MM*YYYY",
    "D*MM*YYYY",
    "DD*M*YYYY",
    "D*M*YYYY",
    "DD*MM*YY",
    "D*MM*YY",
    "DD*M*YY",
    "D*M*YY",
    "DD*MM",
    "D*MM",
    "DD*M",
    "D*M",
];

let variations = [];
SEPARATORS.forEach((sep) => {
    FORMATS_MORE.forEach((fmt) => {
        variations.push(fmt.replaceAll('*', sep));
    });
});
const FORMATS = variations.slice(0);
