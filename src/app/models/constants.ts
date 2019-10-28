import {ToggleItem} from './toggle-item.model';
import {ListItem} from './listItem';
import {Column} from './column.model';
import {NavItem} from './nav-item.model';
import {NavArray} from './nav-array.model';

export class Constants {

  // Groupings can not be determined automatically so the definition of groupings are done here
  public static get ENVIRONMENTAL_COLUMN_ARRAY(): NavArray {
    return new NavArray({
      arrayName: 'environmentalArray',
      columnArray: [
        new Column({
          columnName: 'EnvironmentalClass',
          columnTitle: 'Environmental Class',
          arrayIndex: 0,
          level: 0
        }),
        new Column({
          columnName: 'EnvironmentalSubclass',
          columnTitle: 'Environmental Subclass',
          arrayIndex: 0,
          level: 1
        })
      ]
    });
  }

  public static get ECOLOGICAL_COLUMN_ARRAY(): NavArray {
    return new NavArray({
      arrayName: 'ecologicalArray',
      columnArray: [
        new Column({
          columnName: 'EcologicalClass',
          columnTitle: 'Ecological End-Product Class',
          arrayIndex: 1,
          level: 0
        })]
    });
  }

  public static get DIRECT_USE_COLUMN_ARRAY(): NavArray {
    return new NavArray({
      arrayName: 'directUseArray',
      columnArray: [
        new Column({
          columnName: 'DirectUseClass',
          columnTitle: 'Direct Use/Non-Use Class',
          arrayIndex: 2,
          level: 0
        }),
        new Column({
          columnName: 'DirectUseSubclassI',
          columnTitle: 'Direct Use/Non-Use Subclass I',
          arrayIndex: 2,
          level: 1
        }),
        new Column({
          columnName: 'DirectUseSubclassII',
          columnTitle: 'Direct Use/Non-Use Subclass II',
          arrayIndex: 2,
          level: 2
        })
      ]
    });
  }

  public static get DIRECT_USER_COLUMN_ARRAY(): NavArray {
    return new NavArray({
      arrayName: 'directUserArray',
      columnArray: [
        new Column({
          columnName: 'DirectUserClass',
          columnTitle: 'Direct User Class',
          level: 3,
          arrayIndex: 0
        }),
        new Column({
          columnName: 'DirectUserSubclassI',
          columnTitle: 'Direct User Subclass I',
          arrayIndex: 3,
          level: 1
        }),
        new Column({
          columnName: 'DirectUserSubclassII',
          columnTitle: 'Direct User Subclass II',
          arrayIndex: 3,
          level: 2
        })]
    });
  }

  public static get BENEFICIARY_COLUMN_ARRAY(): NavArray {
    return new NavArray({
      arrayName: 'beneficiaryArray',
      columnArray: [
        new Column({
          columnName: 'BeneficiaryCategory',
          columnTitle: 'Beneficiary Category',
          arrayIndex: 4,
          level: 0
        }),
        new Column({
          columnName: 'BeneficiarySubcategory',
          columnTitle: 'Beneficiary Subcategory',
          arrayIndex: 4,
          level: 1
        })]
    });
  }

  public static get BENEFICIARY_ID_COLUMN(): NavArray {
    return new NavArray({
      arrayName: 'beneficiaryIdArray',
      columnArray: [
        new Column({columnName: 'FEGSIDNumber', columnTitle: 'FEGS ID Number', arrayIndex: 0, level: 0})
      ]
    });
  }

  // public static get ANCILIARY_COLUMN_ARRAY(): Array<string> {
  //   return ['Importance', 'Status', 'Source', 'Notes', 'MeasurementType', 'FEGSMeasurementincludingUnits'];
  // }

  public static get ID_COLUMN(): NavArray {
    return new NavArray({
      arrayName: 'idArray',
      columnArray: [
        new Column({columnName: 'FESID2244', columnTitle: 'FESID2244', arrayIndex: 0, level: 0})
      ]
    });
  }

  public static COLUMN_MAP: Array<NavArray> = []
    .concat(Constants.ENVIRONMENTAL_COLUMN_ARRAY)
    .concat(Constants.ECOLOGICAL_COLUMN_ARRAY)
    .concat(Constants.DIRECT_USE_COLUMN_ARRAY)
    .concat(Constants.DIRECT_USER_COLUMN_ARRAY)
    .concat(Constants.BENEFICIARY_COLUMN_ARRAY)
    .concat(Constants.BENEFICIARY_ID_COLUMN)
    .concat(Constants.ID_COLUMN);

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

