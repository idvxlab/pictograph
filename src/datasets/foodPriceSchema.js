import FieldType from '../constants/FieldType';

const foodPriceSchema = [
    {
        name: "Fruit",
        type: FieldType.NOMINAL,
    },
    {
        name: "Province",
        type: FieldType.NOMINAL,
    },
    {
        name: "Price",
        type: FieldType.QUANTITATIVE,
    },
    {
        name: "Sales",
        type: FieldType.QUANTITATIVE,
    },
    {
        name: "Date",
        type: FieldType.TEMPORAL,
    }
];

export default foodPriceSchema;