import FieldType from '@/constants/FieldType';

const channels = {
    // x: {
    //     name: 'x',
    //     type: [ FieldType.TEMPORAL], // FieldType.NOMINAL, FieldType.ORDINAL,
    // },
    // y: {
    //     name: 'y',
    //     type: [FieldType.QUANTITATIVE],
    //     aggregation: 'average'
    // },
    size: {
        name: 'size',
        namecss: 'size',
        type:[FieldType.QUANTITATIVE],
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