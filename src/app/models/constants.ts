import {ToggleItem} from './toggle-item.model';
import {ListItem} from './listItem';
import {Column} from './column.model';

export class Constants {

  public static get ENVIRONMENTAL_COLUMN_ARRAY(): Array<string> {
    return ['EnvironmentalClass', 'EnvironmentalSubclass'];
  }

  public static get ECOLOGICAL_COLUMN_ARRAY(): Array<string> {
    return ['EcologicalClass'];
  }

  public static get DIRECT_USE_COLUMN_ARRAY(): Array<string> {
    return ['DirectUseClass', 'DirectUseSubclassI', 'DirectUseSubclassII'];
  }

  public static get DIRECT_USER_COLUMN_ARRAY(): Array<string> {
    return ['DirectUserClass', 'DirectUserSubclassI', 'DirectUserSubclassII'];
  }

  public static get BENEFICIARY_COLUMN_ARRAY(): Array<string> {
    return ['BeneficiaryCategory', 'BeneficiarySubcategory'];
  }

  public static get BENEFICIARY_ID_COLUMN_ARRAY(): Array<string> {
    return ['FEGSIDNumber'];
  }

  public static get ANCILIARY_COLUMN_ARRAY(): Array<string> {
    return ['Importance', 'Status', 'Source', 'Notes', 'MeasurementType', 'FEGSMeasurementincludingUnits'];
  }

  public static get ID_COLUMN_ARRAY(): Array<string> {
    return ['FESID2244'];
  }

  public static FULL_COLUMN_DISPLAY = new Array<string>().concat(Constants.ENVIRONMENTAL_COLUMN_ARRAY)
    .concat(Constants.ECOLOGICAL_COLUMN_ARRAY).concat(Constants.DIRECT_USE_COLUMN_ARRAY).concat(Constants.DIRECT_USER_COLUMN_ARRAY)
    .concat(Constants.BENEFICIARY_COLUMN_ARRAY).concat(Constants.BENEFICIARY_ID_COLUMN_ARRAY).concat(Constants.ANCILIARY_COLUMN_ARRAY)
    .concat(Constants.ID_COLUMN_ARRAY);

  public static DIRECT_USE_DISPLAY = new Array<string>().concat(Constants.ENVIRONMENTAL_COLUMN_ARRAY, Constants.ECOLOGICAL_COLUMN_ARRAY,
    Constants.DIRECT_USE_COLUMN_ARRAY, Constants.DIRECT_USER_COLUMN_ARRAY, Constants.ID_COLUMN_ARRAY);

  public static get NAV_ARRAY(): Array<any> {
    return [
      {name: 'environmental', dataPoint: 'environmentalArray', keys: ['environmentalClass', 'environmentalSubClass']},
      {name: 'ecological', dataPoint: 'ecologicalArray', keys: ['ecologicalClass']},
      {name: 'directUse', dataPoint: 'directUseArray', keys: ['directUseClass', 'directUseSubClassI', 'directUseSubClassII']},
      {name: 'directUser', dataPoint: 'directUserArray', keys: ['directUserClass', 'directUserSubClassI', 'directUserSubClassII']},
      {name: 'beneficiary', dataPoint: 'beneficiaryArray', keys: ['beneficiaryClass', 'beneficiarySubClass']}
    ];
  }

