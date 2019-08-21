import {ToggleItem} from './toggle-item.model';
import {ListItem} from './listItem';

export class Constants {

  public static get ENVIRONMENTAL_COLUMN_ARRAY(): Array<string> {
    return ['EnvironmentalClass', 'EnvironmentalSubclass'];
  }

  public static get ECOLOGICAL_COLUMN_ARRAY(): Array<string> {
    return ['Ecological End-Product Class'];
  }

  public static get DIRECT_USE_COLUMN_ARRAY(): Array<string> {
    return ['Direct Use/Non-Use Class', 'Direct Use/Non-Use Subclass I', 'Direct Use/Non-Use Subclass II'];
  }

  public static get DIRECT_USER_COLUMN_ARRAY(): Array<string> {
    return ['Direct User Class', 'Direct User Subclass I', 'Direct User Subclass II'];
  }

  public static get BENEFICIARY_COLUMN_ARRAY(): Array<string> {
    return ['BeneficiaryCategory', 'BeneficiarySubcategory'];
  }

  public static get BENEFICIARY_ID_COLUMN_ARRAY(): Array<string> {
    return ['FEGSIDNumber'];
  }

  public static get ANCILIARY_COLUMN_ARRAY(): Array<string> {
    return ['FEG type', 'Example', 'Importance', 'FEGSMeasurementincludingUnits', 'MeasurementType', 'Status', 'Source', 'Notes'];
  }

  public static get ID_COLUMN_ARRAY(): Array<string> {
    return ['FESID2244'];
  }

  public static get NAV_ARRAY(): Array<any> {
    return [
      {name: 'environmental', dataPoint: 'environmentalArray', keys: ['environmentalClass', 'environmentalSubClass']},
      {name: 'ecological', dataPoint: 'ecologicalArray', keys: ['ecologicalClass']},
      {name: 'directUse', dataPoint: 'directUseArray', keys: ['directUseClass', 'directUseSubClassI', 'directUseSubClassII']},
      {name: 'directUser', dataPoint: 'directUserArray', keys: ['directUserClass', 'directUserSubClassI', 'directUserSubClassII']},
      {name: 'beneficiary', dataPoint: 'beneficiaryArray', keys: ['beneficiaryClass', 'beneficiarySubClass']}
    ];
  }

  public static COLUMN_MAP: Array<any> = [
    ['environmentalClass', 'EnvironmentalClass', 'Environmental Class'],
    ['environmentalSubClass', 'EnvironmentalSubclass', 'Environmental Subclass'],
    ['ecologicalClass', 'Ecological End-Product Class', 'Ecological End-Product Class'],
    ['directUseClass', 'Direct Use/Non-Use Class', 'Direct Use/Non-Use Class'],
    ['directUseSubclassI', 'Direct Use/Non-Use Subclass I', 'Direct Use/Non-Use Subclass I'],
    ['directUseSubclassII', 'Direct Use/Non-Use Subclass II', 'Direct Use/Non-Use Subclass II'],
    ['directUserClass', 'Direct User Class', 'Direct User Class'],
    ['directUserSubclassI', 'Direct User Subclass I', 'Direct User Subclass I'],
    ['directUserSubclassII', 'Direct User Subclass II', 'Direct User Subclass II'],
    ['beneficiaryClass', 'BeneficiaryCategory', 'Beneficiary Category'],
    ['beneficiarySubClass', 'BeneficiarySubcategory', 'Beneficiary Subcategory'],
    ['', 'FEGSIDNumber', 'FEGS ID Number'],
    ['', 'FEG type', 'FEG type'],
    ['', 'Example', 'Example'],
    ['', 'FESID2244', 'FESID2244'],
    ['', 'Importance', 'Importance'],
    ['', 'FEGSMeasurementincludingUnits', 'FEGS Measurement including Units'],
    ['', 'MeasurementType', 'Measurement Type'],
    ['', 'Status', 'Status'],
    ['', 'Source', 'Source'],
    ['', 'Notes', 'Notes']
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
      column: 'Ecological End-Product Class',
      checked: true,
      children: []
    }),
    new ListItem({
      title: 'Direct Use/Non-Use Class',
      column: 'Direct Use/Non-Use Class',
      checked: true,
      children: [
        new ListItem({
          title: 'Direct Use/Non-Use Subclass I',
          column: 'Direct Use/Non-Use Subclass I',
          checked: true,
          children: [
            new ListItem({
              title: 'Direct Use/Non-Use Subclass II',
              column: 'Direct Use/Non-Use Subclass II',
              checked: true,
              children: []
            })
          ]
        })
      ]
    }),
    new ListItem({
      title: 'Direct User Class',
      column: 'Direct User Class',
      checked: true,
      children: [
        new ListItem({
          title: 'Direct User Subclass I',
          column: 'Direct User Subclass I',
          checked: true,
          children: [
            new ListItem({
              title: 'Direct User Subclass II',
              column: 'Direct User Subclass II',
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
      column: 'FEG type',
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

}

