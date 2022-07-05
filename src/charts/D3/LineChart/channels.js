import FieldType from '@/constants/FieldType';

const channels = {
    x: {
        name: 'x',
        namecss: 'x',
        type: [ FieldType.TEMPORAL], // FieldType.NOMINAL, FieldType.ORDINAL,
    },
    y: {
        name: 'y',
        namecss: 'y',
        type: [FieldType.QUANTITATIVE],
        aggregation: 'average'
    },
    color: {
        name: 'color',
        namecss: 'color',
        type: [FieldType.NOMINAL, FieldType.ORDINAL, FieldType.TEMPORAL],
    },
    // time: {
    //     name: 'time',
    //     type: [FieldType.NOMINAL, FieldType.ORDINAL, FieldType.TEMPORAL],
    //     animation: true,
    // }
};

export default channels;