  public static COLUMN_MAP: Array<Column> = [
    new Column({
      arrayName: 'environmentalClass',
      columnName: 'EnvironmentalClass',
      columnTitle: 'Environmental Class',
      arrayIndex: 0,
      level: 0
    }),
    new Column({
      arrayName: 'environmentalSubClass',
      columnName: 'EnvironmentalSubclass',
      columnTitle: 'Environmental Subclass',
      arrayIndex: 0,
      level: 1
    }),
    new Column({
      arrayName: 'ecologicalClass',
      columnName: 'EcologicalClass',
      columnTitle: 'Ecological End-Product Class',
      arrayIndex: 1,
      level: 0
    }),
    new Column({
      arrayName: 'directUseClass',
      columnName: 'DirectUseClass',
      columnTitle: 'Direct Use/Non-Use Class',
      arrayIndex: 2,
      level: 0
    }),
    new Column({
      arrayName: 'directUseSubclassI',
      columnName: 'DirectUseSubclassI',
      columnTitle: 'Direct Use/Non-Use Subclass I',
      arrayIndex: 2,
      level: 1
    }),
    new Column({
      arrayName: 'directUseSubclassII',
      columnName: 'DirectUseSubclassII',
      columnTitle: 'Direct Use/Non-Use Subclass II',
      arrayIndex: 2,
      level: 2
    }),
    new Column({arrayName: 'directUserClass', columnName: 'DirectUserClass', columnTitle: 'Direct User Class', level: 3, arrayIndex: 0}),
    new Column({
      arrayName: 'directUserSubclassI',
      columnName: 'DirectUserSubclassI',
      columnTitle: 'Direct User Subclass I',
      arrayIndex: 3,
      level: 1
    }),
    new Column({
      arrayName: 'directUserSubclassII',
      columnName: 'DirectUserSubclassII',
      columnTitle: 'Direct User Subclass II',
      arrayIndex: 3,
      level: 2
    }),
    new Column({
      arrayName: 'beneficiaryClass',
      columnName: 'BeneficiaryCategory',
      columnTitle: 'Beneficiary Category',
      arrayIndex: 4,
      level: 0
    }),
    new Column({
      arrayName: 'beneficiarySubClass',
      columnName: 'BeneficiarySubcategory',
      columnTitle: 'Beneficiary Subcategory',
      arrayIndex: 4,
      level: 1
    }),
    new Column({arrayName: '', columnName: 'FEGSIDNumber', columnTitle: 'FEGS ID Number', arrayIndex: 0, level: 0}),
    new Column({arrayName: '', columnName: 'FEGtype', columnTitle: 'FEG type', arrayIndex: 0, level: 0}),
    new Column({arrayName: '', columnName: 'Example', columnTitle: 'Example', arrayIndex: 0, level: 0}),
    new Column({arrayName: '', columnName: 'FESID2244', columnTitle: 'FESID2244', arrayIndex: 0, level: 0}),
    new Column({arrayName: '', columnName: 'Importance', columnTitle: 'Importance', arrayIndex: 0, level: 0}),
    new Column({
      arrayName: '',
      columnName: 'FEGSMeasurementincludingUnits',
      columnTitle: 'FEGS Measurement including Units',
      arrayIndex: 0,
      level: 0
    }),
    new Column({arrayName: '', columnName: 'MeasurementType', columnTitle: 'Measurement Type', arrayIndex: 0, level: 0}),
    new Column({arrayName: '', columnName: 'Status', columnTitle: 'Status', arrayIndex: 0, level: 0}),
    new Column({arrayName: '', columnName: 'Source', columnTitle: 'Source', arrayIndex: 0, level: 0}),
    new Column({arrayName: '', columnName: 'Notes', columnTitle: 'Notes', arrayIndex: 0, level: 0}),
  ];

  public static TOGGLE_COLUMN_MAP: Array<ListItem> = new Array<ListItem>(
    new ListItem({
      title: 'Environmental Class',
      column: 'EnvironmentalClass',
      checked: true,
      children: [
        new ListItem({
          title: 'Environmental Subclass',
          column: 'EnvironmentalSubclass',
          checked: true,
          children: []
        })
      ]
    }),
    new ListItem({
      title: 'Ecological End-Product Class',
      column: 'EcologicalClass',
      checked: true,
      children: []
    }),
    new ListItem({
      title: 'Direct Use/Non-Use Class',
      column: 'DirectUseClass',
      checked: true,
      children: [
        new ListItem({
          title: 'Direct Use/Non-Use Subclass I',
          column: 'DirectUseSubclassI',
          checked: true,
          children: [
            new ListItem({
              title: 'Direct Use/Non-Use Subclass II',
              column: 'DirectUseSubclassII',
              checked: true,
              children: []
            })
          ]
        })
      ]
    }),
    new ListItem({
      title: 'Direct User Class',
      column: 'DirectUserClass',
      checked: true,
      children: [
        new ListItem({
          title: 'Direct User Subclass I',
          column: 'DirectUserSubclassI',
          checked: true,
          children: [
            new ListItem({
              title: 'Direct User Subclass II',
              column: 'DirectUserSubclassII',
              checked: true,
              children: []
            })
          ]
        })
      ]
    }),
    new ListItem({
      column: 'BeneficiaryCategory',
      title: 'Beneficiary Category',
      checked: true,
      children: [
        new ListItem({
          title: 'Beneficiary Subcategory',
          column: 'BeneficiarySubcategory',
          checked: true,
          children: []
        })
      ]
    }),
    new ListItem({
      title: 'FEGS ID Number',
      column: 'FEGSIDNumber',
      checked: true,
      children: []
    }),
    new ListItem({
      title: 'FEG type',
      column: 'FEGtype',
      checked: true,
      children: []
    }),
    new ListItem({
      title: 'Example',
      column: 'Example',
      checked: true,
      children: []
    }),
    new ListItem({
      title: 'FESID2244',
      column: 'FESID2244',
      checked: true,
      children: []
    })
  );

  public static EXCEL_COLUMNS = new Array<string>('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI',
    'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ');

}

