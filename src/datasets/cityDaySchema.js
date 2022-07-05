import FieldType from '../constants/FieldType';

const cityDaySchema = [
    {
        name: "Region",
        type: FieldType.NOMINAL,
    },
    {
        name: "City",
        type: FieldType.NOMINAL,
    },
    {
        name: "CO2",
        type: FieldType.QUANTITATIVE,
    },
    {
        name: "Air_quality",
        type: FieldType.NOMINAL,
    },
    {
        name: "Water_Quality",
        type: FieldType.QUANTITATIVE,
    }, 
    {
        name: "Traffic",
        type: FieldType.QUANTITATIVE,
    }, 
    {
        name: "Population",
        type: FieldType.QUANTITATIVE,
    }, 
    {
        name: "Economy",
        type: FieldType.QUANTITATIVE,
    },
    {
        name: "Year",
        type: FieldType.TEMPORAL,
    }
];

export default cityDaySchema;