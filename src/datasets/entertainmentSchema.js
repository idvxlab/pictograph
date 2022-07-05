import FieldType from '../constants/FieldType';

const entertainmentSchema = [
    {
        name: "Category",
        type: FieldType.NOMINAL,
    },
    {
        name: "Counts",
        type: FieldType.QUANTITATIVE,
    },
    {
        name: "Season",
        type: FieldType.NOMINAL,
    },
    {
        name: 'Date',
        type: FieldType.TEMPORAL
    },
    {
        name: "Sex",
        type: FieldType.NOMINAL,
    },
    {
        name: "Age",
        type: FieldType.NOMINAL,
    },
    {
        name: "Relaxation",
        type: FieldType.QUANTITATIVE,
    },
    {
        name: "Satisfaction",
        type: FieldType.QUANTITATIVE,
    }
    

];

export default entertainmentSchema